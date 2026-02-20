"use client";

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { formatGoldWeight } from '../utils/calculations';
import { Plus, Loader2, UserPlus, Users, Sparkles, Calendar, Scale, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export function CreateOrderDialog() {
  const { clients, addClient, addOrder } = useApp();
  const [open, setOpen] = useState(false);
  const [isNewClient, setIsNewClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [clientId, setClientId] = useState('');
  const [jewelleryType, setJewelleryType] = useState('gold');
  const [totalDelivered, setTotalDelivered] = useState('');
  const [stoneWeight, setStoneWeight] = useState('');
  const [quality, setQuality] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientAddress, setNewClientAddress] = useState('');

  // Calculations
  const delivered = parseFloat(totalDelivered) || 0;
  const stone = parseFloat(stoneWeight) || 0;
  const qual = parseFloat(quality) || 0;
  const netGoldUsed = Math.max(0, delivered - stone);
  const fineGold = netGoldUsed * (qual / 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalClientId = clientId;
      let clientName = '';

      if (isNewClient) {
        if (!newClientName || !newClientPhone) {
          toast.error("Required client details missing");
          return;
        }
        const newClient: any = await addClient({
          name: newClientName,
          phone: newClientPhone,
          address: newClientAddress,
        });
        finalClientId = newClient.id;
        clientName = newClient.name;
      } else {
        const client = clients.find(c => c.id === clientId);
        if (!client) {
          toast.error("Please select a client");
          return;
        }
        clientName = client.name;
      }

      await addOrder({
        clientId: finalClientId,
        clientName,
        jewelleryType,
        totalDelivered: delivered,
        stoneWeight: stone,
        quality: qual,
        netGoldUsed,
        fineGold,
        expectedDeliveryDate,
        notes,
      });

      setOpen(false);
      resetForm();
      toast.success("New order registered successfully");
    } catch (error) {
      toast.error("Database connection error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsNewClient(false);
    setClientId('');
    setTotalDelivered('');
    setStoneWeight('');
    setQuality('');
    setExpectedDeliveryDate('');
    setNotes('');
    setNewClientName('');
    setNewClientPhone('');
    setNewClientAddress('');
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) resetForm(); }}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button size="lg" className="h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-8 shadow-xl shadow-slate-200">
            <Plus className="w-5 h-5 mr-2 text-amber-500" />
            Create New Order
          </Button>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="max-w-2xl p-0 bg-white border-none rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="bg-slate-900 p-8 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles size={80} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-3xl font-black tracking-tighter uppercase">New Casting Order</DialogTitle>
            <DialogDescription className="text-slate-400 font-medium">
              Register metal inflow and calculate fine requirements.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Section: Client Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Client Identity</h3>
            </div>
            
            <RadioGroup
              defaultValue="existing"
              className="grid grid-cols-2 gap-4"
              onValueChange={(v) => setIsNewClient(v === 'new')}
            >
              <Label
                htmlFor="existing"
                className={cn(
                  "flex items-center justify-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all",
                  !isNewClient ? "border-slate-900 bg-slate-50 shadow-inner" : "border-slate-100 opacity-60 hover:opacity-100"
                )}
              >
                <RadioGroupItem value="existing" id="existing" className="hidden" />
                <Users size={18} />
                <span className="font-bold">Existing</span>
              </Label>
              <Label
                htmlFor="new"
                className={cn(
                  "flex items-center justify-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all",
                  isNewClient ? "border-slate-900 bg-slate-50 shadow-inner" : "border-slate-100 opacity-60 hover:opacity-100"
                )}
              >
                <RadioGroupItem value="new" id="new" className="hidden" />
                <UserPlus size={18} />
                <span className="font-bold">New Client</span>
              </Label>
            </RadioGroup>

            <AnimatePresence mode="wait">
              {!isNewClient ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  <Select value={clientId} onValueChange={setClientId}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50">
                      <SelectValue placeholder="Select from records..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id} className="font-medium">
                          {client.name} — {client.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }} 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-slate-500 ml-1">Full Name</Label>
                    <Input className="h-11 rounded-xl bg-slate-50/50" value={newClientName} onChange={(e) => setNewClientName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-slate-500 ml-1">Phone</Label>
                    <Input className="h-11 rounded-xl bg-slate-50/50" value={newClientPhone} onChange={(e) => setNewClientPhone(e.target.value)} required />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Section: Metal & Weight */}
          <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Weight & Purity</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-bold">Metal Type</Label>
                <Select value={jewelleryType} onValueChange={setJewelleryType}>
                  <SelectTrigger className="h-12 bg-white rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gold">Yellow Gold</SelectItem>
                    <SelectItem value="silver">Silver 925</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Gross Delivered (g)</Label>
                <Input type="number" step="0.001" className="h-12 bg-white rounded-xl font-mono text-lg" value={totalDelivered} onChange={(e) => setTotalDelivered(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-bold">Stone Wt (g)</Label>
                <Input type="number" step="0.001" className="h-12 bg-white rounded-xl font-mono" value={stoneWeight} onChange={(e) => setStoneWeight(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Purity / Tunch (%)</Label>
                <Input type="number" step="0.01" className="h-12 bg-white rounded-xl font-mono" placeholder="e.g. 91.60" value={quality} onChange={(e) => setQuality(e.target.value)} required />
              </div>
            </div>

            {/* Live Calculation HUD */}
            <motion.div 
              layout
              className="mt-4 p-5 bg-slate-900 rounded-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent pointer-events-none" />
              <div className="grid grid-cols-3 gap-2 relative z-10">
                <div className="text-center">
                  <p className="text-[9px] font-black text-slate-500 uppercase">Net Metal</p>
                  <p className="text-white font-black text-lg">{formatGoldWeight(netGoldUsed)}</p>
                </div>
                <div className="text-center border-x border-slate-800">
                  <p className="text-[9px] font-black text-slate-500 uppercase">Stone</p>
                  <p className="text-white font-black text-lg">{formatGoldWeight(stone)}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-black text-amber-500 uppercase tracking-tighter">Total Fine</p>
                  <p className="text-amber-500 font-black text-xl">{formatGoldWeight(fineGold)}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Section: Logistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <Label className="font-bold">Expected Delivery</Label>
              </div>
              <Input type="date" className="h-12 rounded-xl" value={expectedDeliveryDate} onChange={(e) => setExpectedDeliveryDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-3 h-3 text-slate-400" />
                <Label className="font-bold">Special Instructions</Label>
              </div>
              <Input placeholder="Notes..." className="h-12 rounded-xl" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-[2] h-14 text-lg font-black bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "REGISTER ORDER"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-14 rounded-2xl border-slate-200 font-bold text-slate-500"
              onClick={() => setOpen(false)}
            >
              CANCEL
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");