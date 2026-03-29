import React from 'react';
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  Settings, 
  ArrowRight,
  Shield,
  Activity,
  Building2,
  PieChart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('voisafe_user') || 'null');

  // Placeholder statistics for now
  const stats = [
    { name: 'Total Organization Users', value: '0', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { name: 'System Grievances', value: '0', icon: BarChart3, color: 'text-violet-400', bg: 'bg-violet-400/10' },
    { name: 'Resolution Rate', value: '0%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Header Banner */}
      <div className="p-6 sm:p-10 md:p-12 glass-card rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 shadow-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none opacity-60" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                <Shield size={12} /> Org Administrator
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.1]">
                Command <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-violet-400">Terminal</span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-md font-medium">Manage your institution's grievance health and resolution teams securely.</p>
           </div>
           
           <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full md:w-auto">
              <div className="p-4 sm:p-6 glass-card rounded-2xl sm:rounded-3xl text-center space-y-1 sm:space-y-2">
                 <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400 mx-auto opacity-50 mb-1" />
                 <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Institution</p>
                 <p className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider truncate max-w-[100px] sm:max-w-[140px]">
                   {user?.orgName || user?.orgId || "VOISAFE"}
                 </p>
              </div>
              <div className="p-4 sm:p-6 glass-card rounded-2xl sm:rounded-3xl text-center space-y-1 sm:space-y-2 border-emerald-500/10">
                 <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 mx-auto opacity-50 mb-1" />
                 <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Status</p>
                 <p className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-widest">Optimal</p>
              </div>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card rounded-[2rem] p-6 sm:p-8 flex items-center justify-between group hover:border-indigo-500/30 transition-all shadow-xl">
             <div>
                <p className="text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-1">{stat.name}</p>
                <h4 className="text-3xl sm:text-4xl font-black text-white">{stat.value}</h4>
             </div>
             <div className={`p-3 sm:p-4 ${stat.bg} rounded-2xl group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${stat.color}`} />
             </div>
          </div>
        ))}
      </div>

      {/* Charts / Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        {/* Teams Overview */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-white">Management Queue</h3>
              <div className="flex gap-2">
                 <button className="p-2 border border-white/5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
                    <Settings size={18} />
                 </button>
              </div>
           </div>
           
           <div className="glass-card rounded-[2.5rem] p-12 text-center border-dashed border-2 border-white/5">
              <div className="w-20 h-20 bg-violet-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                 <Users className="w-10 h-10 text-violet-400" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">No resolution teams active</h4>
              <p className="text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed">
                Initial resolution committees have not yet been established for this organization.
              </p>
              <Link to="/dashboard/committees">
                <button className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-2xl text-white font-bold transition-all shadow-xl shadow-indigo-600/20">
                  Configure Committee
                </button>
              </Link>
           </div>
        </div>

        {/* Analytics Summary */}
        <div className="space-y-6">
           <h3 className="text-2xl font-bold text-white mb-2">Health Metrics</h3>
           <div className="glass-card rounded-[2.5rem] p-8 space-y-8 h-full min-h-[400px] flex flex-col items-center justify-center text-center">
              <PieChart className="w-24 h-24 text-indigo-400/40 opacity-40 mb-6" />
              <div>
                 <h4 className="text-xl font-bold text-white mb-2">Insufficient Data</h4>
                 <p className="text-sm text-slate-500 mx-auto max-w-xs leading-relaxed"> Analytics require at least 5 resolved grievances to generate meaningful trend reports for this organization.</p>
              </div>
              <div className="pt-8 border-t border-white/5 w-full">
                 <p className="text-xs text-slate-500 font-medium">Aggregating trust data...</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
