import React, { useState, useEffect, useCallback } from "react";
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  Mail,
  Info,
  Globe,
  Shield,
} from "lucide-react";
import { toast } from "react-toastify";
import { API_ADMIN_URL } from "../../../config/api";

const API_BASE = API_ADMIN_URL;

const StatusBadge = ({ status }) => {
  const map = {
    active: {
      icon: CheckCircle2,
      label: "Approved",
      cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    },
    pending: {
      icon: Clock,
      label: "Pending",
      cls: "text-amber-400  bg-amber-400/10  border-amber-400/20",
    },
    rejected: {
      icon: XCircle,
      label: "Blocked",
      cls: "text-rose-400   bg-rose-400/10   border-rose-400/20",
    },
  };
  const cfg = map[status] || map.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${cfg.cls}`}
    >
      <cfg.icon size={11} />
      {cfg.label}
    </span>
  );
};

const AllInstitutionsPage = () => {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | active | pending | rejected
  const [actionLoading, setActionLoading] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;

  const fetchOrgs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/organizations`);
      const json = await res.json();
      if (json.success) setOrgs(json.data);
    } catch {
      toast.error("Failed to load institutions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrgs();
  }, [fetchOrgs]);
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, orgs.length]);

  const handleAction = async (id, action) => {
    setActionLoading(id + action);
    try {
      const res = await fetch(`${API_BASE}/organizations/${id}/${action}`, {
        method: "PATCH",
      });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message);
        setOrgs((prev) => prev.map((o) => (o._id === id ? json.data : o)));
      } else {
        toast.error(json.message);
      }
    } catch {
      toast.error("Network error");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered =
    filter === "all" ? orgs : orgs.filter((o) => o.status === filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paged = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const tabs = [
    { key: "all", label: "All", count: orgs.length },
    {
      key: "pending",
      label: "Pending",
      count: orgs.filter((o) => o.status === "pending").length,
    },
    {
      key: "active",
      label: "Active",
      count: orgs.filter((o) => o.status === "active").length,
    },
    {
      key: "rejected",
      label: "Blocked",
      count: orgs.filter((o) => o.status === "rejected").length,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">
            Super Admin
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            All Institutions
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Browse, filter and manage every registered institution on VoiSafe.
          </p>
        </div>
        <button
          onClick={fetchOrgs}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-sm font-bold transition-all"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              filter === tab.key
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {tab.label}
            <span
              className={`${filter === tab.key ? "bg-white/20" : "bg-white/5"} px-1.5 py-0.5 rounded-md text-[10px]`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
        {/* Header Row */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          <div className="col-span-4">Institution</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-3">Domain</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-500">Loading institutions...</p>
          </div>
        ) : paged.length === 0 ? (
          <div className="py-20 text-center">
            <Building2 className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">
              No institutions found for this filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {paged.map((org) => (
              <div
                key={org._id}
                className="flex flex-col md:grid md:grid-cols-12 gap-3 sm:gap-4 px-6 py-5 hover:bg-white/[0.02] group transition-colors"
              >
                <div className="col-span-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/10 shrink-0">
                    <Building2 className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white text-sm truncate group-hover:text-indigo-300 transition-colors">
                      {org.name}
                    </p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 truncate">
                      <Mail size={10} /> {org.contactEmail}
                    </p>
                  </div>
                </div>
                <div className="col-span-2 hidden md:flex md:items-center">
                  <span className="text-xs text-slate-400 font-medium uppercase">
                    {org.typeOfOrg || "College"}
                  </span>
                </div>
                <div className="col-span-3 hidden md:flex md:items-center">
                  <span className="text-xs text-slate-500 font-mono truncate">
                    {org.domain}
                  </span>
                </div>
                <div className="col-span-1 hidden md:flex md:items-center">
                  <StatusBadge status={org.status} />
                </div>
                <div className="col-span-2 flex items-center gap-2 md:justify-end flex-wrap">
                  {org.status === "pending" && (
                    <button
                      onClick={() => handleAction(org._id, "approve")}
                      disabled={!!actionLoading}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center gap-1"
                    >
                      <CheckCircle2 size={12} /> Approve
                    </button>
                  )}
                  {org.status === "active" && (
                    <button
                      onClick={() => handleAction(org._id, "block")}
                      disabled={!!actionLoading}
                      className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 disabled:opacity-50 text-rose-400 hover:text-white text-xs font-bold rounded-xl border border-rose-500/30 transition-all active:scale-95 flex items-center gap-1"
                    >
                      <XCircle size={12} /> Block
                    </button>
                  )}
                  {org.status === "rejected" && (
                    <button
                      onClick={() => handleAction(org._id, "approve")}
                      disabled={!!actionLoading}
                      className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 disabled:opacity-50 text-indigo-400 hover:text-white text-xs font-bold rounded-xl border border-indigo-500/30 transition-all active:scale-95 flex items-center gap-1"
                    >
                      <ArrowRight size={12} /> Unblock
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-white/5">
            <p className="text-xs text-slate-500 font-medium">
              Showing{" "}
              <span className="text-white font-bold">
                {Math.min(pageStart + 1, filtered.length)}
              </span>
              –
              <span className="text-white font-bold">
                {Math.min(pageStart + PAGE_SIZE, filtered.length)}
              </span>{" "}
              of <span className="text-white font-bold">{filtered.length}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${page === currentPage ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-white hover:bg-white/10"}`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
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
  );
};

export default AllInstitutionsPage;
