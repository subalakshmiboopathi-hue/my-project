import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { StatCard } from '../components/StatCard';
import {
  Calendar,
  Award,
  CheckSquare,
  Compass,
  ArrowRight,
  Clock,
  MapPin,
  User,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const StudentDashboard = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats/student');
        setData(res);
      } catch (err) {
        toast.error('Failed to load student dashboard stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const nextWorkshop = data?.nextWorkshop;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-cyan-950/40 border border-indigo-500/20 shadow-xl">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            DOS Club Member Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Explore cutting-edge technical workshops, track your attendance, and claim verified certificates of participation.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('student-workshops')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition-all transform active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Browse All Workshops</span>
            </button>
            <button
              onClick={() => onNavigateTab('student-my-workshops')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>My Enrolled Workshops</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Workshops"
          value={stats.registered_count || 0}
          icon={BookOpen}
          subtitle="Enrolled sessions"
          color="indigo"
        />
        <StatCard
          title="Attended"
          value={stats.attended_count || 0}
          icon={CheckSquare}
          subtitle="Marked present"
          color="emerald"
        />
        <StatCard
          title="Certificates"
          value={stats.certificates_count || 0}
          icon={Award}
          subtitle="Earned credentials"
          color="amber"
        />
        <StatCard
          title="Feedback Submitted"
          value={stats.feedback_count || 0}
          icon={Calendar}
          subtitle="Reviews contributed"
          color="cyan"
        />
      </div>

      {/* Spotlight Next Workshop or Call to Action */}
      {nextWorkshop ? (
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Your Next Upcoming Workshop
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Date: {nextWorkshop.date}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">{nextWorkshop.title}</h3>
            <p className="text-xs text-slate-400 line-clamp-2">{nextWorkshop.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>{nextWorkshop.time}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>{nextWorkshop.venue}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
              <User className="w-4 h-4 text-amber-400" />
              <span>{nextWorkshop.instructor}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
          <Compass className="w-12 h-12 text-indigo-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No upcoming registrations</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse our catalogue of hands-on technical workshops and secure your seat today.
          </p>
          <button
            onClick={() => onNavigateTab('student-workshops')}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
          >
            <span>Explore Workshops</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
