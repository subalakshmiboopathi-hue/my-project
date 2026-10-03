import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Award, Calendar, User, ArrowRight, Printer, Sparkles, CheckCircle } from 'lucide-react';

export const StudentCertificates = ({ onViewCertificate }) => {
  const toast = useToast();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await api.get('/certificates/my');
        setCertificates(res.certificates || []);
      } catch (err) {
        toast.error('Failed to load certificates.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">My Credentials & Certificates</h1>
        <p className="text-xs text-slate-400 mt-1">
          Official DOS Club verified certificates of participation.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
          <Award className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No certificates issued yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Attend your registered workshops and get marked as Present by the organizer to claim your certificates.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-amber-500/20 shadow-xl relative overflow-hidden backdrop-blur-sm space-y-4 hover:border-amber-500/40 transition-colors"
            >
              {/* Corner ribbon watermark */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-mono font-bold">
                    <Award className="w-3.5 h-3.5" />
                    {cert.certificate_id}
                  </span>
                  <h3 className="text-lg font-bold text-white pt-2">{cert.workshop_title}</h3>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <div className="text-xs text-slate-300 space-y-1.5 py-2 border-y border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Recipient:</span>
                  <span className="font-bold text-white">{cert.student_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Workshop Date:</span>
                  <span>{cert.workshop_date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Issued On:</span>
                  <span>{new Date(cert.issued_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified
                </span>

                <button
                  onClick={() => onViewCertificate(cert.certificate_id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 shadow-lg shadow-amber-500/10 transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / View Certificate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
