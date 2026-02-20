"use client";

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  LogOut,
  User,
  ShieldCheck,
  UserPlus,
  Store,
  MapPin,
  Phone,
  Hash,
  Cloud, // Changed from CloudCheck
  Zap,
  CheckCircle2 // Changed from CloudCheck for status
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export function SettingsPage() {
  const { settings, updateSettings, logout, currentUser } = useApp();

  const [shopName, setShopName] = useState(settings.shopDetails?.name || '');
  const [shopAddress, setShopAddress] = useState(settings.shopDetails?.address || '');
  const [shopPhone, setShopPhone] = useState(settings.shopDetails?.phone || '');
  const [gstNumber, setGstNumber] = useState(settings.shopDetails?.gst || '');

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');

  const isOwner = currentUser?.email === 'owner@gmail.com';

  const handleSaveShopDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      shopDetails: {
        name: shopName,
        address: shopAddress,
        phone: shopPhone,
        gst: gstNumber
      }
    });
    toast.success("Invoice header updated successfully");
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword || !newName) {
      toast.error("Please fill all fields");
      return;
    }
    toast.info("User creation request sent to admin.");
    setNewUsername(''); setNewPassword(''); setNewName('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-[1200px] mx-auto px-4 pb-12"
    >
      <header className="pt-8 text-center md:text-left">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">System Settings</h1>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Manage your Radha Madhav Casting enterprise</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-8">
          {/* Shop Details */}
          <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
            <CardHeader className="bg-slate-900 text-white p-8">
              <CardTitle className="text-sm font-black uppercase tracking-[0.3em] flex items-center gap-3">
                <Store className="w-5 h-5 text-amber-500" /> Business Profile (Invoice Header)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSaveShopDetails} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Shop Display Name</Label>
                    <div className="relative">
                      <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="e.g. Radha Madhav Casting" className="h-12 pl-12 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-amber-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">GST / Tax Number</Label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} placeholder="GSTIN-12345" className="h-12 pl-12 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-amber-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Registered Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                    <textarea
                      value={shopAddress}
                      onChange={(e) => setShopAddress(e.target.value)}
                      placeholder="Enter full workshop address..."
                      className="w-full min-h-[100px] p-4 pl-12 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-amber-500 text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-end">
                  <div className="w-full md:w-1/2 space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Contact Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input value={shopPhone} onChange={(e) => setShopPhone(e.target.value)} placeholder="+91 00000 00000" className="h-12 pl-12 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-amber-500" />
                    </div>
                  </div>
                  <Button type="submit" className="h-12 w-full md:w-auto px-8 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-amber-200">
                    Update Business Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {isOwner && (
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
              <CardHeader className="bg-amber-500 p-8">
                <CardTitle className="text-slate-900 text-sm font-black uppercase tracking-[0.3em] flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5" /> Staff Management
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Name</Label>
                    <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Full Name" className="h-12 rounded-2xl bg-slate-50 border-none" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Email</Label>
                    <Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="Email" className="h-12 rounded-2xl bg-slate-50 border-none" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Password</Label>
                    <div className="flex gap-3">
                      <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="h-12 rounded-2xl bg-slate-50 border-none" />
                      <Button type="submit" className="h-12 w-12 rounded-2xl bg-slate-900 text-white shrink-0">
                        <UserPlus size={20}/>
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-8">
          <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
            <CardContent className="p-8 text-center">
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="w-24 h-24 rounded-3xl bg-slate-900 flex items-center justify-center text-amber-500 text-3xl font-black shadow-2xl">
                  {currentUser?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white w-8 h-8 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{currentUser?.email?.split('@')[0]}</h3>
              <Badge className="mt-2 bg-amber-100 text-amber-700 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">
                {isOwner ? 'Master Admin' : 'Owner Access'}
              </Badge>
              <div className="mt-8 pt-8 border-t border-slate-50">
                 <Button variant="outline" onClick={logout} className="w-full h-12 rounded-2xl border-slate-100 text-red-500 font-black uppercase text-[10px] tracking-widest">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 p-8 bg-slate-900 text-white relative overflow-hidden">
            <Zap className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 rotate-12" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
                  <Cloud size={18} />
                </div>
                <p className="text-xs font-black uppercase tracking-widest">Cloud Services</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Database Status</span>
                  <span className="text-[10px] font-black text-green-400 uppercase">Synchronized</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Storage Used</span>
                  <span className="text-[10px] font-black text-white uppercase">1.2 GB / 5 GB</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-1">
                  <div className="bg-amber-500 h-full w-[24%] rounded-full" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}