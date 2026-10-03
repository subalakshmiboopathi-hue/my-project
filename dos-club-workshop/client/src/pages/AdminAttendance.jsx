import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  CheckSquare,
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  Search,
  Award,
  Clock,
  Filter
} from 'lucide-react';

export const AdminAttendance = ({ initialWorkshopId }) => {
  const toast = useToast();
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState(initialWorkshopId || '');
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Load all workshops for the dropdown
  useEffect(() => {
    const loadWorkshops = async () => {
      try {
        const res = await api.get('/workshops');
        setWorkshops(res.workshops || []);
        if (!selectedWorkshopId && res.workshops && res.workshops.length > 0) {
          setSelectedWorkshopId(res.workshops[0].id.toString());
        }
      } catch (err) {
        toast.error('Failed to load workshops list.');
      }
    };
    loadWorkshops();
  }, []);

  // Load attendance whenever selected workshop changes
  useEffect(() => {
    if (!selectedWorkshopId) return;

    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/attendance/workshop/${selectedWorkshopId}`);
        setAttendanceList(res.attendance || []);
      } catch (err) {
        toast.error('Failed to fetch attendance for this workshop.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedWorkshopId]);

  const handleMarkAttendance = async (studentId, status) => {
    setUpdatingId(studentId);
    try {
      await api.post('/attendance/mark', {
        workshop_id: parseInt(selectedWorkshopId, 10),
        student_id: studentId,
        status: status,
      });

      // Update state locally
      setAttendanceList((prev) =>
        prev.map((item) =>
          item.student_id === studentId ? { ...item, status: status } : item
        )
      );

      toast.success(`Marked as ${status.toUpperCase()}`);
    } catch (err) {
      toast.error(err.message || 'Failed to update attendance.');
    } finally {
      setUpdatingId(null);
    }
  };

  const selectedWorkshop = workshops.find((w) => w.id.toString() === selectedWorkshopId?.toString());

  const filteredAttendance = attendanceList.filter((item) => {
    const matchesSearch =
      item.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.student_email.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && item.status === filterStatus;
  });

  const presentCount = attendanceList.filter((a) => a.status === 'present').length;
  const absentCount = attendanceList.filter((a) => a.status === 'absent').length;
  const unmarkedCount = attendanceList.filter((a) => a.status === 'unmarked').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Attendance Verification
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Mark student attendance to grant certificate eligibility.
          </p>
        </div>

        {/* Workshop Picker */}
        <div className="w-full sm:w-80">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Select Workshop
          </label>
          <select
            value={selectedWorkshopId}
            onChange={(e) => setSelectedWorkshopId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 transition-colors"
          >
            {workshops.map((w) => (
              <option key={w.id} value={w.id}>
                {w.title} ({w.date})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Workshop Quick Info & Counters */}
      {selectedWorkshop && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Enrolled Students</p>
              <h4 className="text-lg font-bold text-white mt-0.5">{attendanceList.length}</h4>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-emerald-300 font-medium">Marked Present</p>
              <h4 className="text-lg font-bold text-emerald-400 mt-0.5">{presentCount}</h4>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/20 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-rose-300 font-medium">Marked Absent</p>
              <h4 className="text-lg font-bold text-rose-400 mt-0.5">{absentCount}</h4>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-800 text-slate-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Pending Review</p>
              <h4 className="text-lg font-bold text-slate-300 mt-0.5">{unmarkedCount}</h4>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['all', 'present', 'absent', 'unmarked'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white bg-slate-800/60'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex items-center justify-center min-h-[250px]">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredAttendance.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <Users className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No student records</h3>
            <p className="text-xs text-slate-400">
              No students have registered for this workshop yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase bg-slate-800/80 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4">Certificate</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAttendance.map((row) => {
                  const isPresent = row.status === 'present';
                  const isAbsent = row.status === 'absent';
                  const isPending = row.status === 'unmarked';
                  const isUpdating = updatingId === row.student_id;

                  return (
                    <tr key={row.student_id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold text-sm text-white">{row.student_name}</div>
                      </td>
                      <td className="py-4 px-4 text-slate-300">{row.student_email}</td>
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
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                            <Clock className="w-3.5 h-3.5" /> Unmarked
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {row.certificate_id ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            <Award className="w-3 h-3" /> {row.certificate_id}
                          </span>
                        ) : isPresent ? (
                          <span className="text-[11px] text-emerald-400">Eligible</span>
                        ) : (
                          <span className="text-[11px] text-slate-500">Requires Present</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            disabled={isUpdating}
                            onClick={() => handleMarkAttendance(row.student_id, 'present')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              isPresent
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                            }`}
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Present
                          </button>

                          <button
                            disabled={isUpdating}
                            onClick={() => handleMarkAttendance(row.student_id, 'absent')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              isAbsent
                                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                                : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Absent
                          </button>
                        </div>
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
