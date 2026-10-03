import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Shield, GraduationCap, Menu, Sparkles } from 'lucide-react';

export const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-white text-base">DOS CLUB</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                WMS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Workshop Management System
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {user && (
          <div className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-slate-300">
              {isAdmin ? <Shield className="w-4 h-4 text-indigo-400" /> : <GraduationCap className="w-4 h-4 text-cyan-400" />}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-200 leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                isAdmin
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              {user.role}
            </span>
          </div>
        )}

        <button
          onClick={logout}
          title="Sign Out"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-rose-300 hover:bg-rose-500/10 border border-slate-700/60 hover:border-rose-500/30 transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
