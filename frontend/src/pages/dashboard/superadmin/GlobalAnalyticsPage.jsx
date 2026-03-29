import React from 'react';
import {
  BarChart3, TrendingUp, Globe, Building2, Users,
  CheckCircle2, XCircle, Clock, Activity, Shield
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, sub, color, bg }) => (
  <div className="glass-card rounded-3xl p-6 sm:p-8 flex items-center justify-between group hover:border-indigo-500/30 transition-all shadow-xl">
    <div className="min-w-0">
      <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-2xl sm:text-3xl font-black text-white">{value}</h4>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
    <div className={`p-3 sm:p-4 ${bg} rounded-2xl group-hover:scale-110 transition-transform`}>
      <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${color}`} />
    </div>
  </div>
);

const ProgressBar = ({ label, value, max, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-xs text-slate-400 font-medium">{label}</span>
      <span className="text-xs text-white font-bold">{value}/{max}</span>
    </div>
    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all duration-700`}
        style={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }}
      />
    </div>
  </div>
);

const GlobalAnalyticsPage = () => {
  // Static placeholder analytics — will be connected to real API later
  const overview = [
    { icon: Building2, label: 'Registered Institutions', value: '—', sub: 'All time',       color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { icon: Users,     label: 'Total Platform Users',    value: '—', sub: 'Across all orgs', color: 'text-violet-400', bg: 'bg-violet-400/10' },
    { icon: CheckCircle2,label: 'Grievances Resolved',  value: '—', sub: 'System wide',     color: 'text-emerald-400',bg: 'bg-emerald-400/10'},
    { icon: Activity,  label: 'Avg Resolution Time',     value: '—', sub: 'In hours',        color: 'text-amber-400',  bg: 'bg-amber-400/10'  },
  ];

  return (
    <div className="space-y-10 animate-fade-in-up pb-10">
      {/* Header */}
      <div>
        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Super Admin</p>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Global Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">Platform-wide performance metrics and institutional health overview.</p>
      </div>

      {/* Coming Soon Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-indigo-500/20 p-8 sm:p-10 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-violet-600/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-xl font-black text-white mb-2">Live Analytics Coming Soon</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Analytics will aggregate real-time data once institutions are onboarded and students start submitting grievances.
          </p>
          <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-black uppercase tracking-widest">
            <Globe size={12} /> Global Aggregation Ready
          </div>
        </div>
      </div>

      {/* Overview Stats (placeholders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {overview.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Progress placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-3xl p-8 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-400" /> Resolution Performance
          </h3>
          <ProgressBar label="Overall Satisfaction Rate" value={0} max={100} color="bg-emerald-500" />
          <ProgressBar label="First-Response Rate" value={0} max={100} color="bg-indigo-500" />
          <ProgressBar label="Critical Cases Resolved" value={0} max={100} color="bg-violet-500" />
          <p className="text-xs text-slate-600 italic">Data will populate as grievances are processed.</p>
        </div>

        <div className="glass-card rounded-3xl p-8 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield size={18} className="text-indigo-400" /> Platform Trust Score
          </h3>
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <div className="w-28 h-28 rounded-full border-4 border-indigo-500/30 flex items-center justify-center mx-auto mb-4 relative">
                <div className="absolute inset-2 rounded-full bg-indigo-500/5" />
                <span className="text-3xl font-black text-white relative z-10">—</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Platform Trust Index</p>
              <p className="text-[10px] text-slate-600 mt-1">Available after 100+ resolved grievances</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalAnalyticsPage;
