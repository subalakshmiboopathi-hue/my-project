import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { StarRating } from '../components/StarRating';
import { MessageSquare, Star, User, Calendar, MessageCircle, BarChart3 } from 'lucide-react';

export const AdminFeedback = () => {
  const toast = useToast();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      const res = await api.get('/feedback/all');
      setFeedbacks(res.feedbacks || []);
    } catch (err) {
      toast.error('Failed to load feedback records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const totalReviews = feedbacks.length;
  const avgRating =
    totalReviews > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalReviews).toFixed(1)
      : '0.0';

  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: feedbacks.filter((f) => f.rating === star).length,
    percentage:
      totalReviews > 0
        ? Math.round((feedbacks.filter((f) => f.rating === star).length / totalReviews) * 100)
        : 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Student Feedback & Reviews</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review participant sentiment, ratings, and constructive workshop feedback.
        </p>
      </div>

      {/* Summary Rating Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/20 flex flex-col justify-center items-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Overall Average Score
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-5xl font-black text-white">{avgRating}</span>
            <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
          </div>
          <div className="mt-2">
            <StarRating rating={Math.round(parseFloat(avgRating))} size="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Based on {totalReviews} participant {totalReviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Rating Distribution
          </h3>
          {starCounts.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-3 text-xs">
              <span className="w-12 text-slate-300 font-semibold">{star} Stars</span>
              <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-10 text-right text-slate-400 font-mono">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            All Feedback Submissions ({feedbacks.length})
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
            <MessageCircle className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No feedback submitted yet</h3>
            <p className="text-xs text-slate-400">
              When students attend and submit reviews, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.map((f) => (
              <div
                key={f.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 space-y-3 backdrop-blur-sm transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {f.workshop_title}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1.5">{f.student_name}</h4>
                    <p className="text-[11px] text-slate-400">{f.student_email}</p>
                  </div>
                  <StarRating rating={f.rating} />
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                  "{f.comment || 'No written comment provided.'}"
                </p>

                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Calendar className="w-3 h-3" />
                  <span>Submitted {new Date(f.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
