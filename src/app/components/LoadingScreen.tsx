import React from 'react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white text-slate-900">
      <div className="relative flex items-center justify-center">
        {/* Glowing Halo */}
        <div className="absolute h-32 w-32 rounded-full bg-amber-500/10 blur-2xl animate-pulse" />

        {/* Molten Gold Spinner */}
        <div className="h-24 w-24 rounded-full border-2 border-amber-100 border-t-amber-600 animate-spin" />

        {/* Floating Brand Mark */}
        <div className="absolute flex items-center justify-center">
          <span className="text-3xl font-black tracking-tighter text-amber-700">
            RM
          </span>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center">
        <h2 className="text-2xl font-light tracking-[0.4em] uppercase">
          Radha Madhav
        </h2>
        <span className="text-[10px] font-bold tracking-[0.6em] uppercase text-amber-600 mt-2">
          Casting
        </span>
      </div>
    </div>
  );
}