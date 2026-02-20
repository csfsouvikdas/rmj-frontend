"use client";

import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Order, OrderStage } from '../types';
import { useApp } from '../context/AppContext';
import { Camera, Upload, CheckCircle2, X, RefreshCcw, Image as ImageIcon, Loader2, PenLine } from 'lucide-react';
import { SignaturePad } from './SignaturePad'; // Import your custom component
import { toast } from 'sonner';

interface UpdateStageDialogProps {
  order: Order;
  targetStage: OrderStage;
  open: boolean;
  onClose: () => void;
}

export function UpdateStageDialog({ order, targetStage, open, onClose }: UpdateStageDialogProps) {
  const { updateOrderStage, currentUser } = useApp();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sigCanvasRef = useRef<any>(null); // Ref for Signature
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      toast.error("Could not access camera");
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      setPhoto(canvas.toDataURL('image/webp', 0.8));
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const handleUpdate = async () => {
    let deliveryProofData = undefined;

    if (targetStage === 'delivered') {
      const isSigEmpty = sigCanvasRef.current?.isEmpty();

      if (!photo) {
        toast.error("Please capture or upload a photo");
        return;
      }
      if (isSigEmpty) {
        toast.error("Client signature is required");
        return;
      }

      deliveryProofData = {
        photo: photo,
        signature: sigCanvasRef.current.toDataURL(), // Get signature data
        deliveredBy: currentUser?.name || currentUser?.email || 'Staff',
        timestamp: new Date().toISOString()
      };
    }

    try {
      setIsSubmitting(true);
      await updateOrderStage(order.id, targetStage, deliveryProofData);
      onClose();
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md p-0 bg-white rounded-[2rem] overflow-hidden border-none shadow-2xl mx-4"
        aria-describedby={undefined}
      >
        <div className="bg-slate-900 p-6 text-white text-center">
          <DialogTitle className="text-xl font-black uppercase tracking-tighter">Update Status</DialogTitle>
          <DialogDescription className="text-slate-400 text-[10px] mt-1 uppercase font-bold tracking-widest">
            Order for {order.clientName}
          </DialogDescription>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {targetStage === 'delivered' ? (
            <div className="space-y-6">
              {/* PHOTO SECTION */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <ImageIcon size={14}/> 1. Handover Photo
                </label>
                <div className="aspect-video bg-slate-50 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center relative">
                  {isCameraOpen ? (
                    <div className="relative w-full h-full">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <Button onClick={capturePhoto} className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 rounded-full h-10 w-10 shadow-xl"><Camera size={20}/></Button>
                    </div>
                  ) : photo ? (
                    <div className="relative w-full h-full">
                      <img src={photo} className="w-full h-full object-cover" alt="Proof" />
                      <Button onClick={() => setPhoto(null)} className="absolute top-2 right-2 bg-white/90 text-red-500 h-8 w-8 p-0 rounded-full shadow-md"><RefreshCcw size={14}/></Button>
                    </div>
                  ) : (
                    <div className="flex gap-3 p-4 w-full">
                      <Button onClick={startCamera} className="flex-1 h-12 rounded-xl bg-slate-900 text-white font-bold uppercase text-[10px]">Camera</Button>
                      <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex-1 h-12 rounded-xl border-slate-200 font-bold uppercase text-[10px]">Gallery</Button>
                      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setPhoto(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </div>
                  )}
                </div>
              </div>

              {/* SIGNATURE SECTION */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <PenLine size={14}/> 2. Client Signature
                  </label>
                  <Button
                    variant="ghost"
                    onClick={() => sigCanvasRef.current?.clear()}
                    className="h-6 text-[9px] font-black uppercase text-red-500 hover:bg-red-50"
                  >
                    Clear
                  </Button>
                </div>
                <SignaturePad
                  ref={sigCanvasRef}
                  className="border-2 border-slate-100 rounded-2xl h-32"
                />
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-4">
              <div className="h-20 w-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-amber-50/50">
                <CheckCircle2 className="w-10 h-10 text-amber-500" />
              </div>
              <h4 className="font-black text-slate-900 uppercase">Move to {targetStage}?</h4>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t flex gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting} className="flex-1 h-14 rounded-2xl font-black uppercase text-xs">Cancel</Button>
          <Button onClick={handleUpdate} disabled={isSubmitting} className="flex-1 h-14 rounded-2xl bg-slate-900 text-white font-black uppercase text-xs shadow-xl">
            {isSubmitting ? <Loader2 className="animate-spin" /> : `Confirm ${targetStage}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}