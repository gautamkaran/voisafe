import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, LogIn, UserPlus } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    if (isMobileMenuOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`; // Prevent layout shift
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isMobileMenuOpen]);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) return null;

  const mobileMenuContent = isMobileMenuOpen && (
    <div className="md:hidden fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300 pointer-events-auto touch-none">
      {/* Background Glows for consistent premium look */}
      <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-full h-full bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Header-like top bar inside portal for Logo & Close button */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-[10000]">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">VoiSafe</span>
        </Link>
        <button 
          className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-sm relative z-[100] mt-8">
        <Link to="/" className="text-2xl font-semibold text-white tracking-tight hover:text-indigo-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
        <a href="#features" className="text-2xl font-semibold text-white tracking-tight hover:text-indigo-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
        <a href="#about" className="text-2xl font-semibold text-white tracking-tight hover:text-indigo-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</a>
        
        <div className="h-px bg-white/10 w-full my-2"></div>
        
        <Link to="/login" className="flex items-center gap-3 text-xl font-medium text-slate-200 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
          <LogIn className="w-6 h-6 text-indigo-400" />
          Sign In
        </Link>
        
        <Link to="/register" className="w-full mt-4" onClick={() => setIsMobileMenuOpen(false)}>
          <button className="w-full text-center font-bold bg-gradient-to-r from-indigo-500 to-violet-600 text-white py-4 rounded-2xl shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2 text-lg transition-all active:scale-95">
            <UserPlus className="w-6 h-6" />
            Join VoiSafe
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-in-out ${
      isScrolled 
        ? 'bg-slate-950/80 backdrop-blur-xl shadow-2xl border-b border-white/5 py-4' 
        : 'bg-transparent py-6 border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[110] w-full">
        <div className="flex justify-between items-center w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">VoiSafe</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white hover:scale-105 transition-all">Home</Link>
            <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white hover:scale-105 transition-all">Features</a>
            <a href="#about" className="text-sm font-medium text-slate-300 hover:text-white hover:scale-105 transition-all">About</a>
            
            <div className="flex items-center gap-5 ml-6">
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2">
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
              <Link to="/register">
                <button className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-6 py-2.5 rounded-full shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 hover:-translate-y-0.5 flex items-center gap-2">
                  <UserPlus className="w-4 h-4" /> Join VoiSafe
                </button>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Portal */}
      {isMobileMenuOpen && createPortal(mobileMenuContent, document.body)}
    </header>
  );
}
