"use client";

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Plus, Search, MapPin, FileText, Trash2, UserPlus, MessageSquare, Edit3, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Client } from '../types';

export function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient, getClientOrders } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  const openAddDialog = () => {
    setEditingClient(null);
    setName(''); setPhone(''); setAddress(''); setGstNumber('');
    setIsDialogOpen(true);
  };

  const openEditDialog = (client: Client) => {
    setEditingClient(client);
    setName(client.name);
    setPhone(client.phone);
    setAddress(client.address || '');
    setGstNumber(client.gstNumber || '');
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clientData = { name, phone, address, gstNumber };
    if (editingClient) updateClient(editingClient.id, clientData);
    else addClient(clientData);
    setIsDialogOpen(false);
  };

  const handleDeleteClient = (id: string, name: string) => {
    if (window.confirm(`Remove ${name}? Existing orders will remain.`)) {
      deleteClient(id);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 md:pb-8">
      {/* --- RESPONSIVE HEADER --- */}
      <div className="sticky top-0 z-30 bg-[#F8FAFC]/80 backdrop-blur-md px-4 py-4 md:px-8 md:py-8">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">Directory</h1>
            <p className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              {clients.length} Registered Partners
            </p>
          </motion.div>

          <div className="hidden md:block">
            <Button onClick={openAddDialog} className="h-12 px-6 rounded-xl bg-slate-900 hover:bg-amber-600 shadow-lg">
              <UserPlus className="w-5 h-5 mr-2" /> New Partner
            </Button>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={openAddDialog}
            className="md:hidden h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xl"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        </div>

        <div className="max-w-[1400px] mx-auto mt-4 md:mt-8">
          <div className="relative group">
            <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 md:pl-14 h-12 md:h-16 bg-white border-none rounded-2xl shadow-sm md:shadow-xl text-base outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <AnimatePresence mode="popLayout">
          {filteredClients.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center text-slate-400 uppercase text-[10px] font-black tracking-widest">
              No records found
            </motion.div>
          ) : (
            <motion.div layout className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredClients.map((client, idx) => {
                const clientOrders = getClientOrders(client.id);
                const pending = clientOrders.filter(o => o.currentStage !== 'delivered').length;

                return (
                  <motion.div
                    key={client.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 p-5 md:p-6 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg font-black shrink-0">
                          {client.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-black text-slate-900 leading-none truncate uppercase tracking-tighter">{client.name}</h3>
                          <p className="text-[10px] font-bold text-slate-400 mt-1">{client.phone}</p>
                        </div>
                      </div>
                      <button onClick={() => openEditDialog(client)} className="p-2 text-slate-300 hover:text-amber-600 active:scale-90 transition-all">
                        <Edit3 size={18} />
                      </button>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                        <MapPin size={12} className="text-slate-300 shrink-0" />
                        <span className="truncate">{client.address || 'No Address'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                        <FileText size={12} className="text-slate-300 shrink-0" />
                        <span className="uppercase">{client.gstNumber || 'No GST'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex gap-4">
                        <div className="text-center">
                          <p className="text-[9px] font-black text-slate-300 uppercase">Total</p>
                          <p className="text-sm font-black text-slate-900">{clientOrders.length}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] font-black text-slate-300 uppercase">Active</p>
                          <p className="text-sm font-black text-amber-600">{pending}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <motion.a whileTap={{ scale: 0.9 }} href={`tel:${client.phone}`} className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600"><PhoneCall size={16} /></motion.a>
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => window.open(`https://wa.me/${client.phone.replace(/\D/g, '')}`)} className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"><MessageSquare size={16} /></motion.button>
                        {/* RESTORED TRASH OPTION */}
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleDeleteClient(client.id, client.name)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500"><Trash2 size={16} /></motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- MOBILE BOTTOM NAV --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button onClick={openAddDialog} className="flex flex-col items-center gap-1">
           <Plus size={20} className="text-slate-900" />
           <span className="text-[10px] font-black uppercase tracking-tighter text-slate-900">Add</span>
        </button>
        <div className="h-8 w-px bg-slate-100" />
        <button className="flex flex-col items-center gap-1 text-slate-900">
           <UserPlus size={20} />
           <span className="text-[10px] font-black uppercase tracking-tighter">Partners</span>
        </button>
      </div>

      {/* --- FORM DIALOG --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none bg-transparent shadow-none">
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} className="bg-white rounded-t-[2rem] md:rounded-[2.5rem] mt-20">
            <div className="bg-slate-900 p-6 md:p-8 text-white flex justify-between items-center">
              <div>
                <DialogTitle className="text-xl md:text-2xl font-black uppercase tracking-tighter">
                  {editingClient ? 'Update Profile' : 'New Partner'}
                </DialogTitle>
                <DialogDescription className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                  {editingClient ? `Editing ${editingClient.name}` : 'Create a new business record'}
                </DialogDescription>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required className="h-12 rounded-xl bg-slate-50 border-none ring-1 ring-slate-100" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Mobile Number</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} required className="h-12 rounded-xl bg-slate-50 border-none ring-1 ring-slate-100" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Business Address</Label>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} className="h-12 rounded-xl bg-slate-50 border-none ring-1 ring-slate-100" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">GST Identification</Label>
                  <Input value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} className="h-12 rounded-xl bg-slate-50 border-none ring-1 ring-slate-100" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 h-14 rounded-2xl bg-slate-900 font-bold uppercase tracking-widest text-xs">
                  {editingClient ? 'Update' : 'Register'}
                </Button>
                <Button type="button" variant="outline" className="flex-1 h-14 rounded-2xl" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}