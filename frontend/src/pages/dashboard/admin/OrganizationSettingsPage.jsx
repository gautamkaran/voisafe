import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2, Mail, Globe, MapPin, Save,
  Shield, Bell, Lock, AlertTriangle, 
  FileText, Link as LinkIcon, Eye, EyeOff, RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import { API_URL } from '../../../config/api';

const SectionHeader = ({ icon: Icon, title, desc }) => (
  <div className="pb-4 border-b border-white/5 mb-6">
    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
      <Icon size={14} className="text-indigo-400" /> {title}
    </h3>
    {desc && <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">{desc}</p>}
  </div>
);

const Toggle = ({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative w-12 h-6 rounded-full transition-all duration-300 shrink-0 ${enabled ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-slate-800'}`}
  >
    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${enabled ? 'left-7' : 'left-1'}`} />
  </button>
);

const inputCls = 'w-full bg-slate-900 border border-white/5 text-white placeholder:text-slate-700 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium';

const OrganizationSettingsPage = () => {
  const user = JSON.parse(localStorage.getItem('voisafe_user') || 'null');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [orgForm, setOrgForm] = useState({
    name: '',
    contactEmail: '',
    website: '',
    linkedin: '',
    address: '',
    description: '',
    collegeCode: '',
    domain: '',
  });

  const [notifications, setNotifications] = useState({
    newGrievance: true,
    resolved: true,
    escalated: true,
    weeklyDigest: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });

  const fetchOrgData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('voisafe_token');
      const res = await fetch(`${API_URL}/admin/my-organization`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrgForm({
          ...orgForm,
          ...data.data,
          website: data.data.website || '',
          linkedin: data.data.linkedin || '',
          address: data.data.address || '',
          description: data.data.description || '',
        });
      }
    } catch {
      toast.error("Failed to sync institutional registry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrgData();
  }, [fetchOrgData]);

  const handleOrgSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('voisafe_token');
      const res = await fetch(`${API_URL}/admin/my-organization`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orgForm)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Institutional parameters updated.");
        fetchOrgData();
      }
    } catch {
      toast.error("Data injection failed.");
    } finally {
      setSaving(false);
    }
  };

  const toggleNotif = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Preference updated.');
  };

  if (loading) return (
     <div className="flex flex-col items-center justify-center py-40 gap-4">
        <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin opacity-20" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Authenticating Sector...</p>
     </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up pb-10">
      {/* Header */}
      <div>
        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Organization Terminal</p>
        <h1 className="text-2xl sm:text-3xl font-black text-white">System Settings</h1>
      </div>

      {/* Admin Profile Card */}
      <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-indigo-600/20">
            {orgForm.name?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="text-xl font-black text-white tracking-tight uppercase">{orgForm.name || 'INSTITUTION'}</p>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{orgForm.domain || 'no-domain-set'}</p>
            <div className="flex gap-2 mt-3">
               <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                 {orgForm.collegeCode}
               </span>
               <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                 ACTIVE
               </span>
            </div>
          </div>
        </div>
      </div>

      {/* Organization Info */}
      <form onSubmit={handleOrgSave} className="glass-card rounded-[2.5rem] p-8 sm:p-10 border border-white/5 shadow-2xl space-y-6">
        <SectionHeader icon={Building2} title="Institutional Profile" desc="Core identity parameters of the organization." />
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 ml-1">Institution Name</label>
              <input type="text" value={orgForm.name} onChange={e => setOrgForm(p => ({...p, name: e.target.value}))} placeholder="Organization name" className={inputCls} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 ml-1">Contact Email</label>
              <input type="email" value={orgForm.contactEmail} onChange={e => setOrgForm(p => ({...p, contactEmail: e.target.value}))} placeholder="contact@institution.ac.in" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 ml-1">Website URL</label>
              <input type="url" value={orgForm.website} onChange={e => setOrgForm(p => ({...p, website: e.target.value}))} placeholder="https://institution.ac.in" className={inputCls} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 ml-1">LinkedIn Profile</label>
              <input type="url" value={orgForm.linkedin} onChange={e => setOrgForm(p => ({...p, linkedin: e.target.value}))} placeholder="linkedin.com/company/..." className={inputCls} />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 ml-1">Geographic Address</label>
            <input type="text" value={orgForm.address} onChange={e => setOrgForm(p => ({...p, address: e.target.value}))} placeholder="Full campus address" className={inputCls} />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 ml-1">Institutional Description</label>
            <textarea rows={3} value={orgForm.description} onChange={e => setOrgForm(p => ({...p, description: e.target.value}))} placeholder="Brief summary of your mission" className={inputCls + ' resize-none'} />
          </div>
          <div className="pt-4 flex justify-end">
            <button
               type="submit"
               disabled={saving}
               className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-xl shadow-indigo-600/20"
            >
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? 'Synchronizing...' : 'Save Parameters'}
            </button>
          </div>
        </div>
      </form>

      {/* Notifications */}
      <div className="glass-card rounded-[2.5rem] p-8 sm:p-10 border border-white/5 shadow-2xl">
        <SectionHeader icon={Bell} title="Terminal Alerts" desc="Choose what events trigger system notifications." />
        <div className="space-y-2">
          {[
            { key: 'newGrievance', label: 'Incoming Reports', desc: 'Alert when a new grievance identity is registered.' },
            { key: 'resolved',     label: 'Resolution Success',      desc: 'Notify when a committee marks a case as resolved.' },
            { key: 'escalated',    label: 'Critical Escalations',          desc: 'Alert when a case bypasses standard resolution.' },
            { key: 'weeklyDigest', label: 'Institutional Digest',     desc: 'Receive a weekly summary of all trust metrics.' },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between py-5 border-b border-white/5 last:border-none gap-6 hover:bg-white/[0.01] transition-colors rounded-xl px-2">
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-tight">{n.label}</p>
                <p className="text-[10px] text-slate-500 mt-1 font-medium italic">{n.desc}</p>
              </div>
              <Toggle enabled={notifications[n.key]} onToggle={() => toggleNotif(n.key)} />
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card rounded-[2.5rem] p-8 sm:p-10 border border-rose-500/10 shadow-2xl bg-rose-500/[0.02]">
        <SectionHeader icon={AlertTriangle} title="Danger Zone" desc="High-risk institutional operations." />
        <div className="space-y-4">
          <button
            onClick={() => toast.error('Contact Super Admin for terminal decommissioning.')}
            className="w-full px-6 py-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all text-center"
          >
            Request Terminal Deletion
          </button>
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest text-center">Irreversible action. Requires Super Admin cryptographic consent.</p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSettingsPage;
