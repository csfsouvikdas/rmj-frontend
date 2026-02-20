"use client";

import React from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { formatGoldWeight } from '../utils/calculations';
import { motion } from 'framer-motion';
import {
  Package,
  Weight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  History
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

export function Dashboard() {
  const { orders } = useApp();

  // Total Lifetime Calculations
  const totalOrders = orders.length;
  const totalGoldReceived = orders.reduce((sum, o) => sum + o.fineGoldReceived, 0);
  const totalProfitGold = orders.reduce((sum, o) => sum + (o.profitGold || 0), 0);

  // Secondary Status Indicators
  const deliveredTotal = orders.filter(o => o.currentStage === 'delivered').length;
  const overdueOrders = orders.filter(o => {
    if (o.currentStage === 'delivered') return false;
    const expected = new Date(o.expectedDeliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return expected < today;
  }).length;
  const readyOrders = orders.filter(o => o.currentStage === 'ready').length;

  const metrics = [
    {
      title: 'Total Order',
      value: totalOrders,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    {
      title: 'Total Gold Received',
      value: formatGoldWeight(totalGoldReceived),
      icon: Weight,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200'
    },
    {
      title: 'Total Profit',
      value: formatGoldWeight(totalProfitGold),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
  ];

  const subMetrics = [
    { title: 'Delivered', value: deliveredTotal, icon: CheckCircle2, color: 'text-emerald-600' },
    { title: 'Overdue', value: overdueOrders, icon: AlertCircle, color: 'text-red-600' },
    { title: 'Ready', value: readyOrders, icon: Sparkles, color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">DASHBOARD</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Lifetime Performance Metrics</p>
          </div>
        </div>
        <div className="flex gap-2">
          {subMetrics.map((sm) => (
            <div key={sm.title} className="bg-white px-4 py-2 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-sm hover:border-amber-200 transition-colors">
              <sm.icon className={`w-4 h-4 ${sm.color}`} />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{sm.title}:</span>
              <span className="text-sm font-black text-slate-900">{sm.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Primary Metrics Grid (3 columns) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {metrics.map((metric) => (
          <motion.div
            key={metric.title}
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className={`relative overflow-hidden bg-white p-8 rounded-[3rem] border ${metric.border} shadow-2xl shadow-slate-200/60 group`}
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 ${metric.bg} rounded-full opacity-40 blur-3xl group-hover:scale-150 transition-transform duration-700`} />

            <div className="relative z-10">
              <div className={`${metric.bg} ${metric.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner`}>
                <metric.icon className="w-8 h-8" />
              </div>
              <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2">{metric.title}</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">{metric.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Orders List */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden"
      >
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 p-2.5 rounded-xl">
              <History className="text-amber-500 w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Recent Activity</h3>
          </div>
          <button className="text-xs font-black text-amber-600 hover:text-amber-700 flex items-center gap-2 transition-all hover:gap-3">
            EXPLORE ALL ORDERS <ChevronRight size={16} />
          </button>
        </div>

        <div className="p-4">
          {orders.length === 0 ? (
            <div className="py-24 flex flex-col items-center opacity-30">
              <Package size={64} className="mb-4 text-slate-300" strokeWidth={1} />
              <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">Awaiting First Entry</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 divide-y divide-slate-100">
              {orders.slice(0, 5).reverse().map((order, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (idx * 0.05) }}
                  key={order.id}
                  className="group flex items-center justify-between p-6 hover:bg-slate-50/80 transition-all rounded-[2.5rem]"
                >
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 group-hover:from-amber-100 group-hover:to-amber-200 group-hover:text-amber-700 transition-all duration-500 font-black text-2xl shadow-sm">
                      {order.clientName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-xl leading-none">{order.clientName}</p>
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mt-3 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full inline-block">
                        {order.jewelleryType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-10">
                    <div className="text-right hidden sm:block">
                      <p className="text-lg font-black text-slate-900">{formatGoldWeight(order.fineGoldReceived)}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fine Gold</p>
                    </div>
                    <div className={`min-w-[130px] text-center px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] border transition-all ${
                      order.currentStage === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      order.currentStage === 'ready' ? 'bg-purple-50 text-purple-700 border-purple-100 animate-pulse shadow-lg shadow-purple-100' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {order.currentStage}
                    </div>
                    <ChevronRight className="text-slate-200 group-hover:text-amber-500 group-hover:translate-x-2 transition-all duration-300" size={24} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}