import React, { useState } from 'react';
import {
  Users, Plus, Search, Shield, Mail, Hash,
  CheckCircle2, Clock, XCircle, MoreVertical,
  UserPlus, Trash2, Edit3, ChevronDown, RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';

const roleBadge = {
  committee: { label: 'Committee', cls: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20' },
  student:   { label: 'Student',   cls: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  admin:     { label: 'Admin',     cls: 'text-violet-400 bg-violet-400/10 border-violet-400/20' },
};

// Sample placeholder team members – will be replaced with real API data
const MOCK_MEMBERS = [
  { _id: '1', name: 'Priya Sharma',   email: 'priya@org.com',  role: 'committee', status: 'active' },
  { _id: '2', name: 'Rahul Gupta',    email: 'rahul@org.com',  role: 'committee', status: 'active' },
  { _id: '3', name: 'Anjali Singh',   email: 'anjali@org.com', role: 'student',   status: 'active' },
  { _id: '4', name: 'Karan Mehta',    email: 'karan@org.com',  role: 'student',   status: 'active' },
];

const ManageTeamsPage = () => {
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [members] = useState(MOCK_MEMBERS);

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                        m.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || m.role === filterRole;
    return matchSearch && matchRole;
  });

  const stats = [
    { label: 'Total Members', value: members.length, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { label: 'Committee Members', value: members.filter(m => m.role === 'committee').length, icon: Shield, color: 'text-violet-400', bg: 'bg-violet-400/10' },
    { label: 'Students', value: members.filter(m => m.role === 'student').length, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Organization Admin</p>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Manage Teams</h1>
          <p className="text-slate-500 text-sm mt-1">View and manage your institution's committee and student members.</p>
        </div>
        <button
          onClick={() => toast.info('Member invitation coming soon!')}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
        >
          <UserPlus size={16} /> Invite Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map(s => (
          <div key={s.label} className="glass-card rounded-3xl p-6 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{s.label}</p>
              <h4 className="text-3xl font-black text-white">{s.value}</h4>
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
            placeholder="Search by name or email..."
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
          <option value="all">All Roles</option>
          <option value="committee">Committee</option>
          <option value="student">Student</option>
        </select>
      </div>

      {/* Members Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          <div className="col-span-4">Member</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No members found.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map(member => {
              const badge = roleBadge[member.role] || roleBadge.student;
              return (
                <div key={member._id} className="flex flex-col md:grid md:grid-cols-12 gap-3 sm:gap-4 px-6 py-5 hover:bg-white/[0.02] group transition-colors">
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center font-black text-white text-sm border border-white/5 shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <p className="font-bold text-white text-sm truncate group-hover:text-indigo-300 transition-colors">{member.name}</p>
                  </div>
                  <div className="col-span-3 hidden md:flex md:items-center">
                    <span className="text-xs text-slate-500 flex items-center gap-1"><Mail size={11}/> {member.email}</span>
                  </div>
                  <div className="col-span-2 hidden md:flex md:items-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>
                  <div className="col-span-2 hidden md:flex md:items-center">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                      <CheckCircle2 size={11}/> Active
                    </span>
                  </div>
                  <div className="col-span-1 hidden md:flex md:items-center md:justify-end">
                    <button
                      onClick={() => toast.info('Member management coming soon!')}
                      className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Coming Soon Notice */}
      <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-center gap-3">
        <RefreshCw size={14} className="text-indigo-400 shrink-0" />
        <p className="text-xs text-slate-400">Member data will sync from the live database once the invitation and user management APIs are connected.</p>
      </div>
    </div>
  );
};

export default ManageTeamsPage;
