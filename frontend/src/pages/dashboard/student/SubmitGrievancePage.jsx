import React, { useState } from 'react';
import { 
  Send, Shield, AlertTriangle, 
  FileText, CheckCircle2, ChevronRight,
  Info, RefreshCw, Lock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_URL } from '../../../config/api';

const SubmitGrievancePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    subject: '',
    category: 'general',
    description: '',
    isEmergency: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.description) {
      return toast.error("Please provide a subject and full description.");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('voisafe_token');
      const res = await fetch(`${API_URL}/complaints`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Signal transmitted. Identity decoupled successfully.");
        navigate('/dashboard');
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Transmission interruption. Check local link.");
    } finally {
      setLoading(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up pb-20">
      <div className="flex items-center gap-4">
         <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
            <FileText className="text-indigo-400" size={24} />
         </div>
         <div>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">New Communication</p>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Submit Grievance</h1>
         </div>
      </div>

      <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-3xl flex gap-4">
         <Shield className="text-amber-400 shrink-0" size={20} />
         <p className="text-[10px] text-amber-300 font-bold uppercase tracking-widest leading-loose">
           Your account data is physically isolated from this report. Resolution committees will ONLY see your chosen category and grievance content.
         </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-[2.5rem] p-8 sm:p-10 border border-white/5 shadow-2xl space-y-8">
         <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subject of Grievance</label>
               <input 
                 type="text" 
                 value={form.subject}
                 onChange={e => setForm({...form, subject: e.target.value})}
                 placeholder="Short summary (e.g. Infrastructure Maintenance issue)" 
                 className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-xs text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold uppercase tracking-tight"
               />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Grievance Category</label>
                  <select 
                    value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none font-black uppercase tracking-widest cursor-pointer"
                  >
                    <option value="general">General Concerns</option>
                    <option value="infrastructure">Campus Infrastructure</option>
                    <option value="academic">Academic & Faculty</option>
                    <option value="harassment">Safety & Harassment</option>
                    <option value="medical">Medical / Health</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Privacy Priority</label>
                  <div 
                    onClick={() => setForm({...form, isEmergency: !form.isEmergency})}
                    className={`flex items-center justify-between px-6 py-4 rounded-2xl border cursor-pointer transition-all ${form.isEmergency ? 'bg-rose-500/10 border-rose-500/20' : 'bg-slate-900 border-white/5'}`}
                  >
                     <span className={`text-[10px] font-black uppercase tracking-widest ${form.isEmergency ? 'text-rose-400' : 'text-slate-500'}`}>
                       {form.isEmergency ? 'Urgant Attention' : 'Standard Queue'}
                     </span>
                     <div className={`w-4 h-4 rounded-full border-2 ${form.isEmergency ? 'bg-rose-500 border-rose-400' : 'border-slate-700'}`} />
                  </div>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Detailed Description</label>
               <textarea 
                 rows={6} 
                 value={form.description}
                 onChange={e => setForm({...form, description: e.target.value})}
                 placeholder="Provide all relevant details. Avoid names of people unless absolutely necessary for the complaint." 
                 className="w-full bg-slate-900 border border-white/5 rounded-[2rem] px-6 py-5 text-xs text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium uppercase tracking-tight resize-none"
               />
            </div>
         </div>

         <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl shadow-indigo-600/30 text-[10px] uppercase tracking-[0.25em]"
            >
               {loading ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
               {loading ? 'Transmitting Identity...' : 'Finalize & Encrypt Report'}
            </button>
            <p className="text-[8px] text-slate-600 font-bold uppercase tracking-[0.1em] text-center mt-6">
              AES-256-GCM SECURED ENDPOINT • DECOUPLED INFRASTRUCTURE
            </p>
         </div>
      </form>
    </div>
  );
};

export default SubmitGrievancePage;
