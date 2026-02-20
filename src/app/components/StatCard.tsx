// src/components/StatCard.tsx
export const StatCard = ({ title, value, icon: Icon, trend }: any) => (
  <motion.div
    whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
      <Icon size={80} className="text-amber-600" />
    </div>

    <div className="relative z-10">
      <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
        <Icon size={24} />
      </div>
      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
      <div className="flex items-baseline gap-3 mt-1">
        <h3 className="text-3xl font-black text-slate-900">{value}</h3>
        {trend && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{trend}</span>}
      </div>
    </div>
  </motion.div>
);