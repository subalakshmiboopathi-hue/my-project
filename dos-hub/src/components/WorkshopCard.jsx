import React from 'react';
import { Calendar, Clock, MapPin, User, Users, Star, ArrowRight, CheckCircle, Award, Sparkles } from 'lucide-react';
import { StarRating } from './StarRating';

export const WorkshopCard = ({
  workshop,
  onViewDetails,
  onRegister,
  onEdit,
  onDelete,
  onViewAttendance,
  onViewFeedback,
  onGenerateCertificate,
  isAdmin = false,
  isRegistering = false,
}) => {
  const isFull = workshop.available_seats <= 0;
  const isRegistered = workshop.is_registered;
  const isPresent = workshop.attendance_status === 'present';
  const hasCertificate = !!workshop.certificate_id;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/40 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/5 overflow-hidden backdrop-blur-sm">
      {/* Header Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-75 group-hover:opacity-100 transition-opacity" />

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Status & Capacity Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-700/80 text-slate-300 border border-slate-600/50">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              {workshop.date}
            </span>

            {isRegistered ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <CheckCircle className="w-3.5 h-3.5" />
                Registered
              </span>
            ) : isFull ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                Sold Out
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                <Users className="w-3.5 h-3.5" />
                {workshop.available_seats} {workshop.available_seats === 1 ? 'seat' : 'seats'} left
              </span>
            )}
          </div>

          {/* Title & Description */}
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
            {workshop.title}
          </h3>
          <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {workshop.description}
          </p>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 py-3 border-y border-slate-800/80">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{workshop.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{workshop.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{workshop.instructor}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400" />
            <span>
              {workshop.average_rating > 0 ? `${workshop.average_rating} / 5` : 'No reviews'} ({workshop.feedback_count || 0})
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
          {isAdmin ? (
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-1.5">
                {onEdit && (
                  <button
                    onClick={() => onEdit(workshop)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(workshop)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {onViewAttendance && (
                  <button
                    onClick={() => onViewAttendance(workshop)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors"
                  >
                    Attendance ({workshop.total_registered})
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full gap-2">
              <button
                onClick={() => onViewDetails(workshop)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors"
              >
                Details
              </button>

              {isRegistered ? (
                isPresent ? (
                  hasCertificate ? (
                    <button
                      onClick={() => onGenerateCertificate(workshop)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-all shadow-lg shadow-amber-500/10"
                    >
                      <Award className="w-3.5 h-3.5" />
                      View Certificate
                    </button>
                  ) : (
                    <button
                      onClick={() => onGenerateCertificate(workshop)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all shadow-lg shadow-emerald-500/10 animate-pulse"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Claim Certificate
                    </button>
                  )
                ) : (
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
                    Enrolled
                  </span>
                )
              ) : isFull ? (
                <button
                  disabled
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 bg-slate-800/40 border border-slate-800 cursor-not-allowed"
                >
                  Full Capacity
                </button>
              ) : (
                <button
                  onClick={() => onRegister(workshop)}
                  disabled={isRegistering}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all transform active:scale-95"
                >
                  <span>Register</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
