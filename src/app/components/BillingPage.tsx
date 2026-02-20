"use client";

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Order } from '../types';
import { formatGoldWeight, formatDate } from '../utils/calculations';
import { Download, Share2, Search, FileText, History } from 'lucide-react';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// Ensure this file exists in src/assets/logo.png
import logoFile from '../assets/logo.png';

export function BillingPage() {
  const { orders, clients, settings } = useApp(); // Added settings here
  const [searchTerm, setSearchTerm] = useState('');

  // Extract Shop Details from settings with Fallbacks
  const shopInfo = {
    name: settings.shopDetails?.name || 'RADHA MADHAV CASTING',
    address: settings.shopDetails?.address || 'Jewelers Market, Panvel',
    phone: settings.shopDetails?.phone || '+91 00000 00000',
    gst: settings.shopDetails?.gst || 'GSTIN PENDING'
  };

  const deliveredOrders = orders.filter(o => o.currentStage === 'delivered');

  const filteredOrders = deliveredOrders.filter(order =>
    order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePDF = (order: Order) => {
    const doc = new jsPDF();
    const client = clients.find(c => c.id === order.clientId);
    const pageWidth = doc.internal.pageSize.getWidth();

    // 1. HEADER & LOGO
    try {
      doc.addImage(logoFile, 'PNG', 20, 10, 25, 25);
    } catch (e) {
      console.error("Logo import failed");
    }

    // 2. DYNAMIC SHOP DETAILS (From Settings)
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(shopInfo.name.toUpperCase(), pageWidth - 20, 15, { align: 'right' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    const splitAddress = doc.splitTextToSize(shopInfo.address, 80);
    doc.text(splitAddress, pageWidth - 20, 22, { align: 'right' });

    const addressHeight = (splitAddress.length * 5);
    doc.text(`Phone: ${shopInfo.phone}`, pageWidth - 20, 22 + addressHeight, { align: 'right' });
    doc.text(`GSTIN: ${shopInfo.gst}`, pageWidth - 20, 27 + addressHeight, { align: 'right' });

    // 3. INVOICE TITLE & DIVIDER
    doc.setDrawColor(240, 158, 11); // Amber color
    doc.setLineWidth(0.5);
    doc.line(20, 39, pageWidth - 20, 39);

    doc.setTextColor(0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 20, 49);

    // 4. ORDER & CLIENT INFO
    const startY = 60;
    const rightColX = 150;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO:', 20, startY);
    doc.setFont('helvetica', 'normal');
    doc.text(order.clientName.toUpperCase(), 20, startY + 7);
    if (client?.phone) doc.text(`Contact: ${client.phone}`, 20, startY + 14);
    if (client?.address) {
        const clientAddr = doc.splitTextToSize(client.address, 60);
        doc.text(clientAddr, 20, startY + 21);
    }

    doc.setFont('helvetica', 'bold');
    doc.text('ORDER DETAILS:', rightColX, startY);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice No: #${order.id.slice(-8).toUpperCase()}`, rightColX, startY + 7);
    doc.text(`Date: ${formatDate(order.deliveredAt || order.createdAt)}`, rightColX, startY + 14);
    doc.text(`Type: ${order.jewelleryType.toUpperCase()}`, rightColX, startY + 21);

    // 5. WEIGHT SUMMARY TABLE
    const tableY = startY + 28;
    doc.setFillColor(248, 250, 252); // Slate 50
    doc.rect(20, tableY, pageWidth - 40, 40, 'F');

    doc.setFont('helvetica', 'bold');
    doc.text('Description', 25, tableY + 10);
    doc.text('Weight', pageWidth - 25, tableY + 10, { align: 'right' });

    doc.line(25, tableY + 15, pageWidth - 25, tableY + 15);

    doc.setFont('helvetica', 'normal');
    doc.text('Gross Delivered Weight', 25, tableY + 22);
    doc.text(formatGoldWeight(order.totalDelivered), pageWidth - 25, tableY + 22, { align: 'right' });

    doc.text('Stone Weight (-)', 25, tableY + 29);
    doc.text(formatGoldWeight(order.stoneWeight), pageWidth - 25, tableY + 29, { align: 'right' });

    // CHANGED: Replaced "Calculated" with actual Fine Gold value
    doc.setFont('helvetica', 'bold');
    doc.text(`Net Fine Gold (${order.quality}%)`, 25, tableY + 36);
    doc.text(formatGoldWeight(order.fineGold), pageWidth - 25, tableY + 36, { align: 'right' });

    // 6. SIGNATURE SECTION (Replaced Fine Gold Summary Box)
    const sigY = tableY + 50;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Authorized Signatory', pageWidth - 20, sigY, { align: 'right' });

    doc.setDrawColor(200);
    doc.setLineWidth(0.1);
    doc.line(pageWidth - 60, sigY - 5, pageWidth - 20, sigY - 5); // Line for sender

    // 7. FOOTER
    doc.save(`Invoice-${order.clientName}-${order.id.slice(-4)}.pdf`);
    toast.success('Bill generated successfully!');
  };

  const shareBill = (order: Order) => {
    const client = clients.find(c => c.id === order.clientId);
    const message = `*${shopInfo.name.toUpperCase()}*\n\n*RECEIPT*\nID: #${order.id.slice(-8).toUpperCase()}\nClient: ${order.clientName}\nFine Metal: ${formatGoldWeight(order.fineGold)}\nDate: ${formatDate(order.deliveredAt || order.createdAt)}`.trim();

    if (client?.phone) {
      const cleanPhone = client.phone.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      navigator.clipboard.writeText(message);
      toast.success('Details copied to clipboard');
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto px-4 pb-24 md:pb-8">
      {/* Header section remains the same */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="pt-4">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">Billing</h1>
        <div className="flex items-center gap-2 mt-2 text-slate-500">
          <History size={16} />
          <p className="text-xs font-bold uppercase tracking-widest">{deliveredOrders.length} Completed Invoices</p>
        </div>
      </motion.div>

      {/* Search and List sections remain the same as your provided code */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            placeholder="Search client or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 bg-white border-none rounded-2xl shadow-xl shadow-slate-200/50 text-base focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>
      </motion.div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filteredOrders.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No records found</p>
            </motion.div>
          ) : (
            filteredOrders.map((order, idx) => (
              <motion.div key={order.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                <Card className="rounded-[1.5rem] md:rounded-[2rem] border-none shadow-sm hover:shadow-xl transition-all bg-white overflow-hidden group">
                  <CardContent className="p-0 flex flex-col lg:flex-row">
                    <div className="flex-1 p-6 md:p-8 space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase">{order.clientName}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            #{order.id.slice(-8).toUpperCase()} • {formatDate(order.deliveredAt || order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-slate-50 p-3 rounded-2xl">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Total Wt</p>
                          <p className="font-bold text-slate-800">{formatGoldWeight(order.totalDelivered)}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Stone</p>
                          <p className="font-bold text-slate-800">{formatGoldWeight(order.stoneWeight)}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Purity</p>
                          <p className="font-bold text-slate-800">{order.quality}%</p>
                        </div>
                        <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100">
                          <p className="text-[9px] font-black text-amber-600 uppercase mb-1">Fine Metal</p>
                          <p className="font-black text-amber-700 text-lg">{formatGoldWeight(order.fineGold)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50/50 p-6 lg:w-48 flex flex-row lg:flex-col gap-3 border-t lg:border-t-0 lg:border-l border-slate-100">
                      <Button variant="outline" onClick={() => generatePDF(order)} className="flex-1 h-12 rounded-xl bg-white border-slate-200 font-bold uppercase text-[10px] tracking-widest">
                        <Download className="w-4 h-4 mr-2" /> PDF
                      </Button>
                      <Button onClick={() => shareBill(order)} className="flex-1 h-12 rounded-xl bg-slate-900 text-white font-bold uppercase text-[10px] tracking-widest">
                        <Share2 className="w-4 h-4 mr-2" /> Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}