import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Search, Shield, Mail,
  CheckCircle2, MoreVertical,
  UserPlus, Trash2, RefreshCw, X
} from 'lucide-react';
import { toast } from 'react-toastify';
import { API_URL } from '../../../config/api';

const roleBadge = {
  committee: { label: 'Committee', cls: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20' },
  student:   { label: 'Student',   cls: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  admin:     { label: 'Admin',     cls: 'text-violet-400 bg-violet-400/10 border-violet-400/20' },
};

const ManageTeamsPage = () => {
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('committee'); // Default to committee to show the resolution team
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({ name: '', email: '', password: '', role: 'committee' });

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('voisafe_token');
      const res = await fetch(`${API_URL}/users/org`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMembers(data.data);
      }
    } catch {
      toast.error("Cloud synchronization failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleCreateMember = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('voisafe_token');
      const res = await fetch(`${API_URL}/users/org`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inviteData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${inviteData.role.toUpperCase()} identity established.`);
        setShowInviteModal(false);
        setInviteData({ name: '', email: '', password: '', role: 'committee' });
        fetchMembers();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Terminal error during member creation.");
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm("Are you sure? This will revoke all terminal access for this identity.")) return;
    try {
      const token = localStorage.getItem('voisafe_token');
      await fetch(`${API_URL}/users/org/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success("Identity purged from organization.");
      fetchMembers();
    } catch {
      toast.error("Operation failed.");
    }
  };

  const filtered = members.filter(m => {
    const matchSearch = String(m.name || '').toLowerCase().includes(search.toLowerCase()) ||
                        String(m.email || '').toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || m.role === filterRole;
    return matchSearch && matchRole;
  });

  const stats = [
    { label: 'Network Size', value: members.length, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { label: 'Resolvers', value: members.filter(m => m.role === 'committee').length, icon: Shield, color: 'text-violet-400', bg: 'bg-violet-400/10' },
    { label: 'Students', value: members.filter(m => m.role === 'student').length, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Organization Access Registry</p>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Manage Teams</h1>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
        >
          <UserPlus size={16} /> Assign Committee
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map(s => (
          <div key={s.label} className="glass-card rounded-3xl p-6 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{s.label}</p>
              <h4 className="text-3xl font-black text-white">{loading ? '—' : s.value}</h4>
            </div>
            <div className={`p-3 ${s.bg} rounded-2xl group-hover:scale-110 transition-transform`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-3 bg-slate-800/50 border border-white/5 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500/30 transition-all">
          <Search size={16} className="text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search identities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none w-full"
          />
        </div>
        <select
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
          className="bg-slate-800/50 border border-white/5 text-slate-300 text-sm rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
        >
          <option value="all">All Terminal Roles</option>
          <option value="committee">Committee</option>
          <option value="student">Student</option>
        </select>
        <button onClick={fetchMembers} className="p-3 bg-slate-800/50 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Members Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/[0.01]">
          <div className="col-span-4">Identity</div>
          <div className="col-span-3">Network Entry</div>
          <div className="col-span-2">Access Level</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {loading ? (
           <div className="py-20 text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-indigo-500/20 mx-auto animate-spin" />
              <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Decoupling identities...</p>
           </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-medium italic">No identities found in this registry sector.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map(member => {
              const badge = roleBadge[member.role] || roleBadge.student;
              return (
                <div key={member._id} className="flex flex-col md:grid md:grid-cols-12 gap-3 sm:gap-4 px-6 py-5 hover:bg-white/[0.02] group transition-colors relative">
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center font-black text-white text-sm border border-white/5 shrink-0 group-hover:scale-110 transition-transform">
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white text-sm truncate group-hover:text-indigo-300 transition-colors uppercase tracking-tight">{member.name}</p>
                      <p className="md:hidden text-[10px] text-slate-500 font-mono">{member.email}</p>
                    </div>
                  </div>
                  <div className="col-span-3 hidden md:flex md:items-center">
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-2"><Mail size={12} className="opacity-30"/> {member.email}</span>
                  </div>
                  <div className="col-span-2 hidden md:flex md:items-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>
                  <div className="col-span-2 hidden md:flex md:items-center">
                    <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/5 px-2 py-1 rounded-lg">
                      <CheckCircle2 size={12}/> Authorized
                    </span>
                  </div>
                  <div className="col-span-1 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleDeleteMember(member._id)}
                      className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      title="Purge Identity"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button className="p-2 text-slate-600 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
           <div className="glass-card w-full max-w-md rounded-3xl p-8 shadow-2xl border border-white/10 animate-fade-in-up">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-wider">Assign Authority</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Register a new resolution committee member</p>
                 </div>
                 <button onClick={() => setShowInviteModal(false)} className="text-slate-500 hover:text-white p-2 bg-white/5 rounded-full transition-colors">
                    <X size={20} />
                 </button>
              </div>

              <form onSubmit={handleCreateMember} className="space-y-5">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={inviteData.name} 
                      onChange={e => setInviteData({...inviteData, name: e.target.value})}
                      className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                      placeholder="e.g. Rahul Gupta"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Terminal</label>
                    <input 
                      type="email" 
                      required 
                      value={inviteData.email} 
                      onChange={e => setInviteData({...inviteData, email: e.target.value})}
                      className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                      placeholder="rahul@institution.edu"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Initial Key (Password)</label>
                    <input 
                      type="password" 
                      required 
                      value={inviteData.password} 
                      onChange={e => setInviteData({...inviteData, password: e.target.value})}
                      className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-indigo-400 tracking-widest"
                      placeholder="••••••••"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Terminal Role</label>
                    <select 
                      value={inviteData.role} 
                      onChange={e => setInviteData({...inviteData, role: e.target.value})}
                      className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold appearance-none"
                    >
                      <option value="committee">Resolution Committee (Resolver)</option>
                      <option value="admin">System Administrator (Full Access)</option>
                    </select>
                 </div>

                 <button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:scale-[1.02] active:scale-95 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all mt-4 text-[10px] uppercase tracking-[0.25em]">
                   Establish Identity Access
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default ManageTeamsPage;
