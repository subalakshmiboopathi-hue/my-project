import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { WorkshopCard } from '../components/WorkshopCard';
import {
  Plus,
  Search,
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Edit2,
  Trash2,
  CheckSquare
} from 'lucide-react';

export const AdminWorkshops = ({ onNavigateAttendance, isCreateModalOpen, onCloseCreateModal }) => {
  const toast = useToast();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState(null);
  const [deletingWorkshop, setDeletingWorkshop] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    instructor: '',
    max_seats: 50,
  });

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

  useEffect(() => {
    if (isCreateModalOpen) {
      handleOpenCreate();
    }
  }, [isCreateModalOpen]);

  const handleOpenCreate = () => {
    setEditingWorkshop(null);
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM - 01:00 PM',
      venue: 'DOS Innovation Hub - Hall A',
      instructor: '',
      max_seats: 40,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (workshop) => {
    setEditingWorkshop(workshop);
    setFormData({
      title: workshop.title,
      description: workshop.description,
      date: workshop.date,
      time: workshop.time,
      venue: workshop.venue,
      instructor: workshop.instructor,
      max_seats: workshop.max_seats,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWorkshop(null);
    if (onCloseCreateModal) onCloseCreateModal();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time || !formData.venue || !formData.instructor) {
      toast.warning('Please fill in all required workshop fields.');
      return;
    }

    setFormSubmitting(true);
    try {
      if (editingWorkshop) {
        await api.put(`/workshops/${editingWorkshop.id}`, formData);
        toast.success(`Workshop "${formData.title}" updated successfully!`);
      } else {
        await api.post('/workshops', formData);
        toast.success(`Workshop "${formData.title}" created successfully!`);
      }
      handleCloseModal();
      fetchWorkshops();
    } catch (err) {
      toast.error(err.message || 'Failed to save workshop.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingWorkshop) return;
    setFormSubmitting(true);
    try {
      await api.delete(`/workshops/${deletingWorkshop.id}`);
      toast.success(`Workshop "${deletingWorkshop.title}" deleted.`);
      setDeletingWorkshop(null);
      fetchWorkshops();
    } catch (err) {
      toast.error(err.message || 'Failed to delete workshop.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredWorkshops = workshops.filter((w) =>
    w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Workshop Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, modify, and manage workshop schedules and capacities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Workshop</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, instructor, or venue..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <span className="text-xs font-semibold text-slate-400 px-2 hidden sm:inline">
          {filteredWorkshops.length} {filteredWorkshops.length === 1 ? 'workshop' : 'workshops'}
        </span>
      </div>

      {/* Grid of Workshops */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredWorkshops.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No workshops found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery ? 'Try adjusting your search terms.' : 'Create your first workshop to get started.'}
          </p>
          {!searchQuery && (
            <button
              onClick={handleOpenCreate}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Workshop
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWorkshops.map((w) => (
            <WorkshopCard
              key={w.id}
              workshop={w}
              isAdmin={true}
              onEdit={handleOpenEdit}
              onDelete={(item) => setDeletingWorkshop(item)}
              onViewAttendance={(item) => onNavigateAttendance(item.id)}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingWorkshop ? 'Edit Workshop' : 'Create New Workshop'}
        subtitle={editingWorkshop ? `Updating "${editingWorkshop.title}"` : 'Fill in the workshop details for DOS Club students.'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Workshop Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Introduction to Generative AI"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description *
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Comprehensive workshop description and objectives..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Time Interval *
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g. 10:00 AM - 01:00 PM"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Venue / Hall *
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="e.g. DOS Innovation Hub - Hall A"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Instructor Name *
              </label>
              <input
                type="text"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                placeholder="e.g. Dr. Sarah Connor"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Maximum Seats *
            </label>
            <input
              type="number"
              min={1}
              max={1000}
              value={formData.max_seats}
              onChange={(e) => setFormData({ ...formData, max_seats: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={formSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              {formSubmitting ? 'Saving...' : editingWorkshop ? 'Update Workshop' : 'Create Workshop'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingWorkshop}
        onClose={() => setDeletingWorkshop(null)}
        onConfirm={handleDelete}
        title="Delete Workshop"
        message={`Are you sure you want to delete "${deletingWorkshop?.title}"? All associated registrations, attendance records, feedback, and certificates will also be permanently removed.`}
        confirmText="Delete Workshop"
        isDestructive={true}
        loading={formSubmitting}
      />
    </div>
  );
};
