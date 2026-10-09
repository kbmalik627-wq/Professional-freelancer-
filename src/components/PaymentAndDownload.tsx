import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  Lock,
  Unlock,
  Download,
  AlertCircle,
  ExternalLink,
  QrCode,
  RotateCcw,
  ChevronDown,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { PAYMENT_CONFIG } from '../data/servicesData';
import { ServiceItem, GoogleUser } from '../types';

interface PaymentAndDownloadProps {
  selectedService: ServiceItem | null;
  services: ServiceItem[];
  onSelectService: (service: ServiceItem) => void;
  isPaid: boolean;
  onConfirmPayment: (trxid?: string) => void;
  onResetPayment: () => void;
  onNotify: (message: string) => void;
  user: GoogleUser | null;
  onOpenLogin: () => void;
}

export const PaymentAndDownload: React.FC<PaymentAndDownloadProps> = ({
  selectedService,
  services,
  onSelectService,
  isPaid,
  onConfirmPayment,
  onResetPayment,
  onNotify,
  user,
  onOpenLogin,
}) => {
  const [copied, setCopied] = useState(false);
  const [trxId, setTrxId] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize trxId from localStorage if present
  useEffect(() => {
    const savedTrx = localStorage.getItem('trxid');
    if (savedTrx) setTrxId(savedTrx);
  }, []);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('03267976823');
    setCopied(true);
    onNotify('Number Copy! (03267976823 copied to clipboard)');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleUnlockClick = () => {
    const cleanId = trxId.trim();
    if (cleanId.length >= 3) {
      localStorage.setItem('paid', 'yes');
      localStorage.setItem('trxid', cleanId);
      onNotify('Payment Verified! Download Unlock Ho Gaya');
      onConfirmPayment(cleanId);
    } else {
      onNotify('Pehle Transaction ID dalo (kam az kam 3-4 digits)');
    }
  };

  const handleDownloadClick = () => {
    if (!isPaid) {
      onNotify('Pehle Left Side Se Payment Karke I Have Paid Dabao');
      return;
    }
    // Open Google Drive link
    window.open(PAYMENT_CONFIG.driveLink, '_blank', 'noopener,noreferrer');

    // Also download simulated deliverables key txt
    const receiptContent = `=====================================================
PROFESSIONAL FREELANCER - CLIENT DELIVERABLES VAULT
=====================================================
Client: ${user ? `${user.name} (${user.email})` : 'Authenticated Client'}
Freelancer: KM (Verified Freelancer)
Service: ${selectedService ? selectedService.title : 'All Project Deliverables'}
JazzCash Account: 03267976823 (Title: KM)
Transaction ID: ${trxId || 'VERIFIED'}
Status: UNLOCKED & APPROVED
Date: ${new Date().toLocaleDateString()}

Deliverable Vault Access:
Google Drive URL: ${PAYMENT_CONFIG.driveLink}

WhatsApp Support: https://wa.me/923267976823
=====================================================`;
    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PF_Deliverables_Access_Key_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Pre-selected service or first available
  const currentService = selectedService || services[0];

  return (
    <section id="payment-download" className="py-14 lg:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Instant Payment Gateway & Delivery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            JazzCash Payment & Instant Download
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Send fee to our JazzCash account, enter the transaction ID digits, and unlock your files instantly.
          </p>

          {/* ================= INTERACTIVE SELECT SERVICES DROPDOWN ================= */}
          <div className="mt-4 relative inline-block text-left" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center justify-between gap-3 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 rounded-xl text-xs sm:text-sm font-semibold text-blue-900 shadow-xs transition-all active:scale-98 cursor-pointer"
              title="Click here to change or choose a service"
            >
              <span className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Selected Service:</span>
                <span className="font-bold text-blue-700">{currentService.title}</span>
                <span className="text-slate-400">—</span>
                <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  {currentService.pricePkr} ({currentService.priceUsd})
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-blue-600 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Helper label beneath */}
            <div className="text-[11px] text-blue-600 mt-1 font-medium flex items-center justify-center gap-1">
              <span>👆 Click karo doosri service select karne ke liye</span>
            </div>

            {/* Dropdown Menu Options */}
            {isDropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Choose Service ({services.length} Available)
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {services.map((svc) => (
                    <button
                      key={svc.id}
                      onClick={() => {
                        onSelectService(svc);
                        setIsDropdownOpen(false);
                        onNotify(`Service Selected: ${svc.title} (${svc.pricePkr})`);
                      }}
                      className={`w-full flex items-center justify-between p-3 text-left transition-colors cursor-pointer ${
                        currentService.id === svc.id
                          ? 'bg-blue-50/80 text-blue-900'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div>
                        <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                          <span>{svc.title}</span>
                          {currentService.id === svc.id && (
                            <Check className="w-3.5 h-3.5 text-blue-600" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {svc.description}
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <div className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {svc.pricePkr}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {svc.priceUsd}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= GOOGLE USER VERIFICATION STRIP ================= */}
        <div className="mb-6 p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Google Icon */}
            <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            {user ? (
              <div className="text-xs">
                <span className="text-slate-500">Google Verified Client:</span>{' '}
                <strong className="text-slate-900">{user.name}</strong>{' '}
                <span className="text-slate-500">({user.email})</span>
              </div>
            ) : (
              <div className="text-xs text-slate-600">
                <strong className="text-slate-800">Google Login Available:</strong> Sign in with your Google account to secure your download link.
              </div>
            )}
          </div>

          <div>
            {user ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Account Verified ✅</span>
              </span>
            ) : (
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer"
              >
                <span>Google Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* ================= EXACT TWO BOXES SIDE BY SIDE ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* ================= LEFT BOX ================= */}
          <div
            style={{
              border: '2px solid #008000',
              padding: '20px',
              borderRadius: '16px',
              background: '#f0fff0',
            }}
            className="flex flex-col justify-between shadow-sm relative"
          >
            <div>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <b style={{ color: '#008000', fontSize: '1.25rem' }}>
                  ✓ Secure Payment via JazzCash
                </b>
                <span
                  style={{
                    background: '#e0ffe0',
                    padding: '4px 10px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: '#006400',
                    fontWeight: 'bold',
                    border: '1px solid #c2f0c2',
                  }}
                >
                  ● Active - Verified ✅
                </span>
              </div>

              {/* Service Selection Picker Inside Left Box */}
              <div className="my-3 bg-white/90 p-3.5 rounded-xl border border-emerald-200 text-xs">
                <label htmlFor="service-picker" className="font-bold text-emerald-950 block mb-1">
                  Pay for Service:
                </label>
                <select
                  id="service-picker"
                  value={currentService.id}
                  onChange={(e) => {
                    const found = services.find((s) => s.id === e.target.value);
                    if (found) {
                      onSelectService(found);
                      onNotify(`Updated to ${found.title} (${found.pricePkr})`);
                    }
                  }}
                  className="w-full p-2 bg-emerald-50 border border-emerald-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} — {s.pricePkr} ({s.priceUsd})
                    </option>
                  ))}
                </select>
                <div className="flex items-center justify-between text-[11px] text-emerald-800 mt-1.5 font-medium">
                  <span>Transfer Amount Required:</span>
                  <span className="font-bold text-sm text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {currentService.pricePkr}
                  </span>
                </div>
              </div>

              {/* Account Details Box */}
              <div className="my-3 text-sm text-slate-800 space-y-2 bg-white/70 p-4 rounded-xl border border-emerald-200/80">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span>
                    JazzCash: <b className="font-mono text-base text-slate-900 select-all">03267976XXX</b>
                  </span>
                  <button
                    onClick={handleCopyNumber}
                    style={{
                      background: 'black',
                      color: 'white',
                      border: 'none',
                      padding: '5px 14px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                    className="hover:bg-slate-800 transition-colors inline-flex items-center gap-1 active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-1 text-sm">
                  Title: <b className="text-slate-900 font-bold">KM</b>
                </div>
              </div>

              {/* Transaction ID input */}
              <div className="mb-4">
                <label htmlFor="trxid" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Enter JazzCash Transaction Details:
                </label>
                <input
                  id="trxid"
                  type="text"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder="Transaction ID Last 4 Digits Likhen"
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '8px',
                    border: '1px solid #718096',
                    backgroundColor: 'white',
                    color: '#1a202c',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                  className="focus:ring-2 focus:ring-emerald-500 focus:border-transparent select-text"
                />
                <span className="text-[11px] text-slate-600 mt-1 block">
                  JazzCash SMS se aakhri 4 digits ya transaction ID likhen
                </span>
              </div>

              {/* Unlock Button */}
              <button
                onClick={handleUnlockClick}
                style={{
                  width: '100%',
                  padding: '13px',
                  background: '#008000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  cursor: 'pointer',
                }}
                className="hover:bg-emerald-700 transition-all shadow-md active:scale-[0.98] inline-flex items-center justify-center gap-2"
              >
                <span>I Have Paid - Unlock 🔓</span>
              </button>
            </div>

            <div className="mt-5 pt-3 border-t border-emerald-200/60 flex items-center justify-between flex-wrap gap-2 text-slate-700">
              <span style={{ fontSize: '11px', fontWeight: 'bold' }}>
                🛡️ 100% Secure | ⚡ Instant Release | ✅ Verified
              </span>

              <button
                onClick={() => setShowQrModal(!showQrModal)}
                className="text-xs text-emerald-800 hover:text-emerald-950 underline font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{showQrModal ? 'QR Chupao' : 'JazzCash QR'}</span>
              </button>
            </div>

            {/* QR Code toggle view */}
            {showQrModal && (
              <div className="mt-3 p-3 bg-white border border-emerald-300 rounded-xl text-center">
                <div className="text-xs font-bold text-slate-800 mb-1">Scan & Pay via JazzCash App</div>
                <div className="inline-block p-2 bg-slate-900 rounded-lg">
                  <div className="w-28 h-28 bg-white p-1 rounded flex flex-col items-center justify-center">
                    <QrCode className="w-24 h-24 text-slate-900" />
                  </div>
                </div>
                <div className="text-[11px] font-mono font-bold text-slate-800 mt-1">
                  03267976823 (KM)
                </div>
              </div>
            )}
          </div>

          {/* ================= RIGHT BOX ================= */}
          <div
            style={{
              border: '2px solid #ddd',
              padding: '20px',
              borderRadius: '16px',
              background: '#f9f9f9',
              textAlign: 'center',
            }}
            className="flex flex-col justify-between shadow-sm"
          >
            <div>
              <b style={{ fontSize: '1.25rem', color: '#1a202c', display: 'block' }}>
                Download Files
              </b>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                Your deliverables are ready to download
              </p>

              {/* Dynamic state container as requested */}
              <div id="dlbox" className="space-y-4">
                {isPaid ? (
                  <div className="animate-in fade-in duration-300 space-y-4">
                    <div
                      style={{
                        background: '#d4edda',
                        padding: '14px',
                        borderRadius: '10px',
                        marginBottom: '12px',
                        color: 'green',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        border: '1px solid #c3e6cb',
                      }}
                    >
                      ✓ Download enabled after successful payment
                    </div>

                    <a
                      href={PAYMENT_CONFIG.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleDownloadClick}
                      style={{
                        display: 'block',
                        padding: '15px',
                        background: '#0d6efd',
                        color: 'white',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        boxShadow: '0 4px 12px rgba(13,110,253,0.3)',
                      }}
                      className="hover:bg-blue-700 transition-all hover:scale-[1.01] active:scale-[0.98]"
                    >
                      📁 Download Your Files Now
                    </a>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 text-left space-y-1">
                      <div className="font-bold text-slate-800">
                        Deliverables for: {currentService.title}
                      </div>
                      <div>• Clean Unwatermarked Source Files</div>
                      <div>• High-Resolution Export Packages (HD/4K)</div>
                      <div>• Commercial License & WhatsApp Support</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div
                      style={{
                        background: '#fff3cd',
                        padding: '18px 15px',
                        borderRadius: '10px',
                        border: '1px solid #ffeeba',
                        color: '#856404',
                      }}
                    >
                      <div className="font-bold text-base">🔒 Payment Required to Unlock</div>
                      <small className="text-xs block mt-1">
                        Pehle Left Side Se Payment Karke I Have Paid Dabao
                      </small>
                    </div>

                    <button
                      disabled
                      style={{
                        marginTop: '15px',
                        width: '100%',
                        padding: '14px',
                        background: 'grey',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '15px',
                        cursor: 'not-allowed',
                      }}
                    >
                      🔒 Download Files - Locked
                    </button>

                    <p className="text-xs text-slate-500 italic">
                      Jaise hi aap transaction ID daal kar "I Have Paid" daban ge, ye button blue ho kar unlock ho jaye ga.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Google Drive Cloud Delivery</span>
              {isPaid && (
                <button
                  onClick={onResetPayment}
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 underline cursor-pointer"
                  title="Test locking again"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Lock again (Reset)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
