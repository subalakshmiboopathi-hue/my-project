import React from 'react';
import { ShieldCheck, GraduationCap, Sparkles, ArrowRight, BookOpen, Award, CheckCircle } from 'lucide-react';

export const PortalLandingPage = ({ onSelectAdmin, onSelectStudent, onSelectRegister }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 px-4 py-8 sm:py-12">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto w-full space-y-10 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-2xl shadow-indigo-500/30 mb-2">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
            DOS Club Workshop Management System
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Choose Your Login Portal
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
            Select the appropriate portal to access administrative tools or explore technical workshops and claim certificates.
          </p>
        </div>

        {/* Dual Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admin Portal Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-indigo-500/30 hover:border-indigo-500/60 shadow-2xl shadow-indigo-500/5 backdrop-blur-xl flex flex-col justify-between space-y-6 transition-all duration-200 hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Organizer & Faculty
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-1">Admin Portal</h2>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Create and manage workshops, track enrollments, verify student attendance, view participant feedback, and issue certificates.
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Workshop CRUD & Capacity Settings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Attendance Verification (Present / Absent)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Feedback Analytics & Dashboard KPIs</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80">
              <button
                onClick={onSelectAdmin}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-lg shadow-indigo-600/30 transition-all duration-150 transform active:scale-95"
              >
                <span>Open Admin Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Student Portal Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-500/60 shadow-2xl shadow-cyan-500/5 backdrop-blur-xl flex flex-col justify-between space-y-6 transition-all duration-200 hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Participants & Members
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-1">Student Hub</h2>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Browse upcoming technical workshops, secure your seat, review attendance logs, submit ratings, and download participation certificates.
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Browse Workshops & Live Seat Availability</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Track Personal Attendance Status</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Official Verified Certificate of Participation</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <button
                onClick={onSelectStudent}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-lg shadow-cyan-600/30 transition-all duration-150 transform active:scale-95"
              >
                <span>Open Student Login (/login)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <button
                  onClick={onSelectRegister}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  New Student? Register Account (/register) →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 mt-8">
        DOS Club Workshop Management System • PostgreSQL Backend • Port 5000
      </footer>
    </div>
  );
};
