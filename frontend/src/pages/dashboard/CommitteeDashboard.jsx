import React, { useState, useEffect, useCallback } from 'react';
import { 
  Inbox, 
  Clock, 
  CheckCircle2, 
  MessageCircle, 
  ArrowRight,
  Shield,
  Activity,
  Users,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config/api';

const CommitteeDashboard = () => {
  const user = JSON.parse(localStorage.getItem('voisafe_user') || 'null');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('voisafe_token');
      const res = await fetch(`${API_URL}/complaints/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch {
       // Silent fail for stats, will show 0s
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statItems = [
    { name: 'Incoming Reviews', value: stats?.pendingComplaints || 0, icon: Inbox, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { name: 'Active Processing', value: stats?.inProgressComplaints || 0, icon: Clock, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { name: 'Resolved Global', value: stats?.resolvedComplaints || 0, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  if (loading) return (
     <div className="flex flex-col items-center justify-center py-40 gap-4">
        <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin opacity-20" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Authenticating Resolution Authority...</p>
     </div>
  );

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 glass-card rounded-[2.5rem] shadow-xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="z-10">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Sector Resolution Unit</p>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 uppercase tracking-tight">Resolution Terminal</h1>
          <p className="text-slate-500 text-sm sm:text-base font-medium">Logged in as <span className="text-indigo-400 font-bold uppercase tracking-wider">{user?.name} (COMMITTEE)</span></p>
        </div>
        <div className="flex gap-3 z-10 shrink-0">
           <div className="bg-slate-800/40 p-3 sm:p-4 rounded-3xl flex items-center gap-4 border border-white/5 w-full sm:w-auto">
              <Activity className="w-5 h-5 text-emerald-400" />
              <div>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Signal Status</p>
                 <p className="text-sm font-bold text-white uppercase tracking-wider">Operational</p>
              </div>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {statItems.map((stat) => (
          <div key={stat.name} className="glass-card rounded-[2.5rem] p-6 sm:p-8 flex items-center justify-between group hover:border-indigo-500/30 transition-all shadow-xl">
             <div>
                <p className="text-slate-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] mb-1.5">{stat.name}</p>
                <h4 className="text-3xl sm:text-4xl font-black text-white">{stat.value}</h4>
             </div>
             <div className={`p-4 sm:p-5 ${stat.bg} rounded-[2rem] group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${stat.color}`} />
             </div>
          </div>
        ))}
      </div>

      {/* Main Content: Resolution Queue Shortcut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between mb-2 px-1">
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Priority Resolution Queue</h3>
              <Link to="/dashboard/reviews" className="text-indigo-400 text-[10px] font-black hover:text-indigo-300 flex items-center gap-1.5 group uppercase tracking-widest bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20">
                Full Queue Access <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
           
           <div className="glass-card rounded-[3rem] p-12 text-center border-dashed border-2 border-white/5 bg-white/[0.01]">
              <div className="w-20 h-20 bg-indigo-500/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                 <Shield className="w-10 h-10 text-indigo-400/40" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Queue Shards Synced</h4>
              <p className="text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed text-sm font-medium">The resolution pipeline is currently synchronized. Navigate to the full queue to inspect individual grievances.</p>
              <Link to="/dashboard/reviews">
                <button className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-95">
                  Launch Resolution Terminal
                </button>
              </Link>
           </div>
        </div>

        {/* Committee Insights */}
        <div className="space-y-6">
           <h3 className="text-xl sm:text-2xl font-black text-white py-1 uppercase tracking-tight px-1 text-center">Trust Metrics</h3>
           <div className="glass-card rounded-[3rem] p-8 space-y-8">
              <div className="flex items-center gap-4 pb-8 border-b border-white/5">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <Users className="w-6 h-6 text-indigo-400" />
                 </div>
                 <div>
                    <h5 className="font-bold text-white text-xs uppercase tracking-tight">Resolution Efficiency</h5>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Live Organizational Data</p>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Global Resolution Rate</span>
                       <span className="text-xs text-indigo-400 font-black tracking-widest">{stats?.resolutionRate || 0}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full shadow-lg shadow-indigo-500/30 transition-all duration-1000" 
                         style={{ width: `${stats?.resolutionRate || 0}%` }}
                       />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Active Cases Capacity</span>
                       <span className="text-xs text-white font-black tracking-widest">HIGH</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 w-[85%] rounded-full shadow-lg shadow-emerald-500/30" />
                    </div>
                 </div>
              </div>
              
              <div className="pt-8 border-t border-white/5">
                 <div className="bg-indigo-600/5 p-5 rounded-3xl border border-indigo-500/10 italic text-slate-400 text-xs font-medium leading-relaxed">
                   "Your identity is decoupled. Student trust is established only through your timely resolution and response."
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteeDashboard;
