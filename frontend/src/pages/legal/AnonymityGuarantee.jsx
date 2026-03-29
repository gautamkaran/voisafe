import React from 'react';
import { ShieldAlert, Fingerprint, SearchSlash, DatabaseZap, User } from 'lucide-react';

const AnonymityGuarantee = () => {
  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-slate-300">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 mb-6">
            <Fingerprint className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-6">Anonymity Guarantee</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            How we protect your voice through engineered invisibility.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all group">
              <SearchSlash className="w-10 h-10 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-2">No Tracking</h3>
              <p className="text-slate-400 text-sm">We do not track IP addresses, device IDs, or browser fingerprints for submitted grievances. Your digital footprint is erased upon submission.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all group">
              <DatabaseZap className="w-10 h-10 text-indigo-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-2">Data Decoupling</h3>
              <p className="text-slate-400 text-sm">Our database architecture physically separates your personal account from the grievance content. There is no relational link in the persistence layer.</p>
            </div>
          </div>

          <section className="pt-8 border-t border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider text-sm opacity-60">The Encryption Standard</h2>
            </div>
            <div className="space-y-6 text-slate-400 leading-relaxed">
              <p>
                Every grievance submitted via VoiSafe is encrypted using **AES-256-GCM** before it ever hits our storage. Even our system administrators cannot read the raw content of your reports without the organization's unique resolution key.
              </p>
              <div className="bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/10">
                <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Our Promise to You
                </h4>
                <p className="text-sm">
                  If an institution requests the identity of a reporter, our system is mathematically incapable of providing it. We have designed VoiSafe so that even under external pressure, the data simply doesn't exist in a linkable format.
                </p>
              </div>
            </div>
          </section>

          <footer className="pt-8 text-center">
            <p className="text-slate-500 text-sm">
              Anonymity is not a feature; it's our foundational law.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AnonymityGuarantee;
