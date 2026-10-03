import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Printer, ArrowLeft, Award, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';

export const CertificateView = ({ certificateId, onBack }) => {
  const toast = useToast();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await api.get(`/certificates/view/${certificateId}`);
        setCert(res.certificate);
      } catch (err) {
        toast.error('Failed to load certificate data.');
      } finally {
        setLoading(false);
      }
    };

    if (certificateId) {
      fetchCertificate();
    }
  }, [certificateId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="text-center py-20 space-y-4">
        <Award className="w-16 h-16 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">Certificate Not Found</h2>
        <p className="text-sm text-slate-400">The requested certificate could not be located.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="no-print flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-lg">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <CheckCircle className="w-4 h-4" />
            <span>Verified Credential</span>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-lg shadow-amber-500/20 transition-all transform active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Certificate Frame */}
      <div className="certificate-frame bg-slate-950 text-slate-900 rounded-3xl p-4 sm:p-8 border-4 border-amber-500/40 shadow-2xl relative overflow-hidden">
        {/* Parchment background effect */}
        <div className="bg-[#fcfaf5] text-[#1c1917] rounded-2xl p-8 sm:p-14 border-2 border-[#b45309] shadow-inner relative flex flex-col justify-between items-center text-center space-y-8 min-h-[600px]">
          {/* Inner ornamental border line */}
          <div className="absolute inset-3 border border-[#d97706]/40 pointer-events-none rounded-xl" />
          <div className="absolute inset-4 border border-[#d97706]/20 pointer-events-none rounded-lg" />

          {/* Corner decorative accents */}
          <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-[#b45309] pointer-events-none" />
          <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-[#b45309] pointer-events-none" />
          <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-[#b45309] pointer-events-none" />
          <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-[#b45309] pointer-events-none" />

          {/* Certificate Header */}
          <div className="space-y-3 pt-2">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#fef3c7] border border-[#f59e0b]/40 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#b45309]" />
              <span className="font-extrabold tracking-[0.25em] text-[#78350f] text-sm uppercase">
                DOS CLUB
              </span>
              <Sparkles className="w-4 h-4 text-[#b45309]" />
            </div>

            <h1 className="font-cinzel text-2xl sm:text-4xl font-extrabold tracking-wider text-[#1e1b4b] uppercase pt-2">
              Certificate of Participation
            </h1>
            <p className="text-xs sm:text-sm font-serif italic text-[#78716c]">
              This is proudly presented to
            </p>
          </div>

          {/* Recipient Name */}
          <div className="w-full max-w-xl border-b-2 border-[#d97706]/60 pb-2">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0f172a] tracking-tight font-serif">
              {cert.student_name}
            </h2>
          </div>

          {/* Workshop Details */}
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs sm:text-sm text-[#57534e] font-serif">
              for actively participating and successfully completing the technical workshop on
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1e293b] font-cinzel tracking-wide">
              {cert.workshop_title}
            </h3>
            <p className="text-xs text-[#78716c] pt-1">
              Organized by <strong className="text-[#1c1917]">DOS Club</strong> at {cert.venue}
            </p>
          </div>

          {/* Certificate Metadata & Signatures Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 items-end border-t border-[#d97706]/30">
            {/* Date & Location */}
            <div className="text-center sm:text-left space-y-1">
              <p className="text-[11px] uppercase tracking-wider text-[#78716c] font-semibold">
                Date of Event
              </p>
              <p className="text-sm font-bold text-[#1e293b]">{cert.formatted_date || cert.raw_date}</p>
            </div>

            {/* Official Gold Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#b45309] via-[#f59e0b] to-[#fbbf24] p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-[#fef3c7] rounded-full flex flex-col items-center justify-center text-center p-1 border border-[#b45309]/40">
                  <ShieldCheck className="w-5 h-5 text-[#b45309]" />
                  <span className="text-[8px] font-black tracking-tighter text-[#78350f] uppercase">
                    VERIFIED
                  </span>
                </div>
              </div>
              <p className="text-[9px] font-mono text-[#78350f] font-bold mt-1 tracking-wider">
                DOS OFFICIAL SEAL
              </p>
            </div>

            {/* Signature Block */}
            <div className="text-center sm:text-right space-y-1">
              <div className="font-serif italic text-base font-semibold text-[#1e293b]">
                {cert.instructor}
              </div>
              <div className="w-36 ml-auto mr-auto sm:mr-0 border-t border-[#78716c]/40 pt-1">
                <p className="text-[11px] uppercase tracking-wider text-[#78716c] font-semibold">
                  Lead Instructor
                </p>
              </div>
            </div>
          </div>

          {/* Certificate Verification Code Footer */}
          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] font-mono font-bold text-[#78350f] bg-[#fef3c7]/60 px-4 py-1.5 rounded-full border border-[#f59e0b]/30">
            <span>Certificate ID:</span>
            <span className="tracking-widest">{cert.certificate_id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
