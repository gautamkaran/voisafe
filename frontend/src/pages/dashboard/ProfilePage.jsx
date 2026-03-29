import React, { useState } from 'react';
import { 
  User, Mail, Building, Shield, 
  Settings, Key, LogOut, CheckCircle2,
  Camera, Briefcase, Calendar
} from 'lucide-react';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [user] = useState(JSON.parse(localStorage.getItem('voisafe_user') || '{}'));
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('voisafe_token');
    localStorage.removeItem('voisafe_user');
    window.location.href = '/login';
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      return toast.error("New passwords do not match.");
    }

    setIsUpdating(true);
    try {
      const token = localStorage.getItem('voisafe_token');
      const res = await fetch(`${API_URL.replace('/api/grievance', '/api')}/auth/change-password`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passForm.currentPassword,
          newPassword: passForm.newPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Security credentials updated.");
        setShowPasswordModal(false);
        setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(data.message || "Credential update failed.");
      }
    } catch {
      toast.error("Signal lost while updating credentials.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-20">
      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
           <div className="glass-card w-full max-w-md rounded-[2.5rem] p-8 space-y-8 border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
              <div className="flex justify-between items-center mb-2">
                 <h3 className="text-xl font-black text-white uppercase tracking-tight">Shift Keys</h3>
                 <button onClick={() => setShowPasswordModal(false)} className="p-2 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><X size={16}/></button>
              </div>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2 px-1">Current Secret</label>
                    <input 
                      required
                      type="password" 
                      placeholder="••••••••"
                      value={passForm.currentPassword}
                      onChange={e => setPassForm({...passForm, currentPassword: e.target.value})}
                      className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none shadow-inner" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2 px-1">New Shard Key</label>
                    <input 
                      required
                      type="password" 
                      placeholder="••••••••"
                      value={passForm.newPassword}
                      onChange={e => setPassForm({...passForm, newPassword: e.target.value})}
                      className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none shadow-inner" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2 px-1">Confirm Secret</label>
                    <input 
                      required
                      type="password" 
                      placeholder="••••••••"
                      value={passForm.confirmPassword}
                      onChange={e => setPassForm({...passForm, confirmPassword: e.target.value})}
                      className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none shadow-inner" 
                    />
                 </div>
                 <button 
                   disabled={isUpdating}
                   className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                 >
                    {isUpdating ? <RefreshCw className="animate-spin" size={16} /> : <Key size={16} />} 
                    Finalize Encryption Change
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-900/40 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative group">
           <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-500">
              <User size={64} className="text-white" />
           </div>
           <button className="absolute -bottom-2 -right-2 p-3 bg-slate-800 rounded-2xl border border-white/10 hover:bg-slate-700 transition-all shadow-xl">
              <Camera size={18} className="text-indigo-400" />
           </button>
        </div>

        <div className="text-center md:text-left space-y-2">
           <div className="flex items-center justify-center md:justify-start gap-3">
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">{user.name}</h1>
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">{user.role}</span>
           </div>
           <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2 text-sm font-medium">
              <Mail size={14} /> {user.email}
           </p>
           <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
              <div className="flex flex-col">
                 <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Account Status</p>
                 <p className="text-[11px] text-emerald-400 font-bold uppercase tracking-tight flex items-center gap-1.5"><CheckCircle2 size={12}/> Fully Authenticated</p>
              </div>
              <div className="w-[1px] h-8 bg-white/5" />
              <div className="flex flex-col">
                 <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Trust Index</p>
                 <p className="text-[11px] text-white font-bold uppercase tracking-tight">Level Alpha</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Identity Details */}
        <div className="md:col-span-2 space-y-6">
           <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 space-y-8 shadow-2xl">
              <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                 <div className="p-2 bg-indigo-500/10 rounded-xl">
                    <Shield size={20} className="text-indigo-400" />
                 </div>
                 <h3 className="text-lg font-black text-white uppercase tracking-tight">Identity Parameters</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                       <User size={12} /> Full Name
                    </label>
                    <input 
                       disabled 
                       type="text" 
                       value={user.name}
                       className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-3.5 text-xs text-slate-400 font-bold uppercase tracking-tight opacity-70 cursor-not-allowed" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                       <Mail size={12} /> Email Address
                    </label>
                    <input 
                       disabled 
                       type="email" 
                       value={user.email}
                       className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-3.5 text-xs text-slate-400 font-bold uppercase tracking-tight opacity-70 cursor-not-allowed" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                       <Building size={12} /> Institution Shard
                    </label>
                    <input 
                       disabled 
                       type="text" 
                       value={user.institutionId?.name || 'VoiSafe Global'}
                       className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-3.5 text-xs text-slate-400 font-bold uppercase tracking-tight opacity-70 cursor-not-allowed" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                       <Calendar size={12} /> Registration ISO
                    </label>
                    <input 
                       disabled 
                       type="text" 
                       value={new Date(user.createdAt || Date.now()).toLocaleDateString()}
                       className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-3.5 text-xs text-slate-400 font-bold uppercase tracking-tight opacity-70 cursor-not-allowed" 
                    />
                 </div>
              </div>

              <div className="pt-4">
                 <button 
                   disabled
                   className="w-full bg-white/5 text-slate-500 font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] border border-white/5 transition-all opacity-50"
                 >
                    Request Parameter Edit from Super-Admin
                 </button>
              </div>
           </div>
        </div>

        {/* Security & Quick Actions */}
        <div className="space-y-6">
           <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 space-y-6 shadow-2xl">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Terminal Security</h4>
              
              <button 
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800 rounded-2xl transition-all border border-white/5 group"
              >
                 <div className="flex items-center gap-3">
                    <Key size={18} className="text-amber-400" />
                    <span className="text-[11px] font-bold text-white uppercase tracking-tight">Shift Keys</span>
                 </div>
                 <Shield size={14} className="text-slate-700 group-hover:text-indigo-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800 rounded-2xl transition-all border border-white/5 group">
                 <div className="flex items-center gap-3">
                    <Settings size={18} className="text-indigo-400" />
                    <span className="text-[11px] font-bold text-white uppercase tracking-tight">Signal Config</span>
                 </div>
                 <Shield size={14} className="text-slate-700 group-hover:text-indigo-400" />
              </button>

              <div className="pt-4 border-t border-white/5">
                 <button 
                   onClick={handleLogout}
                   className="w-full flex items-center justify-center gap-3 p-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl transition-all border border-rose-500/20 font-black uppercase tracking-widest text-[10px]"
                 >
                    <LogOut size={18} /> Kill Process
                 </button>
              </div>
           </div>

           <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-600/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
              <Briefcase size={32} className="text-white/40 mb-4" />
              <h4 className="text-lg font-black text-white uppercase tracking-tighter leading-none mb-2">VoiSafe Premium</h4>
              <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-widest opacity-80 mb-6">Enhanced Encryption Protocol Active</p>
              <button className="w-full bg-white text-indigo-600 font-black py-3 rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 transition-transform active:scale-95">
                 Audit Protocol
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
