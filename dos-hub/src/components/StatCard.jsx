import React from 'react';

export const StatCard = ({ title, value, icon: Icon, subtitle, trend, color = 'indigo' }) => {
  const colorMap = {
    indigo: {
      bg: 'from-indigo-500/10 to-indigo-600/5',
      border: 'border-indigo-500/20',
      iconBg: 'bg-indigo-500/10 text-indigo-400',
      glow: 'shadow-indigo-500/5',
    },
    cyan: {
      bg: 'from-cyan-500/10 to-cyan-600/5',
      border: 'border-cyan-500/20',
      iconBg: 'bg-cyan-500/10 text-cyan-400',
      glow: 'shadow-cyan-500/5',
    },
    emerald: {
      bg: 'from-emerald-500/10 to-emerald-600/5',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
      glow: 'shadow-emerald-500/5',
    },
    amber: {
      bg: 'from-amber-500/10 to-amber-600/5',
      border: 'border-amber-500/20',
      iconBg: 'bg-amber-500/10 text-amber-400',
      glow: 'shadow-amber-500/5',
    },
    rose: {
      bg: 'from-rose-500/10 to-rose-600/5',
      border: 'border-rose-500/20',
      iconBg: 'bg-rose-500/10 text-rose-400',
      glow: 'shadow-rose-500/5',
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div
      className={`relative p-5 rounded-2xl bg-gradient-to-br ${scheme.bg} border ${scheme.border} shadow-lg ${scheme.glow} backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
        <div className={`p-2.5 rounded-xl ${scheme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</h3>
        {trend && (
          <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
            {trend}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1.5 text-xs text-slate-400 font-medium">{subtitle}</p>}
    </div>
  );
};
