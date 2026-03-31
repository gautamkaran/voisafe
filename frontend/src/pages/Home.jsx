import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  MessageSquare,
  Lock,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Zap,
  Users,
  Award,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // If token exists, auto redirect
    const token = localStorage.getItem("voisafe_token");
    if (token) {
      // Basic check, you'd likely fetch the user's role to determine their exact dashboard
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden text-slate-100">
      {/* Abstract Animated Background Elements - Consistent with Auth Pages */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse-slow mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-violet-600/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none opacity-60" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-5xl mx-auto text-center animate-fade-in-up">
          <div className="inline-block mb-8 origin-bottom">
            <div className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-lg flex items-center gap-2 text-sm font-semibold text-indigo-400">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              Trusted by 150+ leading educational institutions
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Speak Up
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-violet-400 to-purple-400">
              Safely & Securely
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
            The next-generation anonymous grievance platform for students.
            Report issues without fear. Your identity remains perfectly
            protected.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link to="/register">
              <button className="inline-flex items-center justify-center font-bold h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 transition-all hover:-translate-y-1 gap-2 rounded-2xl w-full sm:w-auto">
                Submit Complaint
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link to="/login">
              <button className="inline-flex items-center justify-center font-bold h-14 px-8 text-lg border-2 border-slate-700/50 hover:border-slate-600 text-slate-200 bg-slate-900/40 backdrop-blur-sm transition-all hover:-translate-y-1 rounded-2xl w-full sm:w-auto">
                Track Status
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Standard Grid */}
      <section
        id="features"
        className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 bg-slate-950/20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Architecture of Trust
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
              We've engineered every layer to ensure absolute anonymity and
              security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group glass-card rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 border border-white/5 shadow-xl">
              <div className="mb-6 inline-flex p-4 bg-indigo-500/10 rounded-2xl">
                <Lock className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Identity Decoupling
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Our protocol physically separates your personal profile from
                your grievances. Mathematically unlinkable.
              </p>
            </div>

            <div className="group glass-card rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 border border-white/5 shadow-xl">
              <div className="mb-6 inline-flex p-4 bg-indigo-500/10 rounded-2xl">
                <MessageSquare className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Anonymous Chat
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Direct, encrypted communication with committees without ever
                revealing who you are.
              </p>
            </div>

            <div className="group glass-card rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 border border-white/5 shadow-xl">
              <div className="mb-6 inline-flex p-4 bg-indigo-500/10 rounded-2xl">
                <Shield className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                AES-256 Encryption
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Military-grade encryption protects your voice at rest and in
                transit. Your data remains perfectly safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Simple Split */}
      <section
        id="about"
        className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-xs uppercase tracking-widest">
              Our Mission
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white leading-[1.1]">
              Democratizing <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-violet-400 font-extrabold uppercase">
                Trust
              </span>
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed font-medium">
              VoiSafe was born to protect the voices that matter most. We
              believe institutional fairness is impossible without absolute,
              guaranteed anonymity.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-white/5 mt-8">
              <div>
                <div className="text-4xl font-bold text-white mb-1">100%</div>
                <div className="text-slate-500 text-sm font-semibold uppercase tracking-wider">
                  Anonymous
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">Zero</div>
                <div className="text-slate-500 text-sm font-semibold uppercase tracking-wider">
                  Identity Leaks
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-linear-to-tr from-indigo-500 to-violet-600 rounded-[3rem] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
            <div className="relative glass-card rounded-[3rem] p-12 aspect-4/3 flex flex-col justify-center items-center text-center shadow-2xl border border-white/10 shrink-0">
              <Shield className="w-24 h-24 text-indigo-400 mb-8 animate-float" />
              <h3 className="text-3xl font-bold text-white mb-4">
                The VoiSafe Promise
              </h3>
              <p className="text-slate-400 max-w-sm">
                Every voice is protected through engineered invisibility. We
                empower the messenger by erasing the identity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Benefits Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 border-t border-slate-800/50 bg-slate-950/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div
              className="space-y-6 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-start gap-5 p-6 rounded-2xl bg-slate-900/60 shadow-xl border border-white/5 transition-transform hover:scale-[1.02]">
                <div className="p-3 bg-indigo-500/20 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    Protected Privacy
                  </h4>
                  <p className="text-slate-400">
                    Advanced identity decoupling architecture guarantees your
                    personal information is isolated.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-6 rounded-2xl bg-slate-900/60 shadow-xl border border-white/5 transition-transform hover:scale-[1.02]">
                <div className="p-3 bg-violet-500/20 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    Live Progress Tracking
                  </h4>
                  <p className="text-slate-400">
                    Monitor your complaint's journey in real-time with
                    comprehensive status updates.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-6 rounded-2xl bg-slate-900/60 shadow-xl border border-white/5 transition-transform hover:scale-[1.02]">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    Multi-Committee Support
                  </h4>
                  <p className="text-slate-400">
                    Smart routing ensures your grievance reaches the appropriate
                    designated authorities.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="space-y-8 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Built for Institutions, <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400 font-extrabold uppercase tracking-tight">
                  Designed for Students.
                </span>
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed">
                Experience a platform where cutting-edge technology meets
                empathetic design. VoiSafe empowers you to drive change
                securely.
              </p>

              <ul className="space-y-4">
                {[
                  "Multi-tenant architecture for scale",
                  "Granular role-based access control",
                  "Instant WebSocket notifications",
                  "Comprehensive compliance reporting",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-indigo-500 shrink-0" />
                    <span className="text-lg text-slate-300 font-medium">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to="/register" className="inline-block mt-4">
                <button className="inline-flex items-center justify-center font-bold h-14 px-8 text-lg bg-white text-slate-950 hover:bg-slate-200 transition-all rounded-2xl group">
                  Discover More
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 z-10 w-full flex justify-center">
        <div className="w-full max-w-6xl rounded-[3rem] overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 bg-linear-to-r from-indigo-600 via-indigo-700 to-purple-800" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />

          <div className="relative p-12 md:p-24 text-center text-white">
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              Ready to Claim <br />
              Your Voice?
            </h2>
            <p className="text-xl md:text-2xl text-indigo-100/80 mb-12 max-w-3xl mx-auto font-medium">
              Join thousands of students who have already safe-guarded their
              future. Submit your first anonymous grievance in under 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/register">
                <button className="inline-flex items-center justify-center font-bold h-16 px-10 text-xl bg-white text-indigo-700 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto rounded-2xl shadow-2xl shadow-black/40">
                  Submit First Grievance
                </button>
              </Link>
              <Link to="/login">
                <button className="inline-flex items-center justify-center font-bold h-16 px-10 text-xl border-2 border-white/20 hover:border-white/50 hover:bg-white/10 text-white transition-all hover:scale-105 active:scale-95 w-full sm:w-auto rounded-2xl">
                  Sign In to Tracker
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
