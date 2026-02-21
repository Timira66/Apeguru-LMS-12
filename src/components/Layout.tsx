import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Video, 
  FileText, 
  Users, 
  Bell, 
  Search, 
  LogOut, 
  User as UserIcon,
  CheckCircle,
  BarChart3,
  Info,
  HelpCircle,
  Gamepad2,
  Menu,
  X
} from 'lucide-react';
import { AuthContext } from '../App';
import { APP_NAME } from '../constants';
import { ApeGuruAi } from './ApeGuruAi';
import { Notification } from '../types';
import { io } from 'socket.io-client';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const socket = io();

const NavItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active?: boolean }) => (
  <Link to={to} className={cn(
    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
    active ? "bg-white/20 text-white shadow-lg" : "text-white/60 hover:bg-white/10 hover:text-white"
  )}>
    <Icon size={20} className={cn("transition-transform duration-300", active ? "scale-110" : "group-hover:scale-110")} />
    <span className="font-medium">{label}</span>
  </Link>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetch(`/api/notifications/${user.id}`).then(res => res.json()).then(setNotifications);
      socket.on('notification', (notif) => {
        if (notif.user_id === user.id) setNotifications(prev => [notif, ...prev]);
      });
    }
    return () => { socket.off('notification'); };
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-black text-white flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="h-screen bg-white/5 backdrop-blur-2xl border-r border-white/10 flex flex-col z-20"
      >
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            {APP_NAME}
          </h2>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden"><X size={20} /></button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" active={window.location.pathname === '/'} />
          <NavItem to="/courses" icon={BookOpen} label="Courses" active={window.location.pathname === '/courses'} />
          <NavItem to="/meetings" icon={Video} label="Meetings" active={window.location.pathname === '/meetings'} />
          <NavItem to="/tests" icon={FileText} label="Online Tests" active={window.location.pathname === '/tests'} />
          {user?.role === 'admin' && (
            <>
              <NavItem to="/students" icon={Users} label="Student Management" active={window.location.pathname === '/students'} />
              <NavItem to="/content-admin" icon={FileText} label="Content Management" active={window.location.pathname === '/content-admin'} />
              <NavItem to="/attendance-admin" icon={CheckCircle} label="Mark Attendance" active={window.location.pathname === '/attendance-admin'} />
            </>
          )}
          <NavItem to="/attendance" icon={CheckCircle} label="Attendance" active={window.location.pathname === '/attendance'} />
          <NavItem to="/progress" icon={BarChart3} label="My Progress" active={window.location.pathname === '/progress'} />
          <NavItem to="/preschool" icon={Gamepad2} label="Preschool" active={window.location.pathname === '/preschool'} />
          <NavItem to="/about" icon={Info} label="About Us" active={window.location.pathname === '/about'} />
          <NavItem to="/how-to" icon={HelpCircle} label="How to Use" active={window.location.pathname === '/how-to'} />
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-white/5 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-white/10 rounded-xl">
                <Menu size={20} />
              </button>
            )}
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="text"
                placeholder="Search courses, tests..."
                className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 hover:bg-white/10 rounded-xl transition-all">
              <Bell size={20} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
            <Link to="/profile" className="flex items-center gap-3 p-1 pr-4 hover:bg-white/10 rounded-2xl transition-all">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                {user?.profile_photo ? (
                  <img src={user.profile_photo} alt="" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <UserIcon size={20} />
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold leading-tight">{user?.username}</p>
                <p className="text-xs text-white/40 leading-tight capitalize">{user?.role}</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* AI Assistant Button */}
        <ApeGuruAi />
      </main>
    </div>
  );
};
