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
  HardDrive,
  FolderOpen,
  Upload,
  Image as ImageIcon,
  Clock,
  Eye,
  X,
  FileCheck,
  KeyRound
} from 'lucide-react';
import { PAYMENT_CONFIG } from '../data/servicesData';
import { ServiceItem, GoogleUser, DriveFileInfo, PaymentSubmission } from '../types';
import { downloadOriginalDriveFile } from '../services/googleDriveService';

interface PaymentAndDownloadProps {
  selectedService: ServiceItem | null;
  services: ServiceItem[];
  onSelectService: (service: ServiceItem) => void;
  onNotify: (message: string) => void;
  user: GoogleUser | null;
  driveFile: DriveFileInfo | null;
  onOpenDrivePicker: () => void;
  accessToken: string | null;
  pendingPayments: PaymentSubmission[];
  approvedTIDs: string[];
  onNewPaymentSubmitted: (submission: PaymentSubmission) => void;
  onOpenAdmin: () => void;
}

export const PaymentAndDownload: React.FC<PaymentAndDownloadProps> = ({
  selectedService,
  services,
  onSelectService,
  onNotify,
  driveFile,
  onOpenDrivePicker,
  accessToken,
  pendingPayments,
  approvedTIDs,
  onNewPaymentSubmitted,
  onOpenAdmin,
}) => {
  const [copied, setCopied] = useState(false);
  const [tidInput, setTidInput] = useState('');
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const [screenshotFileName, setScreenshotFileName] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [clientTidCheck, setClientTidCheck] = useState<string>(() => {
    return localStorage.getItem('my_submitted_tid') || '';
  });
  const [isCheckingTid, setIsCheckingTid] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('0326-7976823');
    setCopied(true);
    onNotify('Number Copy! (0326-7976823 copied to clipboard)');
    setTimeout(() => setCopied(false), 2500);
  };

  // Compress uploaded screenshot so it fits cleanly in localStorage without quota issues
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 900;
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onNotify('Please upload an image file (PNG, JPG, Screenshot)');
      return;
    }

    setUploadLoading(true);
    try {
      const base64 = await compressImage(file);
      setScreenshotBase64(base64);
      setScreenshotFileName(file.name);
      onNotify('Screenshot uploaded successfully!');
    } catch (err) {
      console.error(err);
      onNotify('Could not read image file. Please try another screenshot.');
    } finally {
      setUploadLoading(false);
    }
  };

  // 1. CLIENT FLOW SUBMISSION
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTid = tidInput.trim();

    // a) Validate TID min 6 digits
    if (cleanTid.length < 6) {
      onNotify('Transaction ID must be at least 6 digits!');
      return;
    }

    // b) Validate screenshot uploaded
    if (!screenshotBase64) {
      onNotify('JazzCash Payment Screenshot is required! Please upload image.');
      return;
    }

    // Check duplicate TID: If TID already in pending or approved list
    const isAlreadyPending = pendingPayments.some((p) => p.tid.toLowerCase() === cleanTid.toLowerCase());
    const isAlreadyApproved = approvedTIDs.some((t) => t.toLowerCase() === cleanTid.toLowerCase());

    if (isAlreadyPending || isAlreadyApproved) {
      onNotify('This TID already used. Please enter your valid new Transaction ID.');
      return;
    }

    // Create payment submission
    const currentSvc = selectedService || services[2] || services[0];
    const newSubmission: PaymentSubmission = {
      id: `pay-${Date.now()}`,
      tid: cleanTid,
      screenshotBase64,
      date: new Date().toLocaleString(),
      timestamp: Date.now(),
      serviceTitle: currentSvc.title,
      amountPkr: currentSvc.pricePkr || '300 Rs',
      status: 'pending',
    };

    // Save and update
    onNewPaymentSubmitted(newSubmission);
    setClientTidCheck(cleanTid);
    localStorage.setItem('my_submitted_tid', cleanTid);

    // Auto send WhatsApp to admin with specified text
    const waText = encodeURIComponent(
      `NEW PAYMENT\nTID: ${cleanTid}\nAmount: ${currentSvc.pricePkr || '300 Rs'}\nFile: JazzCash & Approve in Admin Panel`
    );
    const waUrl = `https://wa.me/923267976823?text=${waText}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // Notify user with required text
    onNotify('⏳ Payment Under Verification - Admin will approve in 5-10 mins. You will get WhatsApp update.');

    // Clear form inputs
    setTidInput('');
    setScreenshotBase64(null);
    setScreenshotFileName('');
  };

  // Check if current user's TID is approved or pending
  const activeTid = clientTidCheck.trim();
  const isApproved = activeTid ? approvedTIDs.includes(activeTid) : false;
  const pendingRecord = activeTid ? pendingPayments.find((p) => p.tid === activeTid) : null;
  const isPending = pendingRecord && pendingRecord.status === 'pending';

  // 3. CLIENT DOWNLOAD CHECK
  const handleDownloadOriginalFile = async () => {
    if (!isApproved) {
      onNotify('Payment Under Verification - Awaiting Admin Approval.');
      return;
    }

    setDownloading(true);
    onNotify('Downloading original file from Google Drive...');

    try {
      const activeFile: DriveFileInfo = driveFile || {
        id: '1H3O0YemVMw-FzJyLxKpUzLYrGYGpZI27',
        name: 'Deliverables_Package.zip',
        mimeType: 'application/zip',
        webContentLink: 'https://drive.google.com/uc?export=download&id=1H3O0YemVMw-FzJyLxKpUzLYrGYGpZI27',
      };

      const result = await downloadOriginalDriveFile(activeFile, accessToken);
      if (result.success) {
        onNotify(`Original file "${activeFile.name}" downloaded successfully!`);
      } else {
        window.open('https://drive.google.com/uc?export=download&id=1H3O0YemVMw-FzJyLxKpUzLYrGYGpZI27', '_blank');
      }
    } catch (err: any) {
      console.error(err);
      window.open('https://drive.google.com/uc?export=download&id=1H3O0YemVMw-FzJyLxKpUzLYrGYGpZI27', '_blank');
    } finally {
      setDownloading(false);
    }
  };

  // Pre-selected service or default 300 Rs
  const currentService = selectedService || services[2] || services[0];

  return (
    <section id="payment-download" className="py-14 lg:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secure Admin-Verified Payment System</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            JazzCash Payment & Verified Download
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Transfer fee to JazzCash (0326-7976823), upload your screenshot with TID (min 6 digits). Admin verifies in 5-10 minutes to unlock original Google Drive files.
          </p>

          {/* Service Selector Dropdown */}
          <div className="mt-4 relative inline-block text-left" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center justify-between gap-3 px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-xl text-xs sm:text-sm font-semibold text-blue-900 shadow-xs transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Selected Service:</span>
                <span className="font-bold text-blue-700">{currentService.title}</span>
                <span className="text-slate-400">—</span>
                <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  {currentService.pricePkr || '300 Rs'} ({currentService.priceUsd})
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-blue-600 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200 py-2 z-50">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Choose Service
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
                          ? 'bg-blue-50 text-blue-900'
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
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= TWO BOXES SIDE BY SIDE ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* ================= LEFT BOX (PAYMENT & SUBMISSION) ================= */}
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

              {/* Account Details Box - 0326-7976823, KM, 300 Rs */}
              <div className="my-3 text-sm text-slate-800 space-y-2 bg-white/80 p-4 rounded-xl border border-emerald-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span>
                    JazzCash: <b className="font-mono text-base text-slate-900 select-all">0326-7976823</b>
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

                <div className="pt-1 text-sm flex items-center justify-between">
                  <span>Title: <b className="text-slate-900 font-bold">KM</b></span>
                  <span>Amount: <b className="text-emerald-700 font-bold">{currentService.pricePkr || '300 Rs'}</b></span>
                </div>
              </div>

              {/* Form: TID + Screenshot Upload */}
              <form onSubmit={handleSubmitPayment} className="space-y-3.5">
                {/* Field 1: Transaction ID (min 6 digits) */}
                <div>
                  <label htmlFor="tid-input" className="block text-xs font-bold text-slate-700 mb-1">
                    a) Transaction ID (Min 6 Digits) *
                  </label>
                  <input
                    id="tid-input"
                    type="text"
                    required
                    value={tidInput}
                    onChange={(e) => setTidInput(e.target.value)}
                    placeholder="Enter JazzCash TID (min 6 digits e.g. 1049283)"
                    minLength={6}
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
                    className="focus:ring-2 focus:ring-emerald-500 font-mono select-text"
                  />
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    JazzCash SMS ya App se Transaction ID likhen
                  </span>
                </div>

                {/* Field 2: Upload Screenshot (Image File Required) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    b) Upload JazzCash Screenshot (Required) *
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {screenshotBase64 ? (
                    <div className="p-3 bg-white rounded-xl border-2 border-emerald-400 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <img
                          src={screenshotBase64}
                          alt="Screenshot Preview"
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                        />
                        <div className="overflow-hidden">
                          <span className="text-xs font-bold text-slate-800 block truncate">
                            {screenshotFileName || 'Payment_Receipt.jpg'}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>Screenshot Attached</span>
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setScreenshotBase64(null);
                          setScreenshotFileName('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={uploadLoading}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-4 border-2 border-dashed border-emerald-400 hover:border-emerald-600 bg-white/70 hover:bg-white rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5"
                    >
                      <Upload className="w-6 h-6 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-950">
                        {uploadLoading ? 'Uploading image...' : 'Click to Upload JazzCash Screenshot'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Camera se picture len ya Gallery se select karain
                      </span>
                    </button>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
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
                  <Clock className="w-4 h-4" />
                  <span>Submit for Verification ⏳</span>
                </button>
              </form>
            </div>

            <div className="mt-5 pt-3 border-t border-emerald-200/60 flex items-center justify-between flex-wrap gap-2 text-slate-700">
              <span style={{ fontSize: '11px', fontWeight: 'bold' }}>
                🛡️ 100% Secure | ⚡ Manual Review | ✅ Verified
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowQrModal(!showQrModal)}
                  className="text-xs text-emerald-800 hover:text-emerald-950 underline font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>{showQrModal ? 'QR Chupao' : 'JazzCash QR'}</span>
                </button>

                <button
                  onClick={onOpenAdmin}
                  className="text-xs text-slate-500 hover:text-slate-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
                  title="Admin Dashboard Login"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {/* QR Code toggle view */}
            {showQrModal && (
              <div className="mt-3 p-3 bg-white border border-emerald-300 rounded-xl text-center animate-in fade-in">
                <div className="text-xs font-bold text-slate-800 mb-1">Scan & Pay via JazzCash App</div>
                <div className="inline-block p-2 bg-slate-900 rounded-lg">
                  <div className="w-28 h-28 bg-white p-1 rounded flex flex-col items-center justify-center">
                    <QrCode className="w-24 h-24 text-slate-900" />
                  </div>
                </div>
                <div className="text-[11px] font-mono font-bold text-slate-800 mt-1">
                  0326-7976823 (KM)
                </div>
              </div>
            )}
          </div>

          {/* ================= RIGHT BOX (DOWNLOAD & STATUS CHECK) ================= */}
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
                Original file unlocks after admin verification
              </p>

              {/* Dynamic State Container */}
              <div id="dlbox" className="space-y-4">
                {/* CASE 1: APPROVED */}
                {isApproved ? (
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

                    {/* Unlocked Big Blue Download Button */}
                    <button
                      onClick={handleDownloadOriginalFile}
                      disabled={downloading}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '15px',
                        background: '#0d6efd',
                        color: 'white',
                        borderRadius: '10px',
                        border: 'none',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        boxShadow: '0 4px 12px rgba(13,110,253,0.3)',
                        cursor: 'pointer',
                      }}
                      className="hover:bg-blue-700 transition-all hover:scale-[1.01] active:scale-[0.98] inline-flex items-center justify-center gap-2"
                    >
                      <Download className={`w-5 h-5 ${downloading ? 'animate-bounce' : ''}`} />
                      <span>
                        {downloading
                          ? 'Downloading Original File...'
                          : '📁 Download Your Files Now'}
                      </span>
                    </button>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 text-left space-y-1">
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <span>Original Drive File:</span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Approved ✅
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-700 font-mono truncate">
                        ID: 1H3O0YemVMw-FzJyLxKpUzLYrGYGpZI27
                      </div>
                      <div className="text-[11px] text-slate-500">
                        • Verified direct Google Drive stream (No HTML, No 0.61 KB errors).
                      </div>
                    </div>
                  </div>
                ) : isPending ? (
                  /* CASE 2: PENDING ADMIN APPROVAL */
                  <div className="space-y-4 animate-in fade-in">
                    <div
                      style={{
                        background: '#fff3cd',
                        padding: '16px 14px',
                        borderRadius: '10px',
                        border: '1px solid #ffeeba',
                        color: '#856404',
                      }}
                    >
                      <div className="font-bold text-sm sm:text-base flex items-center justify-center gap-2">
                        <Clock className="w-5 h-5 text-amber-600 animate-spin" />
                        <span>⏳ Payment Under Verification</span>
                      </div>
                      <p className="text-xs mt-2 leading-relaxed text-amber-950 font-medium">
                        Admin will approve in 5-10 mins. You will get WhatsApp update.
                      </p>
                      <div className="mt-2 text-[11px] font-mono text-amber-800">
                        Submitted TID: <strong>{activeTid}</strong>
                      </div>
                    </div>

                    <button
                      disabled
                      style={{
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
                      🔒 Download Locked - Awaiting Admin Approval
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const check = localStorage.getItem('approvedTIDs');
                        const list = check ? JSON.parse(check) : [];
                        if (list.includes(activeTid)) {
                          onNotify('Payment Approved! Download is now unlocked.');
                          window.location.reload();
                        } else {
                          onNotify('Status check: Payment is still under review by Admin.');
                        }
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 underline font-semibold cursor-pointer"
                    >
                      🔄 Click to re-check approval status
                    </button>
                  </div>
                ) : (
                  /* CASE 3: NO PAYMENT SUBMITTED YET */
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
                      <small className="text-xs block mt-1.5 leading-relaxed">
                        Pehle Left Side se JazzCash <strong>0326-7976823</strong> par <strong>{currentService.pricePkr || '300 Rs'}</strong> bhej kar TID aur Screenshot upload karain.
                      </small>
                    </div>

                    <button
                      disabled
                      style={{
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

                    {/* Manual TID Checker for returning users */}
                    <div className="pt-2 text-left bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-700 block mb-1">
                        Pehle se paid hai? TID enter kar ke check karain:
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={clientTidCheck}
                          onChange={(e) => setClientTidCheck(e.target.value)}
                          placeholder="Enter your 6-digit TID"
                          className="flex-1 px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg select-text font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!clientTidCheck) return;
                            localStorage.setItem('my_submitted_tid', clientTidCheck);
                            if (approvedTIDs.includes(clientTidCheck.trim())) {
                              onNotify('TID Verified & Approved! Download unlocked.');
                            } else {
                              onNotify('TID not yet approved or not found in system.');
                            }
                          }}
                          className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Check
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                <span>Google Drive Vault: 1H3O0YemVMw...</span>
              </span>

              <button
                onClick={onOpenAdmin}
                className="text-xs text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer"
              >
                Admin Panel (/admin)
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
