import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  MessageSquare, 
  RefreshCw, 
  Shield, 
  AlertCircle, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  XCircle,
  FileText,
  Filter,
  Send
} from 'lucide-react';
import { toast } from 'react-toastify';
import { API_URL } from '../../../config/api';

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'in-progress': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    resolved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
  };
  return (
    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${styles[status] || styles.pending}`}>
      {status === 'in-progress' ? 'Processing' : status}
    </span>
  );
};

const ResolutionChat = ({ complaintId }) => {
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
      if (data.success) setMsgs(data.data);
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
    <div className="bg-slate-900/60 rounded-3xl border border-white/5 flex flex-col h-[400px]">
       <div className="p-4 border-b border-white/5 bg-white/[0.02] rounded-t-3xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secure Anonymous Link</p>
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
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/40' 
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
               className="w-full bg-slate-800/80 border border-white/5 rounded-2xl pl-5 pr-12 py-3.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
             />
             <button type="submit" disabled={loading} className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50">
               <Send size={14} />
             </button>
          </div>
       </form>
    </div>
  );
};

const ResolutionQueuePage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [showChat, setShowChat] = useState(false); // Toggle chat

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('voisafe_token');
      const res = await fetch(`${API_URL}/complaints/org`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setComplaints(data.data);
    } catch {
      toast.error("Failed to sync resolution queue.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const updateStatus = async (id, status) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('voisafe_token');
      const res = await fetch(`${API_URL}/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, remarks })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Identity status moved to ${status}.`);
        setSelected(data.data);
        fetchComplaints();
      }
    } catch {
      toast.error("Status injection failure.");
    } finally {
      setUpdating(false);
    }
  };

  const filtered = complaints.filter(c => {
    const matchSearch = String(c.title || '').toLowerCase().includes(search.toLowerCase()) || 
                        String(c.description || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Committee Terminal</p>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Resolution Queue</h1>
        </div>
        <div className="flex gap-2 font-black">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input 
                type="text" 
                placeholder="Search cases..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-slate-900 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 w-48 transition-all uppercase tracking-widest"
              />
           </div>
           <select 
             value={filter}
             onChange={e => setFilter(e.target.value)}
             className="bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 appearance-none cursor-pointer uppercase tracking-widest"
           >
             <option value="all">ANY STATUS</option>
             <option value="pending">PENDING</option>
             <option value="in-progress">PROCESSING</option>
             <option value="resolved">RESOLVED</option>
           </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
           <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin opacity-20" />
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Synchronizing Data Shards...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="glass-card rounded-[2.5rem] p-20 text-center border-dashed border-2 border-white/5">
           <Shield className="w-16 h-16 text-slate-700 mx-auto mb-6" />
           <h3 className="text-xl font-bold text-white mb-2">Queue Zero</h3>
           <p className="text-slate-500 text-sm">No institutional grievances currently require resolution authority.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(c => (
            <div 
              key={c._id} 
              onClick={() => { setSelected(c); setRemarks(c.remarks || ''); setShowChat(false); }}
              className="glass-card rounded-[2rem] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer hover:border-indigo-500/30 transition-all border border-white/5 shadow-xl"
            >
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  c.status === 'pending' ? 'bg-amber-500/10' : 
                  c.status === 'resolved' ? 'bg-emerald-500/10' : 
                  'bg-indigo-500/10'
                }`}>
                  <AlertCircle size={20} className={
                    c.status === 'pending' ? 'text-amber-400' : 
                    c.status === 'resolved' ? 'text-emerald-400' : 
                    'text-indigo-400'
                  } />
                </div>
                <div>
                   <h4 className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{c.title}</h4>
                   <div className="flex items-center gap-3 mt-1.5">
                      <StatusBadge status={c.status} />
                      <span className="text-[10px] text-slate-600 uppercase tracking-widest">{c.category}</span>
                   </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Dispatched</p>
                    <p className="text-xs text-slate-400 font-medium">{new Date(c.createdAt).toLocaleDateString()}</p>
                 </div>
                 <ChevronRight className="text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all" size={20} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Case Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto pt-10 pb-10">
          <div className="glass-card w-full max-w-2xl rounded-[3rem] p-8 sm:p-10 shadow-2xl border border-white/10 animate-fade-in-up relative overflow-hidden h-fit mb-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-8 relative z-10 font-bold">
              <div>
                 <p className="text-[10px] text-indigo-400 uppercase tracking-[0.25em] mb-1">Signal ID: #{selected._id.slice(-8).toUpperCase()}</p>
                 <h2 className="text-2xl font-black text-white uppercase tracking-tight">{selected.title}</h2>
              </div>
              <button 
                onClick={() => setSelected(null)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-500 hover:text-white transition-all shadow-inner"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-6 relative z-10 font-bold">
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-800/40 p-4 rounded-3xl border border-white/5">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1.5 items-center flex gap-1.5"><Filter size={10}/> Priority</p>
                    <p className="text-xs text-white uppercase">{selected.isEmergency ? 'Critical Identity' : 'Standard Case'}</p>
                 </div>
                 <div className="bg-slate-800/40 p-4 rounded-3xl border border-white/5">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1.5 items-center flex gap-1.5"><Clock size={10}/> Timestamp</p>
                    <p className="text-xs text-white uppercase">{new Date(selected.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                 </div>
              </div>

              {/* Toggle Chat Tab */}
              <div className="flex gap-2 p-1.5 bg-slate-950/50 rounded-2xl border border-white/5">
                 <button 
                   onClick={() => setShowChat(false)}
                   className={`flex-1 py-3 px-4 rounded-xl text-[10px] uppercase tracking-[0.2em] font-black transition-all ${!showChat ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                 >
                   Details Audit
                 </button>
                 <button 
                   onClick={() => setShowChat(true)}
                   className={`flex-1 py-3 px-4 rounded-xl text-[10px] uppercase tracking-[0.2em] font-black transition-all flex items-center justify-center gap-2 ${showChat ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                 >
                   <MessageSquare size={14} /> Anonymous Link
                 </button>
              </div>

              {!showChat ? (
                <>
                  <div className="bg-slate-800/20 p-6 rounded-[2rem] border border-white/5 space-y-3">
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1.5"><FileText size={12}/> Captured Signal</p>
                     <p className="text-xs text-slate-300 leading-relaxed font-medium uppercase tracking-tight">{selected.description}</p>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Resolution Protocol Remarks</label>
                     <textarea 
                       rows={3} 
                       value={remarks}
                       onChange={e => setRemarks(e.target.value)}
                       disabled={selected.status === 'resolved'}
                       placeholder="Enter terminal response notes..." 
                       className="w-full bg-slate-900 border border-white/5 rounded-3xl px-6 py-4 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all placeholder:text-slate-800 font-bold uppercase tracking-tight"
                     />
                  </div>

                  {selected.status !== 'resolved' && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button 
                        onClick={() => updateStatus(selected._id, 'resolved')}
                        disabled={updating}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-emerald-500/20 text-[10px] uppercase tracking-[0.25em]"
                      >
                        <CheckCircle2 size={16} /> Resolve Identity
                      </button>
                      <button 
                        onClick={() => updateStatus(selected._id, 'in-progress')}
                        disabled={updating}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 text-[10px] uppercase tracking-[0.25em] border border-white/5 shadow-inner"
                      >
                        <Clock size={16} /> Mark Processing
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <ResolutionChat complaintId={selected._id} />
              )}

              {selected.status === 'resolved' && !showChat && (
                <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-[2rem] flex items-start gap-4">
                   <div className="p-2 bg-emerald-500/10 rounded-xl">
                      <CheckCircle2 size={24} className="text-emerald-500" />
                   </div>
                   <div>
                      <h5 className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-1.5">Authority Logged Success</h5>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase">This case has been definitively resolved. The remarks below are published to the messenger's terminal.</p>
                      <div className="mt-4 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/10 italic text-slate-300 text-xs font-medium uppercase tracking-tighter">
                        "{selected.remarks}"
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResolutionQueuePage;
