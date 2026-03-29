import React, { useState } from 'react';
import {
  Building2, Mail, Globe, MapPin, Code2, Save,
  Shield, Bell, Lock, AlertTriangle, Settings,
  FileText, Link as LinkIcon, Eye, EyeOff, RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';

const SectionHeader = ({ icon: Icon, title, desc }) => (
  <div className="pb-4 border-b border-white/5 mb-6">
    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
      <Icon size={14} className="text-indigo-400" /> {title}
    </h3>
    {desc && <p className="text-xs text-slate-500 mt-1">{desc}</p>}
  </div>
);

const Toggle = ({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${enabled ? 'bg-indigo-600' : 'bg-slate-700'}`}
  >
    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${enabled ? 'left-7' : 'left-1'}`} />
  </button>
);

const inputCls = 'w-full bg-slate-800/60 border border-white/5 text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-transparent transition-all';

const OrganizationSettingsPage = () => {
  const user = JSON.parse(localStorage.getItem('voisafe_user') || 'null');

  const [orgForm, setOrgForm] = useState({
    name: user?.orgName || '',
    contactEmail: user?.email || '',
    website: '',
    linkedin: '',
    address: '',
    description: '',
  });

  const [notifications, setNotifications] = useState({
    newGrievance: true,
    resolved: true,
    escalated: true,
    weeklyDigest: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  const handleOrgSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800)); // simulate save
    toast.success('Organization settings saved!');
    setSaving(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwords.current) return toast.error('Enter your current password.');
    if (passwords.newPass.length < 6) return toast.error('New password must be at least 6 characters.');
    if (passwords.newPass !== passwords.confirm) return toast.error('Passwords do not match.');
    toast.success('Password updated successfully!');
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  const toggleNotif = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Notification preference updated.');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up pb-10">
      {/* Header */}
      <div>
        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Organization Admin</p>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Organization Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your institution's profile, notifications, and security.</p>
      </div>

      {/* Admin Profile Card */}
      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-xl shadow-lg">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="font-bold text-white text-base">{user?.name || 'Admin'}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <span className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
              <Shield size={10} /> Organization Admin
            </span>
          </div>
        </div>
      </div>

      {/* Organization Info */}
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <SectionHeader icon={Building2} title="Institution Profile" desc="Update your organization's public information." />
        <div className="space-y-5">
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Building2 size={12} className="text-indigo-400" /> Institution Name</label>
            <input type="text" value={orgForm.name} onChange={e => setOrgForm(p => ({...p, name: e.target.value}))} placeholder="Organization name" className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Mail size={12} className="text-indigo-400" /> Contact Email</label>
            <input type="email" value={orgForm.contactEmail} onChange={e => setOrgForm(p => ({...p, contactEmail: e.target.value}))} placeholder="contact@institution.ac.in" className={inputCls} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Globe size={12} className="text-indigo-400" /> Website</label>
              <input type="url" value={orgForm.website} onChange={e => setOrgForm(p => ({...p, website: e.target.value}))} placeholder="https://institution.ac.in" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><LinkIcon size={12} className="text-indigo-400" /> LinkedIn</label>
              <input type="url" value={orgForm.linkedin} onChange={e => setOrgForm(p => ({...p, linkedin: e.target.value}))} placeholder="linkedin.com/company/..." className={inputCls} />
            </div>
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><MapPin size={12} className="text-indigo-400" /> Address</label>
            <input type="text" value={orgForm.address} onChange={e => setOrgForm(p => ({...p, address: e.target.value}))} placeholder="Institution address" className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><FileText size={12} className="text-indigo-400" /> Description</label>
            <textarea rows={3} value={orgForm.description} onChange={e => setOrgForm(p => ({...p, description: e.target.value}))} placeholder="Brief description of your institution" className={inputCls + ' resize-none'} />
          </div>
          <button
            onClick={handleOrgSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold text-sm rounded-2xl transition-all active:scale-95"
          >
            {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <SectionHeader icon={Bell} title="Notification Preferences" desc="Choose what events trigger alerts for your admin account." />
        <div className="space-y-0">
          {[
            { key: 'newGrievance', label: 'New Grievance Submitted', desc: 'Alert when a student submits a new complaint.' },
            { key: 'resolved',     label: 'Grievance Resolved',      desc: 'Notify when a committee marks a case as resolved.' },
            { key: 'escalated',    label: 'Case Escalated',          desc: 'Alert when a case is escalated to higher authority.' },
            { key: 'weeklyDigest', label: 'Weekly Digest Email',     desc: 'Receive a weekly summary of all grievance activity.' },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between py-4 border-b border-white/5 last:border-none gap-4">
              <div>
                <p className="text-sm font-bold text-white">{n.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
              </div>
              <Toggle enabled={notifications[n.key]} onToggle={() => toggleNotif(n.key)} />
            </div>
          ))}
        </div>
      </div>

      {/* Change Password */}
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <SectionHeader icon={Lock} title="Change Password" desc="Update your admin account password." />
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {[
            { key: 'current', label: 'Current Password', placeholder: '••••••••' },
            { key: 'newPass', label: 'New Password',     placeholder: 'Min. 6 characters' },
            { key: 'confirm', label: 'Confirm Password', placeholder: 'Repeat new password' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">{f.label}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwords[f.key]}
                  onChange={e => setPasswords(p => ({...p, [f.key]: e.target.value}))}
                  placeholder={f.placeholder}
                  className={inputCls + ' pr-12'}
                />
                {f.key === 'newPass' && (
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                )}
              </div>
            </div>
          ))}
          <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm rounded-2xl transition-all active:scale-95">
            <Lock size={15}/> Update Password
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-500/10">
        <SectionHeader icon={AlertTriangle} title="Danger Zone" desc="Irreversible actions for this organization." />
        <div className="space-y-3">
          <button
            onClick={() => toast.error('Contact Super Admin to perform this action.')}
            className="w-full px-5 py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-sm font-bold rounded-2xl transition-all text-left"
          >
            Request Organization Deletion
          </button>
          <p className="text-xs text-slate-600">This action cannot be undone. It requires Super Admin approval.</p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSettingsPage;
