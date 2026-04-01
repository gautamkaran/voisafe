import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  Settings, 
  ArrowRight,
  Shield,
  Activity,
  Building2,
  PieChart,
  RefreshCw,
  Mail,
  CheckCircle2,
  MoreVertical,
  UserPlus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_URL } from '../../config/api';

const roleBadge = {
  committee: { label: 'Committee', cls: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20' },
  student:   { label: 'Student',   cls: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  admin:     { label: 'Admin',     cls: 'text-violet-400 bg-violet-400/10 border-violet-400/20' },
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalComplaints: 0,
    resolvedComplaints: 0,
    resolutionRate: 0,
    pendingComplaints: 0
  });
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('voisafe_user') || 'null');

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
      toast.error("Could not load organization health metrics.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMembers = useCallback(async () => {
    setMembersLoading(true);
    try {
      const token = localStorage.getItem('voisafe_token');
      const res = await fetch(`${API_URL}/users/org`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMembers(data.data.slice(0, 5)); // Show top 5 recent members on dashboard
      }
    } catch {
      console.error("Failed to fetch members");
    } finally {
      setMembersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchMembers();
  }, [fetchStats, fetchMembers]);

  const dashboardStats = [
    { name: 'Organization Users', value: stats.totalUsers, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { name: 'System Grievances', value: stats.totalComplaints, icon: BarChart3, color: 'text-violet-400', bg: 'bg-violet-400/10' },
    { name: 'Resolution Rate', value: `${stats.resolutionRate}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
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
                   {user?.orgName || "VOISAFE"}
                 </p>
              </div>
              <div className="p-4 sm:p-6 glass-card rounded-2xl sm:rounded-3xl text-center space-y-1 sm:space-y-2 border-emerald-500/10">
                 <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 mx-auto opacity-50 mb-1" />
                 <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Status</p>
                 <p className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-widest">{loading ? "Syncing..." : "Optimal"}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {dashboardStats.map((stat) => (
          <div key={stat.name} className="glass-card rounded-[2rem] p-6 sm:p-8 flex items-center justify-between group hover:border-indigo-500/30 transition-all shadow-xl">
             <div className="min-w-0">
                <p className="text-slate-400 text-xs sm:text-[10px] font-black uppercase tracking-[0.2em] mb-1 truncate">{stat.name}</p>
                <h4 className="text-3xl sm:text-4xl font-black text-white">
                   {loading ? "—" : stat.value}
                </h4>
             </div>
             <div className={`p-3 sm:p-4 ${stat.bg} rounded-2xl group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${stat.color}`} />
             </div>
          </div>
        ))}
      </div>

      {/* Charts / Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        {/* Member Directory Overview */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-white">Member Registry</h3>
              <div className="flex gap-2">
                 <Link to="/dashboard/committees">
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 text-xs font-bold rounded-xl border border-indigo-500/10 transition-all">
                       View All Registry
                    </button>
                 </Link>
                 <button onClick={() => {fetchStats(); fetchMembers();}} className="p-2 border border-white/5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
                    <RefreshCw size={18} className={membersLoading ? "animate-spin" : ""} />
                 </button>
              </div>
           </div>
           
           <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/[0.01]">
                <div className="col-span-6">Identity</div>
                <div className="col-span-4">Access Level</div>
                <div className="col-span-2 text-right">Status</div>
              </div>

              {membersLoading ? (
                <div className="py-20 text-center space-y-4">
                  <RefreshCw className="w-10 h-10 text-indigo-500/20 mx-auto animate-spin" />
                  <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Loading internal network...</p>
                </div>
              ) : members.length === 0 ? (
                <div className="py-20 text-center px-10">
                  <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium italic mb-6">No identities registered in your organization yet.</p>
                  <Link to="/dashboard/committees">
                    <button className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-2xl text-white font-bold transition-all shadow-xl shadow-indigo-600/20">
                      Configure Initial Teams
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {members.map(member => {
                    const badge = roleBadge[member.role] || roleBadge.student;
                    return (
                      <div key={member._id} className="flex flex-col md:grid md:grid-cols-12 gap-3 sm:gap-4 px-6 py-5 hover:bg-white/[0.02] group transition-colors">
                        <div className="col-span-6 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center font-black text-white text-sm border border-white/5 shrink-0">
                            {member.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white text-sm truncate uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{member.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                              <Mail size={10} className="opacity-30"/> {member.email}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-4 hidden md:flex md:items-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </div>
                        <div className="col-span-2 hidden md:flex md:items-center justify-end">
                          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/5 px-2 py-1 rounded-lg">
                            <CheckCircle2 size={12}/> OK
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="p-4 bg-white/[0.01] text-center border-t border-white/5">
                    <Link to="/dashboard/committees" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2">
                       Enter Full Registry Module <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              )}
           </div>
        </div>

        {/* Analytics Summary */}
        <div className="space-y-6">
           <h3 className="text-2xl font-bold text-white mb-2">Health Metrics</h3>
           <div className={`glass-card rounded-[2.5rem] p-8 space-y-8 h-full min-h-[400px] flex flex-col items-center justify-center text-center ${stats.totalComplaints < 1 && 'opacity-70'}`}>
              <div className="relative">
                <PieChart className="w-24 h-24 text-indigo-400/40 opacity-40 mb-6" />
                {stats.resolutionRate > 0 && <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]" />}
              </div>
              
              <div>
                 <h4 className="text-xl font-bold text-white mb-2">{stats.totalComplaints > 0 ? "Organizational Health" : "Insufficient Data"}</h4>
                 <p className="text-sm text-slate-500 mx-auto max-w-xs leading-relaxed"> 
                   {stats.totalComplaints > 0 
                    ? `Currently maintaining a ${stats.resolutionRate}% resolution efficiency across ${stats.totalComplaints} filed grievances.`
                    : "Analytics require at least 1 filed grievance to generate meaningful trend reports for this organization."
                   }
                  </p>
              </div>
              <div className="pt-8 border-t border-white/5 w-full">
                 <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]">{loading ? "Synchronizing..." : "Aggregating trust data"}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
