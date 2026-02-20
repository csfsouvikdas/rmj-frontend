"use client";

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreateOrderDialog } from './CreateOrderDialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { formatGoldWeight, formatDate, isOrderOverdue } from '../utils/calculations';
import { Search, Eye, Filter, Package, Calendar, ArrowUpRight, Scale } from 'lucide-react';
import { OrderDetailsDialog } from './OrderDetailsDialog';
import { Order } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

export function OrdersPage() {
  const { orders } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      order.currentStage === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Order Registry</h1>
          <div className="flex items-center gap-2 mt-2">
            <Package className="w-4 h-4 text-amber-500" />
            <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">{orders.length} Records found</p>
          </div>
        </motion.div>
        <CreateOrderDialog />
      </div>

      {/* --- FILTER BAR --- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white p-4 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50"
      >
        <div className="lg:col-span-3 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-amber-500 transition-colors" />
          <Input
            type="text"
            placeholder="Search clients or Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-amber-500/20 text-lg font-medium"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/1 text-slate-400 w-4 h-4 pointer-events-none" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-14 pl-10 bg-slate-50/50 border-slate-100 rounded-2xl font-bold text-slate-700">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-200 shadow-2xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* --- ORDERS LIST --- */}
      <AnimatePresence mode="popLayout">
        {sortedOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200"
          >
            <Package className="mx-auto w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest">No matching records found</p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid gap-6"
          >
            {sortedOrders.map((order, idx) => {
              const isOverdue = isOrderOverdue(order.expectedDeliveryDate) && order.currentStage !== 'delivered';

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={order.id}
                  className={`group relative bg-white rounded-[2.5rem] border transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/60 ${
                    isOverdue ? 'border-red-200 bg-red-50/20' : 'border-slate-100'
                  }`}
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">

                      {/* Client Info Section */}
                      <div className="flex items-start gap-5 min-w-[300px]">
                        <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-sm transition-colors ${
                            isOverdue ? 'bg-red-100 text-red-600' : 'bg-slate-900 text-white'
                        }`}>
                          {order.clientName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 leading-none group-hover:text-amber-600 transition-colors">
                            {order.clientName}
                          </h3>
                          <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-widest">
                            Order ID: <span className="text-slate-600">#{order.id.slice(-8).toUpperCase()}</span>
                          </p>
                          {isOverdue && (
                            <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-md animate-pulse">
                              OVERDUE
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Technical Specs Grid */}
                      <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-6 py-4 xl:py-0 border-y xl:border-y-0 xl:border-x border-slate-100 px-0 xl:px-8">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Jewellery Type</p>
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-amber-400" />
                             <span className="font-bold text-slate-700 capitalize">{order.jewelleryType}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Gross Weight</p>
                          <div className="flex items-center gap-2 text-slate-700 font-bold">
                            <Scale size={14} className="text-slate-300" />
                            {formatGoldWeight(order.totalDelivered)}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Fine {order.jewelleryType}</p>
                          <p className="font-black text-emerald-600">{formatGoldWeight(order.fineGold)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Delivery Goal</p>
                          <div className="flex items-center gap-2 text-slate-700 font-bold">
                            <Calendar size={14} className="text-slate-300" />
                            {formatDate(order.expectedDeliveryDate)}
                          </div>
                        </div>
                      </div>

                      {/* Actions & Status */}
                      <div className="flex items-center justify-between xl:justify-end gap-6 min-w-[240px]">
                        <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border-2 transition-all ${
                          order.currentStage === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          order.currentStage === 'ready' ? 'bg-purple-50 text-purple-600 border-purple-100 shadow-lg shadow-purple-100 animate-pulse' :
                          order.currentStage === 'polishing' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-slate-50 text-slate-500 border-slate-100'
                        }`}>
                          {order.currentStage}
                        </div>

                        <Button
                          size="icon"
                          className="h-14 w-14 rounded-2xl bg-slate-50 hover:bg-slate-900 text-slate-400 hover:text-white transition-all duration-300 border border-slate-200 hover:border-slate-900"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <ArrowUpRight className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- DETAILS MODAL --- */}
      {selectedOrder && (
        <OrderDetailsDialog
          order={selectedOrder}
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}