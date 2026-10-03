import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { StatCard } from '../components/StatCard';
import {
  Calendar,
  Users,
  Award,
  BookOpen,
  Star,
  CheckCircle,
  PlusCircle,
  Clock,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';

export const AdminDashboard = ({ onNavigateTab, onOpenCreateModal }) => {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/stats/admin');
      setData(res);
    } catch (err) {
      toast.error('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentWorkshops = data?.recentWorkshops || [];
  const recentRegistrations = data?.recentRegistrations || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-900/50 via-slate-900 to-slate-900 border border-indigo-500/20 shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            DOS Club Admin Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            System Overview & Metrics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage workshops, oversee registrations, verify attendance, and issue certificates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-lg shadow-indigo-600/25 transition-all transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Workshop</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workshops"
          value={stats.total_workshops || 0}
          icon={Calendar}
          subtitle="Scheduled & active sessions"
          color="indigo"
        />
        <StatCard
          title="Total Students"
          value={stats.total_students || 0}
          icon={Users}
          subtitle="Registered user accounts"
          color="cyan"
        />
        <StatCard
          title="Total Registrations"
          value={stats.total_registrations || 0}
          icon={BookOpen}
          subtitle="Across all workshops"
          color="emerald"
        />
        <StatCard
          title="Certificates Issued"
          value={stats.certificates_issued || 0}
          icon={Award}
          subtitle="Verified attendance claims"
          color="amber"
        />
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Average Student Rating</p>
            <h4 className="text-xl font-bold text-white mt-1 flex items-center gap-1.5">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              {stats.average_rating > 0 ? `${stats.average_rating} / 5.0` : 'N/A'}
            </h4>
          </div>
          <button
            onClick={() => onNavigateTab('admin-feedback')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            Reviews <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Verified Attendance</p>
            <h4 className="text-xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
              <CheckCircle className="w-5 h-5" />
              {stats.total_present || 0} Present
            </h4>
          </div>
          <button
            onClick={() => onNavigateTab('admin-attendance')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            Manage <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Quick Roster</p>
            <h4 className="text-xl font-bold text-slate-200 mt-1">
              {stats.total_registrations || 0} Enrollments
            </h4>
          </div>
          <button
            onClick={() => onNavigateTab('admin-registrations')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            View List <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Workshops (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Active Workshops</h3>
              <p className="text-xs text-slate-400">Current schedule and seat capacities</p>
            </div>
            <button
              onClick={() => onNavigateTab('admin-workshops')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase bg-slate-800/50 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3.5 rounded-l-xl">Workshop</th>
                  <th className="py-3 px-3.5">Date & Time</th>
                  <th className="py-3 px-3.5">Capacity</th>
                  <th className="py-3 px-3.5 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentWorkshops.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-3.5 font-medium text-white">
                      <div className="font-bold text-sm text-slate-200">{w.title}</div>
                      <div className="text-[11px] text-slate-400">{w.instructor}</div>
                    </td>
                    <td className="py-3.5 px-3.5 text-slate-300">
                      <div>{w.date}</div>
                      <div className="text-[11px] text-slate-400">{w.time}</div>
                    </td>
                    <td className="py-3.5 px-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-indigo-300">
                          {w.registered_count} / {w.max_seats}
                        </span>
                        <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{
                              width: `${Math.min(100, (w.registered_count / w.max_seats) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3.5 text-right">
                      <button
                        onClick={() => onNavigateTab('admin-attendance')}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
                      >
                        Attendance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Registrations (1 col) */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Recent Signups</h3>
              <p className="text-xs text-slate-400">Latest student workshop enrollments</p>
            </div>
            <button
              onClick={() => onNavigateTab('admin-registrations')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View Roster
            </button>
          </div>

          <div className="space-y-2.5">
            {recentRegistrations.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No registrations yet.</p>
            ) : (
              recentRegistrations.map((r) => (
                <div
                  key={r.id}
                  className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{r.student_name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{r.student_email}</p>
                    <p className="text-[10px] text-indigo-300 mt-0.5 truncate">{r.workshop_title}</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                    Enrolled
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
