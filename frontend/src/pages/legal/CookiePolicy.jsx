import React from 'react';
import { Cookie, Info, ShieldCheck, Settings } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-slate-300">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-slate-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex p-3 bg-sky-500/10 rounded-2xl border border-sky-500/20 mb-6 font-bold">
            <Cookie className="w-8 h-8 text-sky-400" />
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-6">Cookie Policy</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            We use zero tracking capsules. Only what's necessary to keep you safe.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl space-y-12">
          
          <section className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <Info className="w-6 h-6 text-sky-400" />
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider text-sm opacity-60">1. Required Cookies Only</h2>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              VoiSafe does not use third-party marketing, advertising, or tracker cookies. We exclusively use **strictly necessary** cookies required for basic platform operation and security.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
                <h4 className="text-white font-bold mb-2">Authentication</h4>
                <p className="text-sm text-slate-500">Essential for keeping you logged in securely as you navigate between reports and settings.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <Settings className="w-8 h-8 text-sky-400 mb-4" />
                <h4 className="text-white font-bold mb-2">Preferences</h4>
                <p className="text-sm text-slate-500">Minimalistic session storage to remember your role selection and UI preferences if applicable.</p>
              </div>
            </div>
          </section>

          <section className="pt-8 border-t border-white/5">
            <h2 className="text-xl font-bold text-white mb-4">Managing Your Cookies</h2>
            <p className="text-slate-400 leading-relaxed">
              Standard browsers allow you to block all cookies. While you can do this for VoiSafe, please note that you may need to re-log in frequently as we won't be able to store your session token locally.
            </p>
          </section>

          <div className="pt-8 text-center border-t border-white/5 text-slate-500 text-sm">
            <p>Your session is your own. We don't watch you.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
