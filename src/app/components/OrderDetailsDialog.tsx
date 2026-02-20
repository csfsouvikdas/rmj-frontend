"use client";

import React from 'react';
import { Order } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Separator } from './ui/separator';
import { formatGoldWeight, formatDate, formatDateTime } from '../utils/calculations';
import { Calendar, Weight, Percent, Clock, User, ShieldCheck, FileText, Image as ImageIcon, PenTool, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderDetailsDialogProps {
  order: Order;
  open: boolean;
  onClose: () => void;
}

export function OrderDetailsDialog({ order, open, onClose }: OrderDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 bg-white border-none sm:rounded-[2.5rem] overflow-hidden shadow-2xl h-[100dvh] sm:h-auto sm:max-h-[90vh] flex flex-col">

        {/* --- ACCESSIBILITY FIX --- */}
        <div className="sr-only">
          <DialogTitle>Order Details for {order.clientName}</DialogTitle>
          <DialogDescription>
            Detailed view of order metrics and workflow history.
          </DialogDescription>
        </div>

        {/* --- PREMIUM HEADER --- */}
        <div className="bg-slate-900 p-6 sm:p-8 text-white relative flex-shrink-0">
          <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10 pointer-events-none">
            <ShieldCheck size={80} className="sm:w-[100px] sm:h-[100px]" />
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="sm:hidden absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white/50"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <p className="text-amber-500 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] mb-1">Authentic Record</p>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase leading-none">{order.clientName}</h3>
              <p className="text-slate-400 font-bold text-[10px] sm:text-xs mt-1">ID: #{order.id.toUpperCase()}</p>
            </div>
            <div className={`w-fit px-4 sm:px-6 py-2 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border-2 shadow-lg self-start sm:self-center ${
                order.currentStage === 'delivered' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' :
                order.currentStage === 'ready' ? 'bg-purple-500/10 border-purple-500 text-purple-500 animate-pulse' :
                'bg-slate-700 border-slate-600 text-slate-300'
              }`}>
              {order.currentStage}
            </div>
          </div>
        </div>

        {/* --- SCROLLABLE CONTENT --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-8 space-y-6 sm:space-y-8 pb-32 sm:pb-8">

          {/* --- CORE METRICS (Optimized for Mobile Row) --- */}
          <div className="flex sm:grid sm:grid-cols-3 gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 -mx-1 px-1 hide-scrollbar">
            <div className="min-w-[140px] flex-1 p-4 sm:p-5 bg-slate-50 rounded-2xl sm:rounded-[2rem] border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">Gross Intake</p>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1 bg-white rounded-lg shadow-sm"><Weight className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" /></div>
                <p className="text-sm sm:text-base font-black text-slate-900">{formatGoldWeight(order.totalDelivered)}</p>
              </div>
            </div>
            <div className="min-w-[140px] flex-1 p-4 sm:p-5 bg-slate-50 rounded-2xl sm:rounded-[2rem] border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">Stone/Waste</p>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1 bg-white rounded-lg shadow-sm"><Percent className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" /></div>
                <p className="text-sm sm:text-base font-black text-slate-900">{formatGoldWeight(order.stoneWeight)}</p>
              </div>
            </div>
            <div className="min-w-[140px] flex-1 p-4 sm:p-5 bg-amber-50 rounded-2xl sm:rounded-[2rem] border border-amber-100 relative">
              <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-2 sm:mb-3">Fine Total</p>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1 bg-white rounded-lg shadow-sm"><ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" /></div>
                <p className="text-sm sm:text-base font-black text-amber-700">{formatGoldWeight(order.fineGold)}</p>
              </div>
            </div>
          </div>

          {/* --- TECHNICAL SPECS (2x2 Grid on Mobile) --- */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 px-1">
             <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-400 uppercase">Jewellery</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 capitalize">{order.jewelleryType}</p>
             </div>
             <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-400 uppercase">Purity</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900">{order.quality}%</p>
             </div>
             <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-400 uppercase">Intake</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900">{formatDate(order.createdAt)}</p>
             </div>
             <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-400 uppercase">Deadline</p>
                <p className="text-xs sm:text-sm font-bold text-amber-600 flex items-center gap-1">
                  <Clock size={12} /> {formatDate(order.expectedDeliveryDate)}
                </p>
             </div>
          </div>

          {order.notes && (
            <div className="bg-slate-50 p-5 rounded-2xl sm:rounded-[2rem] border border-slate-100 relative">
               <FileText className="absolute top-4 right-4 text-slate-200" size={16} />
               <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Notes</p>
               <p className="text-xs text-slate-600 font-medium leading-relaxed italic">"{order.notes}"</p>
            </div>
          )}

          {/* --- TIMELINE SECTION --- */}
          <div className="space-y-4">
            <h4 className="text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1 h-3 bg-amber-500 rounded-full" /> Workflow History
            </h4>
            <div className="relative pl-5 space-y-4 before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {order.stageHistory.map((stage, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                  key={index} className="relative group"
                >
                  <div className={`absolute -left-[20px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ring-4 ring-slate-50 ${
                    stage.stage === 'delivered' ? 'bg-emerald-500' :
                    stage.stage === 'ready' ? 'bg-purple-500' : 'bg-slate-300'
                  }`} />
                  <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-black text-slate-900 text-xs uppercase">{stage.stage}</p>
                      <p className="text-[8px] sm:text-[10px] font-bold text-slate-400">{formatDateTime(stage.timestamp)}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                      <User size={10} /> {stage.updatedBy}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* --- DELIVERY PROOF --- */}
          {order.deliveryProof && (
            <div className="space-y-4 pt-2">
              <h4 className="text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1 h-3 bg-emerald-500 rounded-full" /> Delivery Proof
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase">
                    <ImageIcon size={12} /> Photo
                  </div>
                  <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                    {order.deliveryProof.photo && (
                      <img src={order.deliveryProof.photo} alt="Delivery" className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase">
                    <PenTool size={12} /> Signature
                  </div>
                  <div className="aspect-video bg-white rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                    {order.deliveryProof.signature ? (
                      <img src={order.deliveryProof.signature} alt="Sign" className="max-h-full object-contain p-2" />
                    ) : (
                      <p className="text-[8px] font-bold text-slate-300 uppercase">No Sign</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white"><ShieldCheck size={16} /></div>
                   <div>
                     <p className="text-[10px] font-black text-emerald-800 uppercase leading-none">Verified</p>
                     <p className="text-[9px] font-bold text-emerald-600 mt-1">{order.deliveryProof.deliveredBy}</p>
                   </div>
                </div>
                <p className="text-[9px] font-black text-emerald-700">{formatDate(order.deliveryProof.timestamp)}</p>
              </div>
            </div>
          )}
        </div>

        {/* --- FOOTER ACTION (Sticky on Mobile) --- */}
        <div className="fixed bottom-0 left-0 right-0 sm:relative p-4 sm:p-6 bg-white sm:bg-slate-50 border-t border-slate-100 flex justify-end z-20">
           <button
             onClick={onClose}
             className="w-full sm:w-auto px-8 py-4 sm:py-3 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl sm:rounded-xl shadow-xl transition-all"
           >
             Close Record
           </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}