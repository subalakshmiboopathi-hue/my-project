import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  CheckSquare,
  MessageSquare,
  Award,
  BookOpen,
  Sparkles,
  ChevronRight,
  X,
  Compass
} from 'lucide-react';

export const Sidebar = ({ currentTab, onSelectTab, isOpen, onClose }) => {
  const { isAdmin } = useAuth();

  const adminNav = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'admin-workshops', label: 'Manage Workshops', icon: Calendar, badge: 'CRUD' },
    { id: 'admin-registrations', label: 'Registrations', icon: Users, badge: null },
    { id: 'admin-attendance', label: 'Attendance', icon: CheckSquare, badge: 'Active' },
    { id: 'admin-feedback', label: 'Feedback & Reviews', icon: MessageSquare, badge: null },
  ];

  const studentNav = [
    { id: 'student-dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'student-workshops', label: 'Browse Workshops', icon: Compass, badge: 'Explore' },
    { id: 'student-my-workshops', label: 'My Registered', icon: BookOpen, badge: null },
    { id: 'student-attendance', label: 'My Attendance', icon: CheckSquare, badge: null },
    { id: 'student-certificates', label: 'My Certificates', icon: Award, badge: 'Claim' },
  ];

  const navItems = isAdmin ? adminNav : studentNav;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen lg:h-[calc(100vh-4rem)] w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Mobile Header with close button */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 lg:hidden">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-white">DOS Portal</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-3 px-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {isAdmin ? 'Administration' : 'Student Hub'}
            </p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/90 to-indigo-700 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-indigo-300 border border-indigo-500/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info card */}
        <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-indigo-300 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            PostgreSQL Live
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Connected to <span className="text-slate-300 font-medium">dos_workshop</span> DB.
          </p>
        </div>
      </aside>
    </>
  );
};
