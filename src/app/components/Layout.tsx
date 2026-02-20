"use client";

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Users,
  Workflow,
  FileText,
  Settings,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

// Import logo manually
import logoFile from '../assets/logo.png';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { currentUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Orders', href: '/orders', icon: Package },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Workflow', href: '/workflow', icon: Workflow },
    { name: 'Billing', href: '/billing', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <img
              src={logoFile}
              alt="Logo"
              className="w-10 h-10 object-contain" // Removed background container
            />
            <span className="font-black text-slate-900 uppercase tracking-tighter text-sm">
              Radha Madhav
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl overflow-y-auto"
            >
              <div className="p-6 border-b flex items-center gap-3">
                <img src={logoFile} alt="Logo" className="w-12 h-12 object-contain" />
                <span className="font-black text-slate-900 uppercase tracking-tighter">RM Casting</span>
              </div>
              <nav className="p-4 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-4 rounded-2xl transition-all ${
                        active
                          ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                          : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-bold text-sm uppercase tracking-tight">{item.name}</span>
                      </div>
                      {active && <ChevronRight size={16} className="text-amber-500" />}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col bg-white border-r border-slate-200/60 shadow-sm">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo Section - Clean, No BG */}
          <div className="flex flex-col items-center gap-3 p-10 border-b border-slate-50">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={logoFile}
              alt="Radha Madhav Casting Logo"
              className="w-24 h-24 object-contain"
            />
            <div className="text-center mt-2">
              <h1 className="font-black text-slate-900 leading-tight uppercase tracking-tighter text-xl">
                Radha Madhav
              </h1>
              <div className="flex items-center justify-center gap-2">
                <span className="h-[1px] w-3 bg-amber-400" />
                <p className="text-[10px] text-amber-600 font-black uppercase tracking-[0.3em]">
                  Casting
                </p>
                <span className="h-[1px] w-3 bg-amber-400" />
              </div>
            </div>
          </div>

          <nav className="flex-1 p-6 space-y-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group relative"
                >
                  <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                    active
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-1'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1'
                  }`}>
                    <Icon className={`w-5 h-5 transition-colors ${active ? 'text-amber-500' : 'group-hover:text-amber-500'}`} />
                    <span className="font-bold text-xs uppercase tracking-widest">{item.name}</span>
                  </div>
                  {active && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-amber-500 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Footer */}
          <div className="p-6 border-t border-slate-50">
            <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-500 font-black">
                {currentUser?.name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black text-slate-900 truncate uppercase">
                  {currentUser?.name || 'Owner '}
                </p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                  {currentUser?.role || 'Access Level'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-72 transition-all duration-500">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-4 sm:p-6 lg:p-10"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}