import React, { useState } from 'react';
import {
  Building2, Mail, Globe, Code2, MapPin, FileText,
  User, Lock, Eye, EyeOff, Save, CheckCircle2, RefreshCw,
  AlertTriangle, ChevronDown, Zap,
} from 'lucide-react';
import { toast } from 'react-toastify';

const API_BASE = 'http://localhost:3000/api/admin';

const FormField = ({ label, required, icon: Icon, error, children }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase tracking-widest">
      {Icon && <Icon size={12} className="text-indigo-400" />}
      {label}
      {required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-rose-400 text-xs flex items-center gap-1"><AlertTriangle size={10} /> {error}</p>}
  </div>
);

const inputCls = (hasError) =>
  `w-full bg-slate-800/60 border ${hasError ? 'border-rose-500/50 focus:ring-rose-500/30' : 'border-white/5 focus:ring-indigo-500/30'} text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all`;

const SuccessCard = ({ data, onReset }) => (
  <div className="space-y-6 animate-fade-in-up">
    <div className="flex flex-col items-center text-center py-10 px-6 glass-card rounded-3xl border border-emerald-500/20">
      <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6">
        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
      </div>
      <h2 className="text-2xl font-black text-white mb-2">Institution Onboarded!</h2>
      <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
        <strong className="text-emerald-400">{data.org.name}</strong> has been created and is immediately active. The admin account is ready to log in.
      </p>
    </div>

    {/* Credentials Summary */}
    <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4 border border-white/5">
      <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
        <Zap size={14} className="text-indigo-400" /> Onboarding Summary
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-800/40 rounded-2xl space-y-1">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Organization</p>
          <p className="text-sm font-bold text-white">{data.org.name}</p>
          <p className="text-xs text-slate-400">{data.org.domain} • {data.org.collegeCode}</p>
        </div>
        <div className="p-4 bg-slate-800/40 rounded-2xl space-y-1">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Admin Account</p>
          <p className="text-sm font-bold text-white">{data.admin.name}</p>
          <p className="text-xs text-slate-400">{data.admin.email}</p>
        </div>
      </div>
      <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-start gap-3">
        <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-300/80 leading-relaxed">
          Share the admin email and password with the institution securely. They can log in immediately.
        </p>
      </div>
    </div>

    <div className="flex gap-4">
      <button
        onClick={onReset}
        className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl transition-all active:scale-95"
      >
        + Onboard Another Institution
      </button>
    </div>
  </div>
);

const CreateOrganizationPage = () => {
  const [form, setForm] = useState({
    orgName: '', domain: '', collegeCode: '', contactEmail: '',
    typeOfOrg: 'college', address: '', description: '',
    adminName: '', adminEmail: '', adminPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const update = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.orgName.trim())       e.orgName       = 'Organization name is required';
    if (!form.domain.trim())        e.domain        = 'Domain is required (e.g. college.ac.in)';
    if (!form.collegeCode.trim())   e.collegeCode   = 'College code is required';
    if (!form.contactEmail.trim())  e.contactEmail  = 'Contact email is required';
    if (!form.adminName.trim())     e.adminName     = 'Admin name is required';
    if (!form.adminEmail.trim())    e.adminEmail    = 'Admin email is required';
    if (!form.adminPassword.trim()) e.adminPassword = 'Password is required';
    if (form.adminPassword.length > 0 && form.adminPassword.length < 6)
                                    e.adminPassword = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/organizations/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message);
        setSuccessData(json.data);
      } else {
        toast.error(json.message);
      }
    } catch {
      toast.error('Network error. Check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setForm({ orgName: '', domain: '', collegeCode: '', contactEmail: '', typeOfOrg: 'college', address: '', description: '', adminName: '', adminEmail: '', adminPassword: '' });
    setErrors({});
  };

  if (successData) return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Super Admin</p>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Onboard Institution</h1>
      </div>
      <SuccessCard data={successData} onReset={handleReset} />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto pb-10 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Super Admin</p>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Onboard Institution</h1>
        <p className="text-slate-500 text-sm mt-1">Create an organization and its admin account directly — it will be immediately active.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ─── Organization Details ─── */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-white/5">
            <Building2 size={14} className="text-indigo-400" /> Organization Details
          </h3>

          <FormField label="Organization Name" required icon={Building2} error={errors.orgName}>
            <input
              type="text"
              placeholder="e.g. Government Engineering College"
              value={form.orgName}
              onChange={e => update('orgName', e.target.value)}
              className={inputCls(errors.orgName)}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Domain" required icon={Globe} error={errors.domain}>
              <input
                type="text"
                placeholder="e.g. gec.ac.in"
                value={form.domain}
                onChange={e => update('domain', e.target.value)}
                className={inputCls(errors.domain)}
              />
            </FormField>
            <FormField label="College Code" required icon={Code2} error={errors.collegeCode}>
              <input
                type="text"
                placeholder="e.g. GEC2024"
                value={form.collegeCode}
                onChange={e => update('collegeCode', e.target.value.toUpperCase())}
                className={inputCls(errors.collegeCode)}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Contact Email" required icon={Mail} error={errors.contactEmail}>
              <input
                type="email"
                placeholder="contact@college.ac.in"
                value={form.contactEmail}
                onChange={e => update('contactEmail', e.target.value)}
                className={inputCls(errors.contactEmail)}
              />
            </FormField>
            <FormField label="Institution Type" icon={ChevronDown}>
              <select
                value={form.typeOfOrg}
                onChange={e => update('typeOfOrg', e.target.value)}
                className={inputCls(false) + ' cursor-pointer'}
              >
                <option value="college">College</option>
                <option value="school">School</option>
                <option value="ngo">NGO</option>
              </select>
            </FormField>
          </div>

          <FormField label="Address" icon={MapPin}>
            <input
              type="text"
              placeholder="Full institutional address (optional)"
              value={form.address}
              onChange={e => update('address', e.target.value)}
              className={inputCls(false)}
            />
          </FormField>

          <FormField label="Description" icon={FileText}>
            <textarea
              rows={3}
              placeholder="Brief description of the institution (optional)"
              value={form.description}
              onChange={e => update('description', e.target.value)}
              className={inputCls(false) + ' resize-none'}
            />
          </FormField>
        </div>

        {/* ─── Admin Account ─── */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-white/5">
            <User size={14} className="text-indigo-400" /> Admin Account Credentials
          </h3>
          <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-start gap-3">
            <Zap size={13} className="text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-relaxed">
              These credentials will be used by the institution's administrator to log in. Share them securely after creation.
            </p>
          </div>

          <FormField label="Admin Full Name" required icon={User} error={errors.adminName}>
            <input
              type="text"
              placeholder="e.g. Dr. Ramesh Kumar"
              value={form.adminName}
              onChange={e => update('adminName', e.target.value)}
              className={inputCls(errors.adminName)}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Admin Email" required icon={Mail} error={errors.adminEmail}>
              <input
                type="email"
                placeholder="admin@college.ac.in"
                value={form.adminEmail}
                onChange={e => update('adminEmail', e.target.value)}
                className={inputCls(errors.adminEmail)}
              />
            </FormField>
            <FormField label="Password" required icon={Lock} error={errors.adminPassword}>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.adminPassword}
                  onChange={e => update('adminPassword', e.target.value)}
                  className={inputCls(errors.adminPassword) + ' pr-12'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormField>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.99] flex items-center justify-center gap-3"
        >
          {loading
            ? <><RefreshCw size={16} className="animate-spin" /> Creating Institution...</>
            : <><Save size={16} /> Create Institution + Admin Account</>
          }
        </button>
      </form>
    </div>
  );
};

export default CreateOrganizationPage;
