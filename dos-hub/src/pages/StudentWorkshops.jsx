import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { WorkshopCard } from '../components/WorkshopCard';
import { Modal } from '../components/Modal';
import { StarRating } from '../components/StarRating';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Star,
  CheckCircle,
  Award,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';

export const StudentWorkshops = ({ onViewCertificate }) => {
  const toast = useToast();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'available', 'registered'

  // Modal Details
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [registeringId, setRegisteringId] = useState(null);

  const fetchWorkshops = async () => {
    try {
      const res = await api.get('/workshops');
      setWorkshops(res.workshops || []);
    } catch (err) {
      toast.error('Failed to load workshops.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const handleRegister = async (workshop) => {
    setRegisteringId(workshop.id);
    try {
      const res = await api.post('/registrations', { workshop_id: workshop.id });
      toast.success(res.message || 'Successfully registered!');
      if (isDetailsOpen) {
        setIsDetailsOpen(false);
      }
      fetchWorkshops();
    } catch (err) {
      toast.error(err.message || 'Failed to register.');
    } finally {
      setRegisteringId(null);
    }
  };

  const handleOpenDetails = (workshop) => {
    setSelectedWorkshop(workshop);
    setIsDetailsOpen(true);
  };

  const filteredWorkshops = workshops.filter((w) => {
    const matchesSearch =
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.venue.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === 'available') return matchesSearch && w.available_seats > 0 && !w.is_registered;
    if (filterType === 'registered') return matchesSearch && w.is_registered;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Browse Workshops</h1>
        <p className="text-xs text-slate-400 mt-1">
          Discover upcoming sessions, explore topics, and register for seats.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workshops by keyword, speaker, or location..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Workshops' },
            { id: 'available', label: 'Available Seats' },
            { id: 'registered', label: 'My Enrolled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filterType === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Workshop Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredWorkshops.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No workshops found</h3>
          <p className="text-xs text-slate-400">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Check back soon for new workshops!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWorkshops.map((w) => (
            <WorkshopCard
              key={w.id}
              workshop={w}
              isAdmin={false}
              isRegistering={registeringId === w.id}
              onViewDetails={handleOpenDetails}
              onRegister={handleRegister}
              onGenerateCertificate={(item) => onViewCertificate(item.certificate_id || item.id, item)}
            />
          ))}
        </div>
      )}

      {/* Workshop Details Modal */}
      {selectedWorkshop && (
        <Modal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          title={selectedWorkshop.title}
          subtitle={`Instructor: ${selectedWorkshop.instructor}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5">
            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Overview & Curriculum
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
                {selectedWorkshop.description}
              </p>
            </div>

            {/* Logistics info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Date</p>
                  <p className="text-xs font-bold text-white">{selectedWorkshop.date}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
                <Clock className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Time</p>
                  <p className="text-xs font-bold text-white">{selectedWorkshop.time}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Venue</p>
                  <p className="text-xs font-bold text-white">{selectedWorkshop.venue}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
                <Users className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Seat Capacity</p>
                  <p className="text-xs font-bold text-white">
                    {selectedWorkshop.available_seats} Available / {selectedWorkshop.max_seats} Total
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Close
              </button>

              {selectedWorkshop.is_registered ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/20">
                    <CheckCircle className="w-4 h-4" />
                    Already Registered
                  </span>
                </div>
              ) : selectedWorkshop.available_seats <= 0 ? (
                <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-4 py-2 rounded-xl border border-rose-500/20">
                  Full Capacity
                </span>
              ) : (
                <button
                  type="button"
                  disabled={registeringId === selectedWorkshop.id}
                  onClick={() => handleRegister(selectedWorkshop)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                >
                  <span>Register Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
