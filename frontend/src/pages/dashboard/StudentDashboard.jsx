import React from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MessageCircle,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config/api';

const StudentDashboard = () => {
  const user = JSON.parse(localStorage.getItem('voisafe_user') || 'null');
  const [complaints, setComplaints] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMyStats = async () => {
      try {
        const token = localStorage.getItem('voisafe_token');
        const res = await fetch(`${API_URL}/complaints/my`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setComplaints(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyStats();
  }, []);

  const stats = [
    { name: 'Total Grievances', value: complaints.length, icon: FileText, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { name: 'In Progress', value: complaints.filter(c => c.status === 'in-progress').length, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { name: 'Resolved', value: complaints.filter(c => c.status === 'resolved').length, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 sm:p-10 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Welcome back, <br className="sm:hidden" />
            <span className="opacity-90">{user?.name}</span>
          </h1>
          <p className="text-indigo-100 text-base sm:text-lg max-w-xl font-medium leading-relaxed mb-8">
            Your voice is protected and your identity is decoupled. 
            VoiSafe ensures your concerns reach the right people safely.
          </p>
          <Link to="/dashboard/submit">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-indigo-700 px-6 py-3.5 rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform active:scale-95">
              <Plus size={20} />
              Submit New Grievance
            </button>
          </Link>
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

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Recent Activity</h3>
              <Link to="/dashboard/grievances" className="text-indigo-400 text-sm font-bold hover:text-indigo-300 flex items-center gap-1 group">
                View all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
           
           {/* Activity Display */}
           {loading ? (
              <div className="flex justify-center p-20">
                 <RefreshCw className="animate-spin text-slate-800" size={32} />
              </div>
           ) : complaints.length === 0 ? (
              <div className="glass-card rounded-3xl p-8 sm:p-12 text-center border-dashed border-2 border-white/5">
                 <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-10 h-10 text-slate-500" />
                 </div>
                 <h4 className="text-xl font-bold text-white mb-2">No grievances found</h4>
                 <p className="text-slate-500 max-w-xs mx-auto mb-8">You haven't submitted any grievances yet. Your identity will be 100% protected when you do.</p>
                 <Link to="/dashboard/submit" className="text-indigo-400 font-bold hover:underline">Start your first report</Link>
              </div>
           ) : (
             <div className="space-y-4">
               {complaints.slice(0, 3).map(c => (
                 <Link to="/dashboard/grievances" key={c._id} className="block group">
                    <div className="glass-card rounded-2xl p-5 border border-white/5 group-hover:bg-white/[0.02] transition-all flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${c.status === 'resolved' ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                             <FileText size={18} className={c.status === 'resolved' ? 'text-emerald-400' : 'text-amber-400'} />
                          </div>
                          <div>
                             <p className="text-xs font-bold text-white uppercase tracking-tight">{c.title}</p>
                             <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">{c.status}</p>
                          </div>
                       </div>
                       <ArrowRight size={16} className="text-slate-700 group-hover:text-white transition-colors" />
                    </div>
                 </Link>
               ))}
             </div>
           )}
        </div>

        {/* Right Column: Information / Trust */}
        <div className="space-y-6">
           <h3 className="text-2xl font-bold text-white mb-2">Platform Trust</h3>
           <div className="glass-card rounded-[2.5rem] p-8 space-y-8">
              <div className="flex gap-4">
                 <div className="p-3 bg-emerald-500/10 rounded-xl h-fit">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                 </div>
                 <div>
                    <h5 className="font-bold text-white mb-1">Decoupled Identity</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">Your account data is physically isolated from grievance content.</p>
                 </div>
              </div>

              <div className="flex gap-4">
                 <div className="p-3 bg-indigo-500/10 rounded-xl h-fit">
                    <TrendingUp className="w-6 h-6 text-indigo-400" />
                 </div>
                 <div>
                    <h5 className="font-bold text-white mb-1">Encrypted Transit</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">All communications use AES-256-GCM military-grade encryption.</p>
                 </div>
              </div>

              <div className="flex gap-4">
                 <div className="p-3 bg-amber-500/10 rounded-xl h-fit">
                    <MessageCircle className="w-6 h-6 text-amber-400" />
                 </div>
                 <div className={`flex-1 ${complaints.length > 0 ? 'cursor-pointer group/chat' : ''}`}>
                    <h5 className="font-bold text-white mb-1 group-hover/chat:text-amber-400 transition-colors">Direct Authority Link</h5>
                    <p className="text-sm text-slate-500 leading-relaxed mb-3">Chat anonymously with resolution committees in real-time.</p>
                    {complaints.length > 0 && (
                      <Link to="/dashboard/grievances">
                        <button className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-4 py-2 rounded-xl border border-amber-400/20 hover:bg-amber-400/20 transition-all flex items-center gap-2">
                           Open Anonymous Link <ArrowRight size={12} />
                        </button>
                      </Link>
                    )}
                 </div>
              </div>
              
              <div className="pt-4 mt-4 border-t border-white/5">
                 <div className="bg-indigo-600/10 p-4 rounded-2xl border border-indigo-500/20">
                    <p className="text-xs text-indigo-300 font-medium">
                      "VoiSafe empowers the messenger by erasing the identity."
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
