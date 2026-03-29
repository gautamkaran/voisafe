import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  Shield,
  Globe,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  Mail,
  MapPin,
  Code2,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  X,
  Info,
  Link as LinkIcon,
} from 'lucide-react';
import { toast } from 'react-toastify';

const API_BASE = 'http://localhost:3000/api/admin';

/* ─── Status Badge ─────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    active: { icon: CheckCircle2, label: 'Approved', cls: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
    pending: { icon: Clock, label: 'Pending', cls: 'text-amber-400  bg-amber-400/10  border-amber-400/20' },
    rejected: { icon: XCircle, label: 'Blocked', cls: 'text-rose-400   bg-rose-400/10   border-rose-400/20' },
  };
  const cfg = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${cfg.cls}`}>
      <cfg.icon size={11} />
      {cfg.label}
    </span>
  );
};

/* ─── Detail Field Row ─────────────────────────────────── */
const DetailField = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-none">
      <div className="p-1.5 bg-slate-800 rounded-lg mt-0.5 shrink-0">
        <Icon size={13} className="text-indigo-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm text-white font-medium break-all">{value}</p>
      </div>
    </div>
  );
};

/* ─── Confirm Dialog ───────────────────────────────────── */
const ConfirmDialog = ({ config, onConfirm, onCancel }) => {
  if (!config) return null;

  const isApprove = config.action === 'approve';
  const isUnblock = config.action === 'approve' && config.currentStatus === 'rejected';
  const isBlock = config.action === 'block';

  const meta = {
    approve: {
      label: 'Approve Institution',
      desc: `Are you sure you want to approve "${config.orgName}"? This will allow its admin and students to log in immediately.`,
      confirmCls: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      confirmLabel: 'Yes, Approve',
      icon: CheckCircle2,
      iconCls: 'text-emerald-400 bg-emerald-400/10',
    },
    block: {
      label: 'Block Institution',
      desc: `Are you sure you want to block "${config.orgName}"? All users belonging to this institution will lose access immediately.`,
      confirmCls: 'bg-rose-600 hover:bg-rose-500 text-white',
      confirmLabel: 'Yes, Block',
      icon: XCircle,
      iconCls: 'text-rose-400 bg-rose-400/10',
    },
  };

  const m = meta[config.action];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onCancel} />

      {/* Dialog Box */}
      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Icon Header */}
        <div className="flex flex-col items-center text-center p-8 pb-4">
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-5 ${m.iconCls}`}>
            <m.icon size={32} />
          </div>
          <h3 className="text-xl font-black text-white mb-2">{m.label}</h3>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">{m.desc}</p>
        </div>

        {/* Org Name Highlight */}
        <div className="mx-6 mb-6 p-3 bg-slate-800/60 border border-white/5 rounded-2xl flex items-center gap-3">
          <Building2 size={16} className="text-slate-400 shrink-0" />
          <span className="text-sm font-bold text-white truncate">{config.orgName}</span>
          <StatusBadge status={config.currentStatus} />
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-bold text-sm transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 ${m.confirmCls}`}
          >
            {m.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Organisation Detail Modal ────────────────────────── */
const OrgDetailModal = ({ org, onClose, onAction, actionLoading }) => {
  if (!org) return null;

  const formatDate = (d) => d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />

      {/* Panel */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-slate-900 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{org.name}</h2>
              <div className="mt-1"><StatusBadge status={org.status} /></div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar space-y-2">
          {/* Description Banner */}
          {org.description && (
            <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl mb-4">
              <p className="text-sm text-slate-300 italic leading-relaxed">"{org.description}"</p>
            </div>
          )}

          <div className="divide-y divide-white/0">
            <DetailField icon={Mail} label="Contact Email" value={org.contactEmail} />
            <DetailField icon={Code2} label="College Code" value={org.collegeCode} />
            <DetailField icon={Globe} label="Domain" value={org.domain} />
            <DetailField icon={Info} label="Type" value={org.typeOfOrg?.toUpperCase()} />
            <DetailField icon={MapPin} label="Address" value={org.address} />
            <DetailField icon={LinkIcon} label="Website" value={org.socialMediaLink?.website} />
            <DetailField icon={LinkIcon} label="LinkedIn" value={org.socialMediaLink?.linkedin} />
            <DetailField icon={LinkIcon} label="Twitter / X" value={org.socialMediaLink?.twitter} />
            <DetailField icon={CalendarDays} label="Registered On" value={formatDate(org.createdAt)} />
            <DetailField icon={CalendarDays} label="Last Updated" value={formatDate(org.updatedAt)} />
          </div>

          {/* ID row */}
          <div className="mt-4 p-3 bg-slate-800/50 rounded-xl flex items-center gap-3">
            <Shield size={13} className="text-slate-500 shrink-0" />
            <p className="text-[10px] font-mono text-slate-500 truncate">{org._id}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 border-t border-white/5 flex items-center gap-3 flex-wrap shrink-0">
          {org.status !== 'active' && (
            <button
              onClick={() => { onAction(org._id, 'approve'); onClose(); }}
              disabled={!!actionLoading}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} /> Approve Institution
            </button>
          )}
          {org.status === 'active' && (
            <button
              onClick={() => { onAction(org._id, 'block'); onClose(); }}
              disabled={!!actionLoading}
              className="flex-1 py-3 bg-rose-600/20 hover:bg-rose-600 border border-rose-500/30 disabled:opacity-50 text-rose-400 hover:text-white text-sm font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <XCircle size={16} /> Block Institution
            </button>
          )}
          {org.status === 'rejected' && (
            <button
              onClick={() => { onAction(org._id, 'approve'); onClose(); }}
              disabled={!!actionLoading}
              className="flex-1 py-3 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 disabled:opacity-50 text-indigo-400 hover:text-white text-sm font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <ArrowRight size={16} /> Unblock Institution
            </button>
          )}
          <button onClick={onClose} className="py-3 px-5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-sm font-bold rounded-2xl transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ───────────────────────────────────── */
const SuperAdminDashboard = () => {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState(null); // detail modal
  const [confirmConfig, setConfirmConfig] = useState(null); // confirm dialog
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  // Open confirm dialog before any action
  const requestAction = (org, action) => {
    setConfirmConfig({ id: org._id, orgName: org.name, action, currentStatus: org.status });
  };

  // Called after user clicks Yes in confirm dialog
  const confirmAction = () => {
    if (!confirmConfig) return;
    handleAction(confirmConfig.id, confirmConfig.action);
    setConfirmConfig(null);
    setSelectedOrg(null); // close detail modal if open
  };

  const fetchOrgs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/organizations`);
      const json = await res.json();
      if (json.success) setOrgs(json.data);
    } catch {
      toast.error('Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrgs(); }, [fetchOrgs]);

  const handleAction = async (id, action) => {
    setActionLoading(id + action);
    try {
      const res = await fetch(`${API_BASE}/organizations/${id}/${action}`, { method: 'PATCH' });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message);
        setOrgs(prev => prev.map(o => o._id === id ? json.data : o));
      } else {
        toast.error(json.message);
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const totalOrgs = orgs.length;
  const activeOrgs = orgs.filter(o => o.status === 'active').length;
  const pendingOrgs = orgs.filter(o => o.status === 'pending').length;
  const blockedOrgs = orgs.filter(o => o.status === 'rejected').length;

  // Pagination
  const totalPages = Math.max(1, Math.ceil(totalOrgs / PAGE_SIZE));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageEnd = pageStart + PAGE_SIZE;
  const pagedOrgs = orgs.slice(pageStart, pageEnd);

  // Reset page when orgs list changes
  useEffect(() => { setCurrentPage(1); }, [orgs.length]);

  const globalStats = [
    { name: 'Total Institutions', value: totalOrgs, icon: Building2, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { name: 'Active', value: activeOrgs, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { name: 'Awaiting Approval', value: pendingOrgs, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { name: 'Blocked', value: blockedOrgs, icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  ];

  return (
    <>
      {/* ─── Confirm Dialog (always on top) ─── */}
      {confirmConfig && (
        <ConfirmDialog
          config={confirmConfig}
          onConfirm={confirmAction}
          onCancel={() => setConfirmConfig(null)}
        />
      )}

      {/* ─── Detail Modal ─── */}
      {selectedOrg && (
        <OrgDetailModal
          org={orgs.find(o => o._id === selectedOrg._id) || selectedOrg}
          onClose={() => setSelectedOrg(null)}
          onAction={(id, action) => {
            const org = orgs.find(o => o._id === id);
            if (org) requestAction(org, action);
          }}
          actionLoading={actionLoading}
        />
      )}

      <div className="space-y-10 animate-fade-in-up">
        {/* ─── Banner ─── */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-5 sm:p-8 border border-white/5 shadow-2xl">
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-violet-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <Zap size={11} /> Platform Command Center
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Institutional{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-violet-400">Hub</span>
              </h1>
              <p className="text-slate-400 text-sm max-w-md font-medium leading-relaxed">
                Approve registrations, inspect institution profiles, and enforce access policies.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto shrink-0">
              <div className="px-5 py-3 glass-card rounded-2xl text-center">
                <Globe className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">System</p>
                <p className="text-sm font-bold text-white">Operational</p>
              </div>
              <div className="px-5 py-3 glass-card rounded-2xl text-center">
                <Shield className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Security</p>
                <p className="text-sm font-bold text-white">Critical</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Stats ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {globalStats.map((stat) => (
            <div key={stat.name} className="glass-card rounded-3xl p-5 sm:p-7 flex items-center justify-between group hover:border-indigo-500/30 transition-all shadow-xl">
              <div className="min-w-0">
                <p className="text-slate-500 text-[9px] sm:text-xs font-bold uppercase tracking-widest mb-1 truncate">{stat.name}</p>
                <h4 className="text-2xl sm:text-3xl font-black text-white">
                  {loading ? <span className="text-slate-700">—</span> : stat.value}
                </h4>
              </div>
              <div className={`p-2.5 sm:p-3.5 ${stat.bg} rounded-2xl group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-5 h-5 sm:w-7 sm:h-7 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* ─── Table ─── */}
        <div className="space-y-5 pb-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold text-white">Institutional Oversight</h3>
            <button
              onClick={fetchOrgs}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-bold transition-colors px-3 py-2 rounded-xl hover:bg-white/5"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {pendingOrgs > 0 && (
            <div className="flex items-center gap-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-sm text-amber-300 font-semibold">
                <strong>{pendingOrgs} institution{pendingOrgs > 1 ? 's require' : ' requires'}</strong> your approval.
              </p>
            </div>
          )}

          <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
            {/* Desktop column headers */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <div className="col-span-4">Institution</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Domain</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {loading ? (
              <div className="py-20 text-center">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Loading institutions...</p>
              </div>
            ) : orgs.length === 0 ? (
              <div className="py-20 text-center">
                <Building2 className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No institutions registered yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {pagedOrgs.map((org) => (
                  <div key={org._id}>
                    {/* ── Main row ── */}
                    <div className="flex flex-col md:grid md:grid-cols-12 gap-3 sm:gap-4 px-6 py-5 hover:bg-white/[0.02] transition-colors group">
                      {/* Name + email */}
                      <div className="col-span-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/10 shrink-0">
                          <Building2 className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white text-sm truncate group-hover:text-indigo-300 transition-colors">{org.name}</p>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 truncate">
                            <Mail size={10} /> {org.contactEmail}
                          </p>
                        </div>
                      </div>

                      {/* Type */}
                      <div className="col-span-2 hidden md:flex md:items-center">
                        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{org.typeOfOrg || 'College'}</span>
                      </div>

                      {/* Domain */}
                      <div className="col-span-2 hidden md:flex md:items-center">
                        <span className="text-xs text-slate-500 font-mono truncate">{org.domain}</span>
                      </div>

                      {/* Status */}
                      <div className="col-span-2 hidden md:flex md:items-center">
                        <StatusBadge status={org.status} />
                      </div>

                      {/* Action buttons — exactly ONE per status */}
                      <div className="col-span-2 flex items-center gap-2 md:justify-end flex-wrap">
                        {/* Details button — always visible */}
                        <button
                          onClick={() => setSelectedOrg(org)}
                          className="p-2 bg-white/5 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-300 rounded-xl transition-all text-xs font-bold flex items-center gap-1"
                          title="View Full Details"
                        >
                          <Info size={14} />
                          <span className="hidden sm:inline">Details</span>
                        </button>

                        {/* PENDING → Approve */}
                        {org.status === 'pending' && (
                          <button
                            onClick={() => requestAction(org, 'approve')}
                            disabled={!!actionLoading}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
                          >
                            {actionLoading === org._id + 'approve' ? <RefreshCw size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                            Approve
                          </button>
                        )}

                        {/* ACTIVE → Block */}
                        {org.status === 'active' && (
                          <button
                            onClick={() => requestAction(org, 'block')}
                            disabled={!!actionLoading}
                            className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 disabled:opacity-50 text-rose-400 hover:text-white text-xs font-bold rounded-xl border border-rose-500/30 transition-all active:scale-95 flex items-center gap-1.5"
                          >
                            {actionLoading === org._id + 'block' ? <RefreshCw size={12} className="animate-spin" /> : <XCircle size={12} />}
                            Block
                          </button>
                        )}

                        {/* REJECTED → Unblock */}
                        {org.status === 'rejected' && (
                          <button
                            onClick={() => requestAction(org, 'approve')}
                            disabled={!!actionLoading}
                            className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 disabled:opacity-50 text-indigo-400 hover:text-white text-xs font-bold rounded-xl border border-indigo-500/30 transition-all active:scale-95 flex items-center gap-1.5"
                          >
                            {actionLoading === org._id + 'approve' ? <RefreshCw size={12} className="animate-spin" /> : <ArrowRight size={12} />}
                            Unblock
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── Pagination ─── */}
          {!loading && totalOrgs > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-white/5">
              {/* Showing X–Y of Z */}
              <p className="text-xs text-slate-500 font-medium order-2 sm:order-1">
                Showing{' '}
                <span className="text-white font-bold">{Math.min(pageStart + 1, totalOrgs)}</span>
                {' '}–{' '}
                <span className="text-white font-bold">{Math.min(pageEnd, totalOrgs)}</span>
                {' '}of{' '}
                <span className="text-white font-bold">{totalOrgs}</span>
                {' '}institutions
              </p>

              {/* Page Controls */}
              <div className="flex items-center gap-1.5 order-1 sm:order-2">
                {/* Prev */}
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  ← Prev
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${page === currentPage
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-slate-500 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next */}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
