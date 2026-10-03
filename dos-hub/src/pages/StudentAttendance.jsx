import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { CheckSquare, CheckCircle, XCircle, Clock, Award, Calendar, MapPin } from 'lucide-react';

export const StudentAttendance = ({ onViewCertificate }) => {
  const toast = useToast();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get('/attendance/my');
        setAttendance(res.attendance || []);
      } catch (err) {
        toast.error('Failed to load attendance records.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const presentCount = attendance.filter((a) => a.status === 'present').length;
  const absentCount = attendance.filter((a) => a.status === 'absent').length;
  const pendingCount = attendance.filter((a) => a.status === 'unmarked' || !a.status).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">My Attendance Log</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review verified workshop attendance and certificate eligibility statuses.
        </p>
      </div>

      {/* Summary metric pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-emerald-300 font-medium">Present</p>
            <h4 className="text-xl font-bold text-emerald-400 mt-0.5">{presentCount} Workshops</h4>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/20 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-rose-300 font-medium">Absent</p>
            <h4 className="text-xl font-bold text-rose-400 mt-0.5">{absentCount} Workshops</h4>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-800 text-slate-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Awaiting Verification</p>
            <h4 className="text-xl font-bold text-slate-300 mt-0.5">{pendingCount} Workshops</h4>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex items-center justify-center min-h-[250px]">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : attendance.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <CheckSquare className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No attendance records found</h3>
            <p className="text-xs text-slate-400">
              Register for workshops to track your attendance here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase bg-slate-800/80 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Workshop</th>
                  <th className="py-3.5 px-4">Schedule</th>
                  <th className="py-3.5 px-4">Venue</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {attendance.map((row) => {
                  const isPresent = row.status === 'present';
                  const isAbsent = row.status === 'absent';
                  const isPending = row.status === 'unmarked' || !row.status;

                  return (
                    <tr key={row.workshop_id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4 font-bold text-sm text-white">
                        <div>{row.title}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{row.instructor}</div>
                      </td>
                      <td className="py-4 px-4 text-slate-300">
                        <div>{row.date}</div>
                        <div className="text-[11px] text-slate-400">{row.time}</div>
                      </td>
                      <td className="py-4 px-4 text-slate-300">{row.venue}</td>
                      <td className="py-4 px-4">
                        {isPresent && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle className="w-3.5 h-3.5" /> Present
                          </span>
                        )}
                        {isAbsent && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                            <XCircle className="w-3.5 h-3.5" /> Absent
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                            <Clock className="w-3.5 h-3.5" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {row.certificate_id ? (
                          <button
                            onClick={() => onViewCertificate(row.certificate_id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
                          >
                            <Award className="w-3.5 h-3.5" /> View Certificate
                          </button>
                        ) : isPresent ? (
                          <span className="text-[11px] font-semibold text-emerald-400">
                            Ready to Claim
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500">Not Eligible</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
