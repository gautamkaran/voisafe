import React, { useState } from 'react';
import {
  Settings, Shield, Bell, Globe, Lock, Mail, Save,
  ToggleLeft, ToggleRight, AlertTriangle, Server, Key
} from 'lucide-react';
import { toast } from 'react-toastify';

const SettingRow = ({ icon: Icon, label, desc, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-b border-white/5 last:border-none">
    <div className="flex items-start gap-4">
      <div className="p-2 bg-slate-800 rounded-xl mt-0.5 shrink-0">
        <Icon size={16} className="text-indigo-400" />
      </div>
      <div>
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed max-w-sm">{desc}</p>
      </div>
    </div>
    <div className="shrink-0 ml-10 sm:ml-0">{children}</div>
  </div>
);

const Toggle = ({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-indigo-600' : 'bg-slate-700'}`}
  >
    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${enabled ? 'left-7' : 'left-1'}`} />
  </button>
);

const SuperAdminSettingsPage = () => {
  const user = JSON.parse(localStorage.getItem('voisafe_user') || 'null');

  const [settings, setSettings] = useState({
    maintenanceMode: false,
    newRegistrations: true,
    emailNotifications: true,
    autoApprove: false,
    twoFactor: false,
    auditLogs: true,
  });

  const toggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Setting updated successfully');
  };

  const handleSave = () => toast.success('Platform settings saved!');

  return (
    <div className="space-y-10 animate-fade-in-up pb-10">
      {/* Header */}
      <div>
        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Super Admin</p>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Platform Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Global configuration for the VoiSafe platform.</p>
      </div>

      {/* Admin Profile */}
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <h3 className="text-base font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
          <Shield size={16} className="text-indigo-400" /> Admin Identity
        </h3>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-2xl shadow-xl">
            {user?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <p className="text-lg font-bold text-white">{user?.name || 'Super Admin'}</p>
            <p className="text-sm text-slate-400">{user?.email || 'admin@voisafe.org'}</p>
            <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
              <Shield size={10} /> Super Administrator
            </span>
          </div>
        </div>
      </div>

      {/* Platform Controls */}
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <h3 className="text-base font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
          <Server size={16} className="text-indigo-400" /> Platform Controls
        </h3>
        <p className="text-xs text-slate-500 mb-6">Control how the VoiSafe platform operates globally.</p>

        <div>
          <SettingRow
            icon={AlertTriangle}
            label="Maintenance Mode"
            desc="Temporarily disable all access for scheduled maintenance. All users will see a maintenance screen."
          >
            <Toggle enabled={settings.maintenanceMode} onToggle={() => toggle('maintenanceMode')} />
          </SettingRow>

          <SettingRow
            icon={Globe}
            label="Allow New Registrations"
            desc="When disabled, new institutions cannot register on the platform."
          >
            <Toggle enabled={settings.newRegistrations} onToggle={() => toggle('newRegistrations')} />
          </SettingRow>

          <SettingRow
            icon={Shield}
            label="Auto-Approve Institutions"
            desc="Automatically approves new institution registrations without requiring manual review."
          >
            <Toggle enabled={settings.autoApprove} onToggle={() => toggle('autoApprove')} />
          </SettingRow>
        </div>
      </div>

      {/* Security Controls */}
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <h3 className="text-base font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
          <Lock size={16} className="text-indigo-400" /> Security Settings
        </h3>
        <p className="text-xs text-slate-500 mb-6">Enforce security policies across the entire platform.</p>

        <div>
          <SettingRow
            icon={Key}
            label="Require 2FA for Admins"
            desc="Force all institution admins to configure two-factor authentication."
          >
            <Toggle enabled={settings.twoFactor} onToggle={() => toggle('twoFactor')} />
          </SettingRow>

          <SettingRow
            icon={Server}
            label="Detailed Audit Logs"
            desc="Log all Super Admin actions including approvals, blocks, and configuration changes."
          >
            <Toggle enabled={settings.auditLogs} onToggle={() => toggle('auditLogs')} />
          </SettingRow>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <h3 className="text-base font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
          <Bell size={16} className="text-indigo-400" /> Notifications
        </h3>
        <p className="text-xs text-slate-500 mb-6">Control alert preferences for platform events.</p>

        <SettingRow
          icon={Mail}
          label="Email Notifications"
          desc="Receive email alerts when a new institution registers and requires review."
        >
          <Toggle enabled={settings.emailNotifications} onToggle={() => toggle('emailNotifications')} />
        </SettingRow>
      </div>

      {/* Danger Zone */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-500/10">
        <h3 className="text-base font-black text-rose-400 uppercase tracking-widest mb-2 flex items-center gap-2">
          <AlertTriangle size={16} /> Danger Zone
        </h3>
        <p className="text-xs text-slate-500 mb-6">Irreversible platform-level actions. Proceed with extreme caution.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => toast.error('This action requires backend confirmation — not yet implemented.')}
            className="px-5 py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-sm font-bold rounded-2xl transition-all"
          >
            Purge All Pending Organizations
          </button>
          <button
            onClick={() => toast.error('This action requires backend confirmation — not yet implemented.')}
            className="px-5 py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-sm font-bold rounded-2xl transition-all"
          >
            Reset Platform to Factory State
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Save size={16} /> Save Settings
        </button>
      </div>
    </div>
  );
};

export default SuperAdminSettingsPage;
