import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  KeyRound,
  ArrowLeft,
  Clock,
  Trash2,
  Lock,
  LogOut,
  ExternalLink,
  MessageCircle,
  PlusCircle,
  Check
} from 'lucide-react';
import { PaymentSubmission } from '../types';

interface AdminPanelProps {
  pendingPayments: PaymentSubmission[];
  approvedTIDs: string[];
  onApprove: (tid: string) => void;
  onReject: (tid: string) => void;
  onManualAddTID: (tid: string) => void;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  pendingPayments,
  approvedTIDs,
  onApprove,
  onReject,
  onManualAddTID,
  onClose,
  onNotify,
}) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newManualTid, setNewManualTid] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'all'>('pending');

  const adminPassSecret = (import.meta.env.VITE_ADMIN_PASS || '786786').toString();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === adminPassSecret) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setErrorMsg('');
      onNotify('Admin Login Successful');
    } else {
      setErrorMsg('Wrong Password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    onNotify('Admin logged out.');
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newManualTid.trim();
    if (clean.length < 6) {
      onNotify('TID must be at least 6 digits');
      return;
    }
    onManualAddTID(clean);
    setNewManualTid('');
  };

  const pendingList = pendingPayments.filter((p) => p.status === 'pending');
  const rejectedList = pendingPayments.filter((p) => p.status === 'rejected');

  // Password Login Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 text-center animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Admin Portal Login
          </h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Enter admin password to review JazzCash payment screenshots and approve client downloads.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label htmlFor="admin-pw" className="block text-xs font-bold text-slate-700 mb-1">
                Admin Password *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-pw"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Enter Admin Password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 select-text"
                  autoComplete="current-password"
                />
              </div>
              {errorMsg && (
                <span className="text-xs font-bold text-rose-600 mt-1.5 block">
                  {errorMsg}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              Sign In to Admin Panel
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              ← Back to Client Website
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 overflow-y-auto flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-20 bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm">
            PF
          </div>
          <div>
            <h1 className="text-base font-extrabold flex items-center gap-2">
              <span>Admin Verification Panel</span>
              <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                KM Admin
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              JazzCash 0326-7976823 Payment Approval Gateway
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Website View</span>
          </button>
          <button
            onClick={handleLogout}
            title="Logout Admin"
            className="p-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* KPI Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
              Pending Approvals
            </span>
            <span className="text-2xl font-black text-amber-600 mt-1 block tabular-nums">
              {pendingList.length}
            </span>
            <span className="text-[11px] text-slate-400">Awaiting your check</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
              Approved TIDs
            </span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block tabular-nums">
              {approvedTIDs.length}
            </span>
            <span className="text-[11px] text-slate-400">Unlocked client files</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
              Total Submissions
            </span>
            <span className="text-2xl font-black text-blue-600 mt-1 block tabular-nums">
              {pendingPayments.length}
            </span>
            <span className="text-[11px] text-slate-400">Recorded in system</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
              Deliverable File
            </span>
            <span className="text-sm font-bold text-slate-900 mt-1 block truncate">
              Original Drive File
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              1H3O0YemVMw...
            </span>
          </div>
        </div>

        {/* Tab Navigation + Quick Add */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Pending Verification ({pendingList.length})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'approved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Approved TIDs ({approvedTIDs.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Submissions ({pendingPayments.length})
            </button>
          </div>

          {/* Quick Manual Whitelist Form */}
          <form onSubmit={handleAddManual} className="flex items-center gap-2">
            <input
              type="text"
              value={newManualTid}
              onChange={(e) => setNewManualTid(e.target.value)}
              placeholder="Manual TID Whitelist"
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 font-mono select-text"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Approve TID</span>
            </button>
          </form>
        </div>

        {/* TAB CONTENT: PENDING */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingList.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900">
                  No Pending Payments
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  All customer submissions have been processed. New payments submitted by clients will appear here instantly.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border-2 border-amber-300 p-5 shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                            Pending Approval
                          </span>
                          <span className="text-xs text-slate-400">
                            {item.date}
                          </span>
                        </div>
                        <div className="mt-2 text-sm font-bold text-slate-900">
                          TID: <span className="font-mono text-base font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{item.tid}</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          Service: <strong>{item.serviceTitle}</strong> — Amount: <strong className="text-emerald-700">{item.amountPkr}</strong>
                        </div>
                      </div>

                      {/* Screenshot thumbnail */}
                      <button
                        onClick={() => setPreviewImage(item.screenshotBase64)}
                        title="Click to zoom screenshot"
                        className="relative group w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-300 shrink-0 bg-slate-100 cursor-pointer shadow-xs"
                      >
                        <img
                          src={item.screenshotBase64}
                          alt="JazzCash Screenshot"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold">
                          <Eye className="w-4 h-4 mr-0.5" />
                          <span>View</span>
                        </div>
                      </button>
                    </div>

                    {/* Screenshot Preview Button for Mobile */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setPreviewImage(item.screenshotBase64)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Screenshot Receipt</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {/* Reject button */}
                        <button
                          onClick={() => {
                            onReject(item.tid);
                            onNotify(`Payment TID ${item.tid} rejected`);
                          }}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition-colors cursor-pointer"
                        >
                          Reject
                        </button>

                        {/* Approve button */}
                        <button
                          onClick={() => {
                            onApprove(item.tid);
                            onNotify(`Payment TID ${item.tid} approved! Download unlocked for client.`);
                          }}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve & Unlock</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: APPROVED TIDs */}
        {activeTab === 'approved' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Approved Whitelist ({approvedTIDs.length})
              </h3>
              <span className="text-xs text-slate-500">
                Any client with these TIDs can download the original file directly.
              </span>
            </div>

            {approvedTIDs.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No approved TIDs yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {approvedTIDs.map((tid) => (
                  <div
                    key={tid}
                    className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-mono font-bold text-slate-900">{tid}</span>
                    </div>
                    <button
                      onClick={() => {
                        onReject(tid);
                        onNotify(`Revoked TID ${tid}`);
                      }}
                      title="Revoke access"
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: ALL SUBMISSIONS */}
        {activeTab === 'all' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              All Payment Submissions History ({pendingPayments.length})
            </h3>
            {pendingPayments.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No history yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold">
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5">TID</th>
                      <th className="py-2.5">Service</th>
                      <th className="py-2.5">Amount</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingPayments.map((p) => (
                      <tr key={p.id}>
                        <td className="py-2.5 text-slate-500">{p.date}</td>
                        <td className="py-2.5 font-mono font-bold text-slate-900">{p.tid}</td>
                        <td className="py-2.5 text-slate-700">{p.serviceTitle}</td>
                        <td className="py-2.5 font-bold text-emerald-700">{p.amountPkr}</td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.status === 'pending'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {p.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <button
                            onClick={() => setPreviewImage(p.screenshotBase64)}
                            className="text-blue-600 hover:underline font-bold"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Screenshot Zoom Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-4 relative shadow-2xl space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-slate-900">
                JazzCash Payment Receipt Inspection
              </span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-2 flex items-center justify-center">
              <img
                src={previewImage}
                alt="Receipt Full View"
                className="max-w-full h-auto rounded-xl shadow-xs"
              />
            </div>
            <div className="text-center pt-1">
              <button
                onClick={() => setPreviewImage(null)}
                className="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
