"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Client, Order, Settings, GoldRates } from '../types';
import { supabase } from "../utils/supabase";
import { toast } from 'sonner';

// --- Constants & Defaults ---
const DEFAULT_SETTINGS: Settings = {
  language: 'en',
  theme: 'light',
  goldRates: {
    gold24k: 7000,
    gold22k: 6400,
    lastUpdated: new Date().toISOString(),
  },
  shopDetails: {
    name: 'Radha Madhav Casting',
    address: 'Jewelers Market, Panvel',
    phone: '+91 7977696813',
    gst: '27ABCU9603R1ZM'
  },
  storageUsage: 0, // Added to track real usage
};

interface AppContextType {
  currentUser: any | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clients: Client[];
  addClient: (clientData: any) => Promise<Client | any>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClient: (id: string) => Client | undefined;
  orders: Order[];
  addOrder: (orderData: any) => Promise<Order | any>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  updateOrderStage: (id: string, stage: Order['currentStage'], deliveryProof?: any) => Promise<void>;
  getOrder: (id: string) => Order | undefined;
  getClientOrders: (clientId: string) => Order[];
  settings: Settings;
  updateGoldRates: (rates: Partial<GoldRates>) => void;
  updateSettings: (updates: Partial<Settings>) => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // --- Initialize App ---
  useEffect(() => {
    const initApp = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setCurrentUser(session?.user ?? null);

        if (session?.user) {
          const [clientsRes, ordersRes] = await Promise.all([
            supabase.from('clients').select('*').order('name'),
            supabase.from('orders').select('*').order('createdAt', { ascending: false })
          ]);

          if (clientsRes.data) setClients(clientsRes.data);
          if (ordersRes.data) setOrders(ordersRes.data);
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initApp();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  // --- Real-time Storage Calculator ---
  useEffect(() => {
    const calculateStorage = async () => {
      if (!currentUser) return;

      try {
        // List all files in the buckets to calculate real-time usage
        const folders = ['order-photos', 'delivery-photos', 'signatures'];
        let totalSize = 0;

        for (const folder of folders) {
          const { data, error } = await supabase.storage.from('order-attachments').list(folder);
          if (data) {
            totalSize += data.reduce((acc, file) => acc + (file.metadata?.size || 0), 0);
          }
        }

        // Convert bytes to Megabytes for the settings state
        const sizeInMB = totalSize / (1024 * 1024);
        setSettings(prev => ({ ...prev, storageUsage: sizeInMB }));
      } catch (err) {
        console.error("Storage calculation error:", err);
      }
    };

    calculateStorage();
  }, [orders, currentUser]); // Recalculate when orders change (new uploads)

  // --- Storage Helper (Fixed for concurrent uploads) ---
  const uploadAttachment = async (base64OrFile: string, folder: string) => {
    try {
      if (!base64OrFile || base64OrFile.startsWith('http')) return base64OrFile;

      const res = await fetch(base64OrFile);
      const blob = await res.blob();
      const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.png`;

      const { data, error } = await supabase.storage
        .from('order-attachments')
        .upload(fileName, blob, { contentType: 'image/png', upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('order-attachments')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (err) {
      console.error(`Upload error in folder ${folder}:`, err);
      return null;
    }
  };

  // --- Auth Actions ---
  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { toast.error(error.message); return false; }
    toast.success("Welcome back!");
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setClients([]);
    setOrders([]);
    toast.success("Logged out successfully");
  };

  // --- Client Actions ---
  const addClient = async (clientData: any) => {
    const { data, error } = await supabase.from('clients').insert([{
        name: clientData.name,
        phone: clientData.phone,
        address: clientData.address,
        gstNumber: clientData.gstNumber,
        totalGoldGiven: 0,
        totalGoldDelivered: 0,
      }]).select();

    if (error) { toast.error("Error adding client"); throw error; }
    setClients(prev => [...prev, data[0]]);
    return data[0];
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    const { error } = await supabase.from('clients').update(updates).eq('id', id);
    if (error) toast.error("Update failed");
    else setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteClient = async (id: string) => {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) toast.error("Delete failed");
    else setClients(prev => prev.filter(c => c.id !== id));
  };

  // --- Order Actions ---
  const addOrder = async (orderData: any) => {
    toast.loading("Creating order...");
    const photoUrl = orderData.photo ? await uploadAttachment(orderData.photo, 'order-photos') : null;

    const orderPayload = {
      clientId: orderData.clientId,
      clientName: orderData.clientName,
      jewelleryType: orderData.jewelleryType,
      totalDelivered: Number(orderData.totalDelivered),
      stoneWeight: Number(orderData.stoneWeight),
      quality: Number(orderData.quality),
      netGoldUsed: Number(orderData.netGoldUsed),
      fineGold: Number(orderData.fineGold),
      expectedDeliveryDate: orderData.expectedDeliveryDate,
      notes: orderData.notes,
      photoUrl: photoUrl,
      currentStage: 'received',
      stageHistory: [{
        stage: 'received',
        timestamp: new Date().toISOString(),
        updatedBy: currentUser?.email || 'System',
      }],
    };

    const { data, error } = await supabase.from('orders').insert([orderPayload]).select();
    toast.dismiss();

    if (error) { toast.error("Error creating order"); throw error; }
    setOrders(prev => [data[0], ...prev]);
    toast.success("Order created successfully!");
    return data[0];
  };

  const updateOrder = async (id: string, updates: Partial<Order>) => {
    const { error } = await supabase.from('orders').update(updates).eq('id', id);
    if (error) toast.error("Update failed");
    else setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const updateOrderStage = async (id: string, stage: Order['currentStage'], deliveryProof?: any) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    toast.loading(`Moving to ${stage}...`);
    let finalProof = null;

    if (stage === 'delivered' && deliveryProof) {
      try {
        const [photoUrl, sigUrl] = await Promise.all([
          uploadAttachment(deliveryProof.photo, 'delivery-photos'),
          uploadAttachment(deliveryProof.signature, 'signatures')
        ]);

        if (photoUrl && sigUrl) {
          finalProof = {
            photo: photoUrl,
            signature: sigUrl,
            deliveredBy: deliveryProof.deliveredBy || currentUser?.email || 'Staff',
            timestamp: new Date().toISOString(),
          };
        } else {
          throw new Error("One or more attachments failed to upload.");
        }
      } catch (err) {
        console.error("Handover error:", err);
        toast.dismiss();
        toast.error("Handover media upload failed.");
        return;
      }
    }

    const dbUpdates: any = {
      currentStage: stage,
      stageHistory: [...(order.stageHistory || []), {
        stage,
        timestamp: new Date().toISOString(),
        updatedBy: currentUser?.email || 'System'
      }],
    };

    if (finalProof) {
      dbUpdates.deliveryProof = finalProof;
      dbUpdates.deliveredAt = new Date().toISOString();
    }

    const { error } = await supabase.from('orders').update(dbUpdates).eq('id', id);
    toast.dismiss();

    if (error) {
      console.error("Supabase Error:", error);
      toast.error(`Sync failed: ${error.message}`);
    } else {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...dbUpdates } : o));
      toast.success(`Status: ${stage.toUpperCase()}`);
    }
  };

  const getOrder = (id: string) => orders.find(o => o.id === id);
  const getClientOrders = (clientId: string) => orders.filter(o => o.clientId === clientId);
  const getClient = (id: string) => clients.find(c => c.id === id);

  // --- Settings ---
  const updateGoldRates = (rates: Partial<GoldRates>) => {
    setSettings(prev => ({
      ...prev,
      goldRates: { ...prev.goldRates, ...rates, lastUpdated: new Date().toISOString() }
    }));
  };

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider value={{
      currentUser, login, logout, clients, addClient, updateClient, deleteClient, getClient,
      orders, addOrder, updateOrder, updateOrderStage, getOrder, getClientOrders,
      settings, updateGoldRates, updateSettings, loading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}