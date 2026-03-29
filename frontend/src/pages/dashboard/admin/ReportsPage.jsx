import React, { useState } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, AlertCircle,
  CheckCircle2, Clock, XCircle, Download, Filter,
  PieChart, Activity, FileText, Calendar
} from 'lucide-react';

const ProgressBar = ({ label, value, max, color, sublabel }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-300 font-medium">{label}</span>
        <span className="text-xs text-white font-black">{value} <span className="text-slate-500 font-normal">/ {max}</span></span>
      </div>
      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      {sublabel && <p className="text-[10px] text-slate-500">{sublabel}</p>}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, trend, trendVal, color, bg }) => (
  <div className="glass-card rounded-3xl p-6 sm:p-8 flex items-start justify-between group hover:border-indigo-500/30 transition-all">
    <div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">{label}</p>
      <h4 className="text-3xl font-black text-white mb-1">{value}</h4>
      {trend && (
        <span className={`text-xs font-bold flex items-center gap-1 ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trend === 'up' ? <TrendingUp size={12}/> : <TrendingDown size={12}/>} {trendVal}
        </span>
      )}
    </div>
    <div className={`p-3 sm:p-4 ${bg} rounded-2xl group-hover:scale-110 transition-transform shrink-0`}>
      <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${color}`} />
    </div>
  </div>
);

const ReportsPage = () => {
  const [period, setPeriod] = useState('month');

  const stats = [
    { icon: FileText,     label: 'Total Grievances',    value: '0', color: 'text-indigo-400',  bg: 'bg-indigo-400/10' },
    { icon: CheckCircle2, label: 'Resolved',            value: '0', trend: 'up',   trendVal: 'On track', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { icon: Clock,        label: 'Pending Review',      value: '0', color: 'text-amber-400',   bg: 'bg-amber-400/10'  },
    { icon: AlertCircle,  label: 'Critical / Escalated',value: '0', color: 'text-rose-400',    bg: 'bg-rose-400/10'   },
  ];

  const categories = [
    { label: 'Academic Issues',       value: 0, max: 10, color: 'bg-indigo-500' },
    { label: 'Ragging / Harassment',  value: 0, max: 10, color: 'bg-rose-500'   },
    { label: 'Infrastructure',        value: 0, max: 10, color: 'bg-amber-500'  },
    { label: 'Faculty Misconduct',    value: 0, max: 10, color: 'bg-violet-500' },
    { label: 'Financial / Fees',      value: 0, max: 10, color: 'bg-emerald-500'},
  ];

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Organization Admin</p>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Reports & Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Institutional grievance trends, resolution metrics, and health data.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="flex items-center bg-slate-800/50 border border-white/5 rounded-2xl overflow-hidden">
            {['week','month','year'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${period === p ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => {}}
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
            title="Export Report"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 size={18} className="text-indigo-400" /> Grievance Categories
            </h3>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest capitalize">{period}</span>
          </div>
          <div className="space-y-5">
            {categories.map(c => (
              <ProgressBar key={c.label} label={c.label} value={c.value} max={c.max} color={c.color} />
            ))}
          </div>
          <p className="text-xs text-slate-600 italic">Data will populate as grievances are submitted and categorized.</p>
        </div>

        {/* Resolution Timeline */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity size={18} className="text-indigo-400" /> Resolution Timeline
          </h3>

          <div className="flex items-center justify-center h-52">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center mx-auto">
                <PieChart className="w-10 h-10 text-indigo-400/60" />
              </div>
              <div>
                <p className="text-white font-bold text-base">No Data Yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                  Timeline charts will appear once grievances are submitted and tracked through the resolution pipeline.
                </p>
              </div>
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div className="text-center">
              <p className="text-2xl font-black text-white">—</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Avg Resolution Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-white">—</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Satisfaction Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="px-6 sm:px-8 py-5 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar size={16} className="text-indigo-400" /> Recent Grievance Activity
          </h3>
        </div>
        <div className="py-16 text-center">
          <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No grievances filed yet.</p>
          <p className="text-xs text-slate-600 mt-1">Activity will appear here once students begin submitting grievances.</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
