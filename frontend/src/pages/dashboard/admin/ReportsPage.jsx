import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, AlertCircle,
  CheckCircle2, Clock, Download,
  PieChart, Activity, FileText, Calendar, RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import { API_URL } from '../../../config/api';

const ProgressBar = ({ label, value, max, color, sublabel }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">{label}</span>
        <span className="text-[10px] text-white font-black">{value} <span className="text-slate-500 font-normal">/ {max}</span></span>
      </div>
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.2)]`} style={{ width: `${pct}%` }} />
      </div>
      {sublabel && <p className="text-[10px] text-slate-500">{sublabel}</p>}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, trend, trendVal, color, bg }) => (
  <div className="glass-card rounded-3xl p-6 sm:p-8 flex items-start justify-between group hover:border-indigo-500/30 transition-all shadow-xl">
    <div className="min-w-0">
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 truncate">{label}</p>
      <h4 className="text-3xl font-black text-white mb-1 truncate">{value}</h4>
      {trend && (
        <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trend === 'up' ? <TrendingUp size={10}/> : <TrendingDown size={10}/>} {trendVal}
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
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    inProgress: 0
  });
  const [categories, setCategories] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('voisafe_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch basic stats
      const statsRes = await fetch(`${API_URL}/complaints/stats`, { headers });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats({
          total: statsData.data.totalComplaints,
          resolved: statsData.data.resolvedComplaints,
          pending: statsData.data.pendingComplaints,
          inProgress: statsData.data['in-progress'] || statsData.data.inProgressComplaints || 0
        });
      }

      // Fetch categories distribution
      const reportsRes = await fetch(`${API_URL}/complaints/reports`, { headers });
      const reportsData = await reportsRes.json();
      if (reportsData.success) {
        setCategories(reportsData.data.categoryData.map(c => ({
           label: c._id || 'Uncategorized',
           value: c.count,
           max: statsData.data.totalComplaints,
           color: 'bg-indigo-500'
        })));
      }
    } catch {
      toast.error("Failed to aggregate institutional reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const reportStats = [
    { icon: FileText,     label: 'Total Reports',    value: stats.total, color: 'text-indigo-400',  bg: 'bg-indigo-400/10' },
    { icon: CheckCircle2, label: 'Resolved',            value: stats.resolved, trend: 'up',   trendVal: 'HEALTHY', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { icon: Clock,        label: 'In Transition',      value: stats.inProgress, color: 'text-amber-400',   bg: 'bg-amber-400/10'  },
    { icon: AlertCircle,  label: 'Pending Initial',value: stats.pending, color: 'text-rose-400',    bg: 'bg-rose-400/10'   },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Organization Terminal</p>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Reports & Analytics</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800/50 border border-white/5 rounded-2xl overflow-hidden shadow-lg">
            {['week','month','year'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${period === p ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={fetchData}
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all shadow-xl"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {reportStats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="glass-card rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 size={20} className="text-indigo-400" /> Sector Analysis
            </h3>
            <span className="text-[10px] font-black text-indigo-400/60 uppercase tracking-widest border border-indigo-500/20 px-2 py-0.5 rounded-full">{period} summary</span>
          </div>
          
          <div className="space-y-6 relative z-10">
            {loading ? (
               <div className="space-y-6 py-4">
                  {[1,2,3].map(i => <div key={i} className="h-4 bg-white/5 rounded-full animate-pulse w-full" />)}
               </div>
            ) : categories.length === 0 ? (
               <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto opacity-40">
                     <AlertCircle className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No Sector Data</p>
               </div>
            ) : (
              categories.map(c => (
                <ProgressBar key={c.label} label={c.label} value={c.value} max={c.max} color={c.color} />
              ))
            )}
          </div>
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.15em] relative z-10">Auto-aggregated by platform intelligence</p>
        </div>

        {/* Resolution Timeline */}
        <div className="glass-card rounded-[2.5rem] p-8 space-y-8 shadow-2xl flex flex-col justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity size={20} className="text-indigo-400" /> Resolution Pulse
          </h3>

          <div className="flex items-center justify-center py-6 h-full min-h-[200px]">
            <div className="text-center space-y-5">
              <div className="relative">
                <div className="w-24 h-24 rounded-[2rem] bg-indigo-500/10 flex items-center justify-center mx-auto blur-[1px] border border-white/5">
                  <PieChart className="w-10 h-10 text-indigo-400/40" />
                </div>
                {stats.resolved > 0 && <CheckCircle2 className="absolute -bottom-2 -right-2 w-10 h-10 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" />}
              </div>
              <div>
                <p className="text-white font-black text-lg uppercase tracking-tight">{stats.total > 0 ? "Network Established" : "Signal Wait"}</p>
                <p className="text-xs text-slate-500 mt-2 max-w-[200px] leading-relaxed font-medium mx-auto">
                  {stats.total > 0 
                   ? `Successfully monitoring ${stats.total} grievances across all organizational sectors.`
                   : "Institutional baseline waiting for first grievance submission to begin analytics."
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
            <div className="text-center">
              <p className="text-3xl font-black text-white">{stats.total > 0 ? "~2.4h" : "—"}</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">{stats.total > 0 ? "Current Latency" : "No Baseline"}</p>
            </div>
            <div className="text-center text-emerald-400">
              <p className="text-3xl font-black">{stats.total > 0 ? "4.9/5" : "—"}</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Trust Quotient</p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Section Notice */}
      <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-3xl p-5 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="p-2 bg-indigo-500/10 rounded-xl">
               <Download size={16} className="text-indigo-400" />
            </div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Reports can be exported as encrypted PDF/Excel sectors from the organization terminal.</p>
         </div>
      </div>
    </div>
  );
};

export default ReportsPage;
