import React from 'react';
import { Gavel, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-slate-300">
      {/* Background Decor */}
      <div className="absolute top-[-5%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 mb-6 font-bold">
            <Gavel className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-6">Terms of Service</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Simplified terms for a better and fairer VoiSafe experience.
          </p>
          <p className="text-sm text-slate-500 mt-4 italic">Effective Date: March 29, 2026</p>
        </div>

        {/* Content Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl space-y-12 leading-relaxed">
          
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider text-sm opacity-60">1. Acceptance of Terms</h2>
            </div>
            <p className="mb-4 text-lg">
              By accessing or using VoiSafe, you agree to be bound by these Terms of Service. If you do not agree, you must immediately terminate use of the platform.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <UserCheck className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider text-sm opacity-60">2. Responsible Reporting</h2>
            </div>
            <p className="mb-4 text-slate-400">
              VoiSafe is built on trust and the pursuit of constructive resolution. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-400">
              <li><strong className="text-slate-200">Submit Honest Data:</strong> We prohibit malicious or knowingly false grievances. False reports diminish the platform's integrity.</li>
              <li><strong className="text-slate-200">Respect Other Users:</strong> Harassment of administrators or other students via the platform is not tolerated.</li>
              <li><strong className="text-slate-200">Maintain Confidentiality:</strong> Do not use VoiSafe to leak sensitive, protected institutional trade secrets or data unrelated to personal or group grievances.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider text-sm opacity-60">3. Platform Misuse</h2>
            </div>
            <p className="text-slate-400">
              Attempts to reverse-engineer VoiSafe's anonymity protocols or exploit system vulnerabilities will result in immediate account termination and, where applicable, legal action. Our security is paramount.
            </p>
          </section>

          <div className="pt-8 border-t border-white/5 flex flex-col items-center">
            <p className="text-slate-500 text-sm mb-4">
              Need assistance with our terms?
            </p>
            <button className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all shadow-lg font-bold">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
