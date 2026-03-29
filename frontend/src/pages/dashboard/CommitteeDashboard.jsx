import React from 'react';
import { 
  Inbox, 
  Clock, 
  CheckCircle2, 
  MessageCircle, 
  ArrowRight,
  Shield,
  Activity,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CommitteeDashboard = () => {
  const user = JSON.parse(localStorage.getItem('voisafe_user') || 'null');

  // Placeholder data for now
  const stats = [
    { name: 'Incoming Reviews', value: '0', icon: Inbox, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { name: 'Active Chats', value: '0', icon: MessageCircle, color: 'text-violet-400', bg: 'bg-violet-400/10' },
    { name: 'Resolved Today', value: '0', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 glass-card rounded-3xl shadow-xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="z-10">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 underline decoration-indigo-500 decoration-wavy underline-offset-8">Resolution Terminal</h1>
          <p className="text-slate-500 text-sm sm:text-base font-medium">Logged in as <span className="text-indigo-400">Committee Member</span></p>
        </div>
        <div className="flex gap-3 z-10 shrink-0">
           <div className="bg-slate-800/50 p-3 sm:p-4 rounded-2xl flex items-center gap-4 border border-white/5 w-full sm:w-auto">
              <Activity className="w-5 h-5 text-emerald-400" />
              <div>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Status</p>
                 <p className="text-sm font-bold text-white uppercase tracking-wider">Operational</p>
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

      {/* Main Content: Resolution Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-white">Priority Resolution Queue</h3>
              <Link to="/dashboard/reviews" className="text-indigo-400 text-sm font-bold hover:text-indigo-300 flex items-center gap-1 group">
                View full queue <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
           
           <div className="glass-card rounded-[2.5rem] p-12 text-center border-dashed border-2 border-white/5">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                 <Shield className="w-10 h-10 text-indigo-400" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Queue is Empty</h4>
              <p className="text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">System monitoring indicates no pending grievances require immediate committee action at this time.</p>
              <div className="flex justify-center gap-3">
                 <div className="bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">All Clear</div>
              </div>
           </div>
        </div>

        {/* Committee Insights */}
        <div className="space-y-6">
           <h3 className="text-2xl font-bold text-white mb-2">Team Insights</h3>
           <div className="glass-card rounded-[2.5rem] p-8 space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-white/5">
                 <Users className="w-6 h-6 text-indigo-400" />
                 <div>
                    <h5 className="font-bold text-white text-sm">Resolution Team</h5>
                    <p className="text-xs text-slate-500">3 Members active in organization</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Organization Health</p>
                 <div className="space-y-3">
                    <div className="flex justify-between items-end">
                       <span className="text-xs text-slate-500 font-medium">Response Rate</span>
                       <span className="text-xs text-white font-bold tracking-wider">98%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 w-[98%] rounded-full shadow-lg shadow-indigo-500/50" />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between items-end">
                       <span className="text-xs text-slate-500 font-medium">Resolution Time</span>
                       <span className="text-xs text-white font-bold tracking-wider">~4.2h</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-violet-500 w-[85%] rounded-full shadow-lg shadow-violet-500/50" />
                    </div>
                 </div>
              </div>
              
              <div className="pt-6 border-t border-white/5">
                 <p className="text-xs text-slate-500 italic leading-relaxed">
                   Remember: You are responding to reports with decoupled identities. Your replies are the only bridge to student trust.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteeDashboard;
