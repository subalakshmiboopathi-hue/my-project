import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import { StarRating } from '../components/StarRating';
import {
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  Award,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const StudentMyWorkshops = ({ onViewCertificate }) => {
  const toast = useToast();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Feedback Modal state
  const [feedbackWorkshop, setFeedbackWorkshop] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Certificate generating state
  const [generatingCertId, setGeneratingCertId] = useState(null);

  const fetchMyRegistrations = async () => {
    try {
      const res = await api.get('/registrations/my');
      setRegistrations(res.registrations || []);
    } catch (err) {
      toast.error('Failed to load registered workshops.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRegistrations();
  }, []);

  const handleOpenFeedback = (reg) => {
    setFeedbackWorkshop(reg);
    setRating(reg.feedback_rating || 5);
    setComment(reg.feedback_comment || '');
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackWorkshop) return;

    setSubmittingFeedback(true);
    try {
      await api.post('/feedback', {
        workshop_id: feedbackWorkshop.workshop_id,
        rating: rating,
        comment: comment,
      });
      toast.success('Thank you! Your feedback has been submitted.');
      setFeedbackWorkshop(null);
      fetchMyRegistrations();
    } catch (err) {
      toast.error(err.message || 'Failed to submit feedback.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleClaimCertificate = async (reg) => {
    setGeneratingCertId(reg.workshop_id);
    try {
      const res = await api.post('/certificates/generate', {
        workshop_id: reg.workshop_id,
      });
      toast.success('Certificate generated successfully!');
      fetchMyRegistrations();
      if (res.certificate?.certificate_id) {
        onViewCertificate(res.certificate.certificate_id);
      }
    } catch (err) {
      toast.error(err.message || 'Could not generate certificate.');
    } finally {
      setGeneratingCertId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">My Registered Workshops</h1>
        <p className="text-xs text-slate-400 mt-1">
          Track attendance, submit reviews, and claim your official certificates of participation.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : registrations.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No active enrollments</h3>
          <p className="text-xs text-slate-400">
            You have not registered for any workshops yet. Browse the catalog to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => {
            const isPresent = reg.attendance_status === 'present';
            const isAbsent = reg.attendance_status === 'absent';
            const isPending = !reg.attendance_status || reg.attendance_status === 'unmarked';
            const hasCertificate = !!reg.certificate_id;
            const hasFeedback = !!reg.feedback_id;

            return (
              <div
                key={reg.registration_id}
                className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all backdrop-blur-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-indigo-500/20">
                        {reg.date}
                      </span>
                      {isPresent && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle className="w-3.5 h-3.5" /> Present
                        </span>
                      )}
                      {isAbsent && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                          <XCircle className="w-3.5 h-3.5" /> Absent
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                          <Clock className="w-3.5 h-3.5" /> Attendance Pending
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white pt-1">{reg.title}</h3>
                    <p className="text-xs text-slate-400">{reg.description}</p>
                  </div>

                  {/* Badges / ID */}
                  {hasCertificate && (
                    <div className="shrink-0">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                        <Award className="w-4 h-4" />
                        {reg.certificate_id}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span>{reg.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>{reg.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-400" />
                    <span>{reg.instructor}</span>
                  </div>
                </div>

                {/* Bottom Action Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    {hasFeedback ? (
                      <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-800">
                        <StarRating rating={reg.feedback_rating} size="w-3.5 h-3.5" />
                        <span>Feedback Submitted</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenFeedback(reg)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                        Submit Feedback
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isPresent ? (
                      hasCertificate ? (
                        <button
                          onClick={() => onViewCertificate(reg.certificate_id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-amber-300 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/40 shadow-lg shadow-amber-500/10 transition-all"
                        >
                          <Award className="w-4 h-4" />
                          <span>View Certificate</span>
                        </button>
                      ) : (
                        <button
                          disabled={generatingCertId === reg.workshop_id}
                          onClick={() => handleClaimCertificate(reg)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/25 transition-all transform active:scale-95"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>{generatingCertId === reg.workshop_id ? 'Generating...' : 'Claim Certificate'}</span>
                        </button>
                      )
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">
                        {isAbsent ? 'Certificate not eligible (Absent)' : 'Certificate available after attendance verification'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Feedback Submission Modal */}
      {feedbackWorkshop && (
        <Modal
          isOpen={!!feedbackWorkshop}
          onClose={() => setFeedbackWorkshop(null)}
          title="Submit Workshop Feedback"
          subtitle={`How was your experience in "${feedbackWorkshop.title}"?`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Overall Rating (1 to 5 Stars) *
              </label>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between">
                <StarRating
                  rating={rating}
                  interactive={true}
                  onChange={(val) => setRating(val)}
                  size="w-7 h-7"
                />
                <span className="text-sm font-bold text-amber-400">{rating} of 5 Stars</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Your Feedback & Comments
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on the instructor, topics covered, and overall experience..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setFeedbackWorkshop(null)}
                disabled={submittingFeedback}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingFeedback}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
              >
                {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
