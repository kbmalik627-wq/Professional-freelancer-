import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Mail, MessageCircle, ShieldCheck, Heart, X } from 'lucide-react';
import { PAYMENT_CONFIG } from '../data/servicesData';
import { FeedbackStats } from '../types';

interface FooterSectionProps {
  feedback: FeedbackStats;
  onFeedbackVote: (type: 'like' | 'unlike') => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  feedback,
  onFeedbackVote,
}) => {
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | 'support' | null>(null);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Feedback Section as specifically requested */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 max-w-3xl mx-auto text-center shadow-lg">
          <p className="text-base sm:text-lg font-bold text-white mb-2">
            Was this helpful? Leave feedback to support the freelancer.
          </p>
          <p className="text-xs text-slate-400 mb-6 max-w-lg mx-auto">
            Your anonymous response helps improve service offerings, project turnaround times, and delivery reliability.
          </p>

          {/* Like: 128 Likes, Unlike: 12 Unlike with interactive voting */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onFeedbackVote('like')}
              className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                feedback.userVote === 'like'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400'
                  : 'bg-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${feedback.userVote === 'like' ? 'fill-white' : ''}`} />
              <span>Like:</span>
              <span className="font-extrabold tabular-nums">{feedback.likes} Likes</span>
            </button>

            <button
              onClick={() => onFeedbackVote('unlike')}
              className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                feedback.userVote === 'unlike'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30 ring-2 ring-rose-400'
                  : 'bg-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white'
              }`}
            >
              <ThumbsDown className={`w-4 h-4 ${feedback.userVote === 'unlike' ? 'fill-white' : ''}`} />
              <span>Unlike:</span>
              <span className="font-extrabold tabular-nums">{feedback.unlikes} Unlike</span>
            </button>
          </div>

          {feedback.userVote && (
            <p className="text-xs text-emerald-400 mt-3 font-medium animate-in fade-in">
              ✓ Thank you for your feedback!
            </p>
          )}
        </div>

        {/* Footer Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md">
                PF
              </span>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Professional Freelancer
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Premium freelance creative, web, content, and video production services. Secure payment fulfillment via JazzCash and instant Google Drive vault deliveries.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Verified Freelancer Account (KM)</span>
            </div>
          </div>

          {/* Quick Contact Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Direct Contact
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href="mailto:contact@profreelancer.com"
                  className="hover:text-white transition-colors"
                >
                  contact@profreelancer.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${PAYMENT_CONFIG.adminWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 font-mono transition-colors"
                >
                  WhatsApp: 03267976823
                </a>
              </li>
              <li className="text-slate-500 pt-1">
                JazzCash: 03267976823 (KM)
              </li>
            </ul>
          </div>

          {/* Legal / Policy Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Legal & Support
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setActiveModal('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('support')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Support & Revisions
                </button>
              </li>
              <li>
                <a
                  href="#payment-download"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Payment & Download Portal
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            Copyright 2024 Professional Freelancer. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span>Admin WhatsApp: <strong className="text-slate-300 font-mono">03267976823</strong></span>
            <span>·</span>
            <span>Account: <strong className="text-slate-300 font-mono">KM</strong></span>
          </div>
        </div>
      </div>

      {/* Info Modals for Terms, Privacy, Support */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in duration-200">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'terms' && (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900">Terms of Service</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  1. Project Work: All custom design, code, writing, and video production work begins upon agreement and confirmation of project scope.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  2. Payment Fulfillment: Payments made via JazzCash (Account 03267976823, Title KM) grant immediate access to download packages from our secure Google Drive vault.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  3. Revisions: Each project includes up to 2 revision iterations within 7 days of delivery.
                </p>
              </div>
            )}

            {activeModal === 'privacy' && (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900">Privacy Policy</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  1. Data Security: We never sell or share your contact details, project assets, or confidential briefs with any third parties.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  2. File Protection: Work samples shown on this website are protected with digital watermarks and anti-theft controls to prevent unauthorized distribution.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  3. Contact: Inquiries sent via WhatsApp or Email are held strictly private.
                </p>
              </div>
            )}

            {activeModal === 'support' && (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900">Client Support & Inquiries</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Need help downloading your files, requesting adjustments, or starting a new campaign?
                </p>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div><strong>WhatsApp Hotline:</strong> 03267976823 (KM)</div>
                  <div><strong>Email:</strong> contact@profreelancer.com</div>
                  <div><strong>JazzCash Support:</strong> Instant verification available 24/7</div>
                </div>
              </div>
            )}

            <div className="pt-4 mt-4 border-t border-slate-100 text-right">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
