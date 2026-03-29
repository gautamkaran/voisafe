import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  User,
  Settings,
  LogOut,
  Bell,
  Shield,
  Menu,
  X,
  Users,
  BarChart3,
  Search,
  ChevronRight,
  Building2
} from 'lucide-react';
import { toast } from 'react-toastify';

const DashboardShell = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('voisafe_user') || 'null');

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem('voisafe_token');
    localStorage.removeItem('voisafe_user');
    toast.success("Successfully logged out. Stay safe!");
    navigate('/login', { replace: true });
  };

  const navigationByRole = {
    student: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { name: 'My Grievances', icon: MessageSquare, path: '/dashboard/grievances' },
      { name: 'New Complaint', icon: PlusCircle, path: '/dashboard/submit' },
      { name: 'Profile', icon: User, path: '/dashboard/profile' },
    ],
    committee: [
      { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
      { name: 'Reviews', icon: MessageSquare, path: '/dashboard/reviews' },
      { name: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
      { name: 'Profile', icon: User, path: '/dashboard/profile' },
    ],
    admin: [
      { name: 'Summary', icon: LayoutDashboard, path: '/dashboard' },
      { name: 'Manage Teams', icon: Users, path: '/dashboard/committees' },
      { name: 'Reports', icon: BarChart3, path: '/dashboard/reports' },
      { name: 'Organization', icon: Settings, path: '/dashboard/settings' },
      { name: 'Profile', icon: User, path: '/dashboard/profile' },
    ],
    superadmin: [
      { name: 'Command Center', icon: LayoutDashboard, path: '/dashboard' },
      { name: 'All Institutions', icon: Shield, path: '/dashboard/institutions' },
      { name: 'Onboard Institution', icon: Building2, path: '/dashboard/create-org' },
      { name: 'Global Analytics', icon: BarChart3, path: '/dashboard/analytics' },
      { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
      { name: 'Profile', icon: User, path: '/dashboard/profile' },
    ]
  };

  const menuItems = navigationByRole[user.role] || [];

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      {/* --- Desktop Sidebar --- */}
      <aside className={`
        ${isSidebarOpen ? 'w-72' : 'w-20'} 
        hidden lg:flex flex-col bg-slate-900 border-r border-white/5 transition-all duration-300 relative z-30 h-screen shrink-0
      `}>
        <div className="p-6 h-20 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center w-full'}`}>
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {isSidebarOpen && <span className="text-xl font-bold tracking-tight text-white uppercase tracking-wider">VoiSafe</span>}
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              title={!isSidebarOpen ? item.name : ''}
              className={`
                flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all group
                ${location.pathname === item.path
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${location.pathname === item.path ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
              {isSidebarOpen && <span className="truncate">{item.name}</span>}
              {isSidebarOpen && location.pathname === item.path && <ChevronRight size={14} className="ml-auto opacity-50" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl font-medium text-rose-400 hover:bg-rose-500/10 transition-colors ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* --- Mobile Sidebar (Drawer) --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar Panel */}
          <div className="relative w-80 max-w-[85vw] bg-slate-900 h-full flex flex-col shadow-2xl border-r border-white/5 animate-slide-in-right">
            <div className="p-6 h-20 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white uppercase tracking-wider leading-none">VoiSafe</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
              <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Navigation Menu</p>
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                      flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all
                      ${location.pathname === item.path
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                    `}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            <div className="p-6 border-t border-white/5 space-y-4">
              <div className="flex items-center gap-3 px-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white overflow-hidden border border-white/5">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl font-bold text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Background Decor */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Topbar — sticky */}
        <header className="sticky top-0 h-20 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-20 shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Desktop Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-lg lg:flex hidden transition-all hover:bg-white/10"
              aria-label="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-lg lg:hidden transition-all active:scale-95"
              aria-label="Open Menu"
            >
              <Menu size={20} />
            </button>

            <div className="flex flex-col">
              <h2 className="text-xs sm:text-sm font-black text-indigo-400 uppercase tracking-[0.15em] leading-none mb-1">
                {user.role} Terminal
              </h2>
              <div className="h-1 w-8 bg-indigo-500 hidden sm:block rounded-full opacity-50" />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            {/* Desktop Search */}
            <div className="hidden md:flex items-center bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2.5 w-48 lg:w-64 group focus-within:ring-2 focus-within:ring-indigo-500/30 transition-all">
              <Search size={16} className="text-slate-500 group-focus-within:text-indigo-400" />
              <input
                type="text"
                placeholder="Quick search..."
                className="bg-transparent border-none text-sm text-white focus:outline-none ml-2 w-full placeholder:text-slate-600"
              />
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button className="p-2 sm:p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl relative transition-all active:scale-95">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-900" />
              </button>

              <div className="h-8 w-[1px] bg-white/5 mx-1 hidden sm:block" />

              <div className="flex items-center gap-3 pl-1 sm:pl-2">
                <div className="text-right hidden sm:block max-w-[120px]">
                  <p className="text-sm font-bold text-white truncate capitalize">{user.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate opacity-70">{user.email}</p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg ring-2 ring-white/5 group-hover:ring-indigo-500/50 transition-all cursor-pointer">
                  {user.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 relative z-10 custom-scrollbar scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
