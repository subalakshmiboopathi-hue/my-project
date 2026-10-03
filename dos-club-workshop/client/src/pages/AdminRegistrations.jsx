import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Users, Search, Calendar, Award, CheckCircle, XCircle, Clock } from 'lucide-react';

export const AdminRegistrations = () => {
  const toast = useToast();
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const res = await api.get('/workshops');
        setWorkshops(res.workshops || []);
        if (res.workshops && res.workshops.length > 0) {
          setSelectedWorkshopId(res.workshops[0].id.toString());
        }
      } catch (err) {
        toast.error('Failed to load workshops list.');
      }
    };
    fetchWorkshops();
  }, []);

  useEffect(() => {
    if (!selectedWorkshopId) return;

    const fetchRegistrations = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/registrations/workshop/${selectedWorkshopId}`);
        setRegistrations(res.registrations || []);
      } catch (err) {
        toast.error('Failed to load registrations.');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [selectedWorkshopId]);

  const filteredRegistrations = registrations.filter(
    (r) =>
      r.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.student_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Workshop Registrations</h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete student rosters and enrollment timestamps.
          </p>
        </div>

        <div className="w-full sm:w-80">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Select Workshop
          </label>
          <select
            value={selectedWorkshopId}
            onChange={(e) => setSelectedWorkshopId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
          >
            {workshops.map((w) => (
              <option key={w.id} value={w.id}>
                {w.title} ({w.date})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <span className="text-xs font-semibold text-slate-400 px-2">
          {filteredRegistrations.length} Students
        </span>
      </div>

      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex items-center justify-center min-h-[250px]">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <Users className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No registrations found</h3>
            <p className="text-xs text-slate-400">
              No students have registered for this workshop yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase bg-slate-800/80 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">#</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Registration Date</th>
                  <th className="py-3.5 px-4">Attendance</th>
                  <th className="py-3.5 px-4 text-right">Certificate ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRegistrations.map((r, idx) => (
                  <tr key={r.registration_id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4 font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-4 px-4 font-bold text-sm text-white">{r.student_name}</td>
                    <td className="py-4 px-4 text-slate-300">{r.student_email}</td>
                    <td className="py-4 px-4 text-slate-400">
                      {new Date(r.registered_at).toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      {r.attendance_status === 'present' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle className="w-3 h-3" /> Present
                        </span>
                      ) : r.attendance_status === 'absent' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          <XCircle className="w-3 h-3" /> Absent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {r.certificate_id ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          <Award className="w-3 h-3" /> {r.certificate_id}
                        </span>
                      ) : (
                        <span className="text-slate-600 font-mono">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
