import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) return null;

  return (
    <footer className="bg-slate-950 border-t border-white/5 text-slate-300 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
        {/* Brand Section */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              VoiSafe
            </span>
          </Link>
          <p className="text-slate-400 leading-relaxed text-sm">
            Empowering students with a perfectly secure, absolutely anonymous platform to voice concerns and drive positive change within educational ecosystems.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="p-2 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors duration-300">
              <FaTwitter className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors duration-300">
              <FaFacebook className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors duration-300">
              <FaInstagram className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors duration-300">
              <FaLinkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6">Explore</h3>
          <ul className="space-y-4">
            <li>
              <Link to="/" className="text-sm hover:text-indigo-400 transition-colors duration-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Home
              </Link>
            </li>
            <li>
              <a href="#features" className="text-sm hover:text-indigo-400 transition-colors duration-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> Features
              </a>
            </li>
            <li>
              <Link to="/login" className="text-sm hover:text-indigo-400 transition-colors duration-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> Track Status
              </Link>
            </li>
            <li>
              <Link to="/register" className="text-sm hover:text-indigo-400 transition-colors duration-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> Submit Complaint
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Policies */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6">Legal</h3>
          <ul className="space-y-4">
            <li>
              <Link to="/privacy" className="text-sm hover:text-indigo-400 transition-colors duration-300 inline-block">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms" className="text-sm hover:text-indigo-400 transition-colors duration-300 inline-block">Terms of Service</Link>
            </li>
            <li>
              <Link to="/anonymity" className="text-sm hover:text-indigo-400 transition-colors duration-300 inline-block">Anonymity Guarantee</Link>
            </li>
            <li>
              <Link to="/cookies" className="text-sm hover:text-indigo-400 transition-colors duration-300 inline-block">Cookie Policy</Link>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6">Get in Touch</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <span>123 Innovation Drive,<br />Tech Park, NY 10001</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-indigo-400 shrink-0" />
              <span>+1 (555) 123-4567</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
              <span>support@voisafe.org</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 text-sm text-center text-slate-500 relative z-10">
        <p>&copy; {new Date().getFullYear()} VoiSafe Initiative. All rights reserved. Built for secure communication.</p>
      </div>
    </footer>
  );
}
