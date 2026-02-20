"use client";

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Order, OrderStage } from '../types';
import { formatGoldWeight, formatDate } from '../utils/calculations';
import { ChevronRight, Clock, Box, CheckCircle2, AlertCircle, ArrowRight, Layers, X } from 'lucide-react';
import { UpdateStageDialog } from './UpdateStageDialog';
import { motion, AnimatePresence } from 'framer-motion';

export function WorkflowPage() {
  const { orders } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [targetStage, setTargetStage] = useState<OrderStage | null>(null);

  // Bulk Selection State
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const stages: { key: OrderStage; label: string; icon: any }[] = [
    { key: 'received', label: 'Received', icon: Box },
    { key: 'ready', label: 'Ready', icon: Clock },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
  ];

  const getOrdersByStage = (stage: OrderStage) => orders.filter(o => o.currentStage === stage);

  const toggleBulkMode = () => {
    setIsBulkMode(!isBulkMode);
    setSelectedIds([]);
  };

  const toggleOrderSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkMove = (currentStage: OrderStage) => {
    const nextStageIndex = stages.findIndex(s => s.key === currentStage) + 1;
    if (nextStageIndex < stages.length) {
      // In a real app, you'd pass the array of IDs to a bulk update function
      // For now, we trigger the dialog for the first one or a specialized bulk dialog
      setTargetStage(stages[nextStageIndex].key);
      // Logic for bulk processing would go into your AppContext
      alert(`Moving ${selectedIds.length} orders to ${stages[nextStageIndex].label}`);
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto px-4 pb-24 md:pb-8">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pt-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">Workflow</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Live Production Pipeline</p>
        </motion.div>

        <Button
          variant={isBulkMode ? "destructive" : "outline"}
          onClick={toggleBulkMode}
          className="rounded-xl font-black uppercase text-[10px] tracking-widest h-12 px-6"
        >
          {isBulkMode ? <><X className="w-4 h-4 mr-2"/> Cancel</> : <><Layers className="w-4 h-4 mr-2"/> Bulk Move</>}
        </Button>
      </div>

      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14 bg-slate-100/50 rounded-xl p-1">
          {stages.map(stage => (
            <TabsTrigger key={stage.key} value={stage.key} className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm uppercase font-black text-[10px]">
              {stage.label} ({getOrdersByStage(stage.key).length})
            </TabsTrigger>
          ))}
        </TabsList>

        {stages.map(stage => {
          const stageOrders = getOrdersByStage(stage.key);
          const nextStage = stages[stages.findIndex(s => s.key === stage.key) + 1];

          return (
            <TabsContent key={stage.key} value={stage.key} className="mt-6 outline-none">
              <AnimatePresence>
                {stageOrders.map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="mb-4"
                  >
                    <Card className={`overflow-hidden rounded-2xl border-none shadow-sm hover:shadow-md transition-all ${isBulkMode && selectedIds.includes(order.id) ? 'ring-2 ring-slate-900' : ''}`}>
                      <CardContent className="p-0">
                        <div className="flex items-stretch">
                          {isBulkMode && (
                            <div
                              className="w-16 flex items-center justify-center bg-slate-50 border-r border-slate-100 cursor-pointer"
                              onClick={() => toggleOrderSelection(order.id)}
                            >
                              <Checkbox
                                checked={selectedIds.includes(order.id)}
                                onCheckedChange={() => toggleOrderSelection(order.id)}
                                className="h-6 w-6 rounded-md"
                              />
                            </div>
                          )}

                          <div className="flex-1 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-1">
                              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">{order.clientName}</h3>
                              <div className="flex gap-3 text-[10px] font-bold text-slate-500 uppercase">
                                <span>{order.jewelleryType}</span>
                                <span>•</span>
                                <span>{formatGoldWeight(order.fineGold)}</span>
                              </div>
                            </div>

                            {!isBulkMode && nextStage && (
                              <Button
                                onClick={() => { setSelectedOrder(order); setTargetStage(nextStage.key); }}
                                className="h-10 rounded-lg bg-slate-900 text-[10px] font-black uppercase tracking-widest px-4"
                              >
                                Move <ChevronRight className="ml-1 w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* --- BULK ACTION BAR (Floating) --- */}
              {isBulkMode && selectedIds.length > 0 && (
                <motion.div
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md"
                >
                  <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest ml-2">
                      {selectedIds.length} Selected
                    </span>
                    <Button
                      onClick={() => handleBulkMove(stage.key)}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-black uppercase text-[10px] rounded-xl px-6 h-12"
                    >
                      Process Batch <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      {selectedOrder && targetStage && (
        <UpdateStageDialog
          order={selectedOrder}
          targetStage={targetStage}
          open={!!selectedOrder}
          onClose={() => { setSelectedOrder(null); setTargetStage(null); }}
        />
      )}
    </div>
  );
}