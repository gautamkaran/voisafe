import React, { useState, useEffect, useCallback } from 'react';
import { 
  Inbox, Search, Filter, Clock, 
  CheckCircle2, XCircle, ChevronRight, 
  MessageSquare, AlertCircle, FileText, 
  MoreHorizontal, RefreshCw, Send, Shield
} from 'lucide-react';
import { toast } from 'react-toastify';
import { API_URL } from '../../../config/api';

const StatusBadge = ({ status }) => {
  const styles = {
    'pending': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'in-progress': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    'resolved': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'rejected': 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };
  return (
    <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
      {status}
    </span>
  );
};

const GrievanceChat = ({ complaintId }) => {
  const [msgs, setMsgs] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = React.useRef(null);
  const user = JSON.parse(localStorage.getItem('voisafe_user') || '{}');

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMsgs = useCallback(async () => {
    try {
      const token = localStorage.getItem('voisafe_token');
      const res = await fetch(`${API_URL}/chat/${complaintId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMsgs(data.data);
      }
    } catch { /* Silent */ }
  }, [complaintId]);

  useEffect(() => {
    fetchMsgs();
    const timer = setInterval(fetchMsgs, 5000);
    return () => clearInterval(timer);
  }, [fetchMsgs]);

  useEffect(() => {
    scrollToBottom();
  }, [msgs]);

  const onSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || loading) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('voisafe_token');
      const res = await fetch(`${API_URL}/chat/${complaintId}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: newMsg })
      });
      const data = await res.json();
      if (data.success) {
        setNewMsg('');
        fetchMsgs();
      }
    } catch {
      toast.error("Signal lost.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 rounded-3xl border border-white/5 flex flex-col h-[350px]">
       <div className="p-4 border-b border-white/5 bg-white/[0.02] rounded-t-3xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secure Link to Committee Resolver</p>
       </div>
       <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {msgs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 gap-2">
               <MessageSquare size={32} />
               <p className="text-[10px] font-bold uppercase tracking-widest">No signals detected</p>
            </div>
          ) : (
            msgs.map((m, i) => (
              <div key={i} className={`flex ${m.senderRole === user.role ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs font-medium ${
                  m.senderRole === user.role 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/10' 
                    : 'bg-slate-800 text-slate-300 rounded-tl-none border border-white/5'
                }`}>
                   <p>{m.message}</p>
                   <p className="text-[8px] opacity-40 mt-1 uppercase tracking-tighter text-right">
                     {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </p>
                </div>
              </div>
            ))
          )}
          <div ref={scrollRef} />
       </div>
       <form onSubmit={onSend} className="p-3 border-t border-white/5 bg-white/[0.01] rounded-b-3xl">
          <div className="relative">
             <input 
               type="text" 
               value={newMsg}
               onChange={e => setNewMsg(e.target.value)}
               placeholder="Write an anonymous message..." 
               className="w-full bg-slate-800/80 border border-white/5 rounded-2xl px-5 py-3.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold uppercase tracking-tight"
             />
             <button type="submit" disabled={loading} className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50 shadow-inner">
               <Send size={14} />
             </button>
          </div>
       </form>
    </div>
  );
};

const MyGrievancesPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('voisafe_token');
      const res = await fetch(`${API_URL}/complaints/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setComplaints(data.data);
    } catch {
      toast.error("Failed to sync my grievances.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const filtered = complaints.filter(c => {
    const matchSearch = String(c.title || '').toLowerCase().includes(search.toLowerCase()) || 
                        String(c.description || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Authenticated Terminal</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">Grievance Registry</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search Signals..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-6 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-full sm:w-64 transition-all placeholder:text-slate-700 font-bold uppercase tracking-widest"
            />
          </div>
          
          <select 
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="bg-slate-900 border border-white/5 rounded-2xl px-6 py-3 text-[10px] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer font-black uppercase tracking-[0.15em] transition-all hover:bg-slate-800"
          >
            <option value="all">Any Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">Processing</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      {!loading && complaints.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
           {[
             { label: 'Total', count: complaints.length, color: 'text-indigo-400' },
             { label: 'Active', count: complaints.filter(c => c.status !== 'resolved').length, color: 'text-amber-400' },
             { label: 'Resolved', count: complaints.filter(c => c.status === 'resolved').length, color: 'text-emerald-400' },
             { label: 'Priority', count: complaints.filter(c => c.priority === 'high').length, color: 'text-rose-400' },
           ].map(s => (
             <div key={s.label} className="glass-card rounded-2xl p-4 border border-white/5 text-center">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-xl font-black ${s.color}`}>{s.count}</p>
             </div>
           ))}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
           <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin opacity-20" />
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Synchronizing Shards...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-[3rem] p-20 text-center border-dashed border-2 border-white/5 animate-fade-in">
           <Shield className="w-20 h-20 text-slate-800/50 mx-auto mb-8 animate-pulse" />
           <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">Null Registry</h3>
           <p className="text-slate-500 text-sm max-w-xs mx-auto font-medium leading-relaxed mb-10">No signals matching your search criteria were detected in the secure database.</p>
           <button 
             onClick={() => { setSearch(''); setFilter('all'); }}
             className="text-xs font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors border-b border-indigo-400/20 pb-1"
           >
             Clear Selection Parameters
           </button>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {filtered.map((c, idx) => (
            <div 
              key={c._id} 
              onClick={() => { setSelected(c); setShowChat(false); }}
              style={{ animationDelay: `${idx * 50}ms` }}
              className="glass-card rounded-[2.5rem] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group cursor-pointer hover:scale-[1.01] hover:border-indigo-500/40 transition-all border border-white/5 shadow-2xl relative overflow-hidden animate-fade-in-up"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
              
              <div className="flex items-center gap-6 relative z-10">
                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  c.status === 'pending' ? 'bg-amber-500/10' : 
                  c.status === 'resolved' ? 'bg-emerald-500/10' : 
                  'bg-indigo-500/10'
                }`}>
                  <AlertCircle size={24} className={
                    c.status === 'pending' ? 'text-amber-400' : 
                    c.status === 'resolved' ? 'text-emerald-400' : 
                    'text-indigo-400'
                  } />
                </div>
                <div>
                   <div className="flex items-center gap-3 mb-1.5">
                      <p className="text-[10px] text-slate-500 font-bold font-mono tracking-tighter">ID: #{c._id.slice(-6).toUpperCase()}</p>
                      {c.priority === 'high' && (
                        <span className="flex items-center gap-1 text-[8px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest border border-rose-500/20">
                          <Shield size={8} /> Priority Alpha
                        </span>
                      )}
                   </div>
                   <h4 className="font-black text-white text-lg sm:text-xl group-hover:text-indigo-400 transition-colors uppercase tracking-tight leading-none mb-2">{c.title}</h4>
                   <div className="flex items-center gap-3">
                      <StatusBadge status={c.status} />
                      <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.15em]">{c.category}</span>
                   </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:justify-end gap-8 relative z-10 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                 <div className="text-left md:text-right">
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1 items-center flex gap-1.5 justify-end">
                       Dispatched <Clock size={10} />
                    </p>
                    <p className="text-xs text-slate-400 font-bold">{new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                 </div>
                 <div className="flex items-center gap-3">
                    {c.status === 'in-progress' && (
                       <div className="flex gap-1">
                          {[1, 2, 3].map(i => (
                             <div key={i} className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                          ))}
                       </div>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelected(c); setShowChat(true); }}
                      className="p-3 bg-indigo-500/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-2xl transition-all shadow-inner group/msg"
                    >
                       <MessageSquare size={18} className="group-hover/msg:scale-110 transition-transform" />
                    </button>
                    <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-indigo-600 transition-all group-hover:translate-x-1 shadow-inner">
                       <ChevronRight className="text-slate-500 group-hover:text-white" size={20} />
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8 bg-slate-950/90 backdrop-blur-xl animate-fade-in py-12 scrollbar-hide">
          <div className="glass-card w-full max-w-2xl rounded-[3rem] p-8 sm:p-10 shadow-2xl border border-white/10 animate-fade-in-up relative overflow-hidden flex flex-col shrink-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-10 relative z-10 font-bold shrink-0">
              <div className="flex-1 min-w-0">
                 <p className="text-[9px] text-indigo-400 uppercase tracking-[0.5em] mb-2 font-black opacity-70">Captured Signal #{selected._id.slice(-8).toUpperCase()}</p>
                 <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-none truncate">{selected.title}</h2>
              </div>
              <button 
                onClick={() => setSelected(null)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-500 hover:text-white transition-all shadow-inner ml-6 shrink-0 border border-white/5"
              >
                <XCircle size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col pt-4 relative z-10 font-bold pb-4 h-[450px]">
               <GrievanceChat complaintId={selected._id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGrievancesPage;
