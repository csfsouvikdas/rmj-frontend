import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Mail, Loader2, Sparkles } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-slate-50">

      {/* --- MOBILE BRANDING HEADER (Visible only on Mobile) --- */}
      <div className="lg:hidden w-full h-48 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2069&auto=format&fit=crop')] bg-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center"
        >
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Radha Madhav <span className="text-amber-600 font-black">Casting</span>
          </h1>
        </motion.div>
      </div>

      {/* --- DESKTOP SIDEBAR (Visible only on Desktop) --- */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        {/* Animated Background Pulse */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2069&auto=format&fit=crop')] bg-cover"
        />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" />

        <div className="relative z-10 text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 mb-4"
          >
            <Sparkles className="text-amber-500 h-8 w-8" />
          </motion.div>
          <h1 className="text-6xl font-black text-white tracking-tighter leading-none">
            RADHA MADHAV<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              CASTING
            </span>
          </h1>
          <p className="text-slate-400 tracking-[0.4em] text-sm uppercase">Legacy in Every Detail</p>
        </div>
      </div>

      {/* --- LOGIN FORM SECTION --- */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        {/* Subtle Animated Background Blobs for "Live" feel */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 animate-pulse" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-50 text-sm mt-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-ping" />
              <span className="text-slate-500">System Online: Secure Access</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email</label>
              <div className="group relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-amber-500 transition-all outline-none shadow-sm font-medium"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Password</label>
              <div className="group relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-amber-500 transition-all outline-none shadow-sm font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 mt-4"
            >
              {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
              ) : (
                "Authorize Login"
              )}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-slate-400 text-[10px] uppercase tracking-[0.2em]">
            © 2026 Radha Madhav Casting • v2.4.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}