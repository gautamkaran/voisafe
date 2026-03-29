import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-slate-300">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mb-6">
            <Shield className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-6">Privacy Policy</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Your privacy is our mission. At VoiSafe, we've engineered anonymity into the core of our platform.
          </p>
          <p className="text-sm text-slate-500 mt-4 italic">Last updated: March 29, 2026</p>
        </div>

        {/* Content Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl space-y-12 leading-relaxed">
          
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Lock className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">1. Data Identity Decoupling</h2>
            </div>
            <p className="mb-4">
              VoiSafe employs a proprietary 'Identity Decoupling' protocol. Unlike traditional platforms, your grievances are stored in a separate encrypted vault from your user profile. We do not link these datasets except where explicitly required for administrative follow-up, and even then, your name is never visible to the organization.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Eye className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">2. Information We Collect</h2>
            </div>
            <p className="mb-4 text-slate-400">
              When you use VoiSafe, we collect minimal information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-400">
              <li><strong className="text-slate-200">Account Information:</strong> Name, professional email (e.g., college email), and encrypted password.</li>
              <li><strong className="text-slate-200">Grievance Data:</strong> Content of your report, which is encrypted and siloed.</li>
              <li><strong className="text-slate-200">Metadata:</strong> Time of submission (obfuscated by +/- 15 minutes for trace prevention).</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">3. How We Use Your Data</h2>
            </div>
            <p className="text-slate-400">
              Your data is used exclusively to facilitate true conflict resolution. Organizations use the anonymized grievance data to improve workplace or educational conditions. We never sell, share, or monetize your data with third parties.
            </p>
          </section>

          <div className="pt-8 border-t border-white/5">
            <h3 className="text-lg font-bold text-white mb-2">Questions or Concerns?</h3>
            <p className="text-slate-400">
              If you have any questions about this Privacy Policy, please contact our transparency team at <span className="text-indigo-400">privacy@voisafe.com</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
