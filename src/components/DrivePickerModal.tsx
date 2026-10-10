import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  FolderOpen,
  Search,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  HardDrive,
  DownloadCloud,
  FileArchive,
  FileCode,
  FileVideo,
  FileImage,
  File
} from 'lucide-react';
import { DriveFileInfo } from '../types';
import {
  fetchDriveFiles,
  launchGooglePicker,
  signInWithGoogleDrive
} from '../services/googleDriveService';

interface DrivePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelected: (file: DriveFileInfo) => void;
  currentSelectedFile: DriveFileInfo | null;
  accessToken: string | null;
  onTokenAcquired: (token: string, user: any) => void;
  onNotify: (msg: string) => void;
}

export const DrivePickerModal: React.FC<DrivePickerModalProps> = ({
  isOpen,
  onClose,
  onFileSelected,
  currentSelectedFile,
  accessToken,
  onTokenAcquired,
  onNotify,
}) => {
  const [files, setFiles] = useState<DriveFileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Load files when token is present
  useEffect(() => {
    if (isOpen && accessToken) {
      loadFiles(accessToken);
    }
  }, [isOpen, accessToken]);

  const loadFiles = async (token: string) => {
    setLoading(true);
    try {
      const driveFiles = await fetchDriveFiles(token);
      setFiles(driveFiles);
    } catch (err: any) {
      console.warn('Drive listing warning:', err);
      onNotify('Could not load files list automatically. You can launch Google Picker.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setAuthLoading(true);
    try {
      const res = await signInWithGoogleDrive();
      if (res?.accessToken) {
        onTokenAcquired(res.accessToken, res.user);
        onNotify('Google Drive Connected Successfully!');
        loadFiles(res.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      onNotify('Google Sign-in failed: ' + (err?.message || 'Try again'));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLaunchPicker = () => {
    if (!accessToken) {
      handleSignIn();
      return;
    }
    launchGooglePicker(
      accessToken,
      (pickedFile) => {
        onFileSelected(pickedFile);
        onNotify(`Selected from Drive: "${pickedFile.name}"`);
        onClose();
      },
      (err) => {
        onNotify(err);
      }
    );
  };

  if (!isOpen) return null;

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('image')) return <FileImage className="w-5 h-5 text-blue-500" />;
    if (mimeType.includes('video')) return <FileVideo className="w-5 h-5 text-purple-500" />;
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar'))
      return <FileArchive className="w-5 h-5 text-amber-500" />;
    if (mimeType.includes('javascript') || mimeType.includes('json') || mimeType.includes('typescript'))
      return <FileCode className="w-5 h-5 text-emerald-500" />;
    if (mimeType.includes('pdf') || mimeType.includes('document'))
      return <FileText className="w-5 h-5 text-rose-500" />;
    return <File className="w-5 h-5 text-slate-500" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Google Drive File Selector
              </h3>
              <p className="text-xs text-slate-500">
                Select the real file from your Drive that unlocks upon verified JazzCash payment.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Selected File Banner */}
        {currentSelectedFile && (
          <div className="my-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="truncate">
                <span className="text-slate-500">Currently Linked File:</span>{' '}
                <strong className="text-emerald-950 font-bold">{currentSelectedFile.name}</strong>{' '}
                <span className="text-slate-500 font-mono">({currentSelectedFile.size})</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200 shrink-0">
              Active Deliverable
            </span>
          </div>
        )}

        {/* Action Row: Google Picker Button & Refresh */}
        <div className="flex flex-wrap items-center justify-between gap-3 my-3">
          <button
            onClick={handleLaunchPicker}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Launch Official Google Picker</span>
          </button>

          {accessToken && (
            <button
              onClick={() => loadFiles(accessToken)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Files</span>
            </button>
          )}
        </div>

        {/* If no access token, show Sign-In state */}
        {!accessToken ? (
          <div className="my-6 p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 mx-auto flex items-center justify-center shadow-xs">
              <DownloadCloud className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Connect Google Drive Account
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Authorize Google Drive access so you can pick and link your original deliverables for client downloads.
              </p>
            </div>
            <button
              onClick={handleSignIn}
              disabled={authLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <HardDrive className="w-4 h-4 text-blue-400" />
              <span>{authLoading ? 'Connecting...' : 'Authorize Google Drive Access'}</span>
            </button>
          </div>
        ) : (
          <>
            {/* Search filter */}
            <div className="relative my-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search files in your Google Drive..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white select-text"
              />
            </div>

            {/* Files List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-2xl bg-white max-h-72 my-2">
              {loading ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-500" />
                  <span>Loading files from your Google Drive...</span>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  <FolderOpen className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                  <span>No matching files found in Drive.</span>
                </div>
              ) : (
                filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="shrink-0">{getFileIcon(file.mimeType)}</div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600">
                          {file.name}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2">
                          <span>{file.size}</span>
                          <span>•</span>
                          <span className="truncate">{file.mimeType.split('/').pop()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          onFileSelected(file);
                          onNotify(`Linked: "${file.name}" (${file.size})`);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Select File
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Files download via authentic Google Drive binary media stream.</span>
          <button
            onClick={onClose}
            className="text-xs text-slate-600 hover:text-slate-900 font-semibold underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
