import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { DriveFileInfo } from '../types';

// Declare global types for Google Picker
declare global {
  interface Window {
    gapi?: any;
    google?: any;
  }
}

// 1. Safely initialize Firebase app if not already initialized
let app: any = null;
let authInstance: any = null;
try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  authInstance = getAuth(app);
} catch (e) {
  console.warn('Firebase init warning (running in safe mode):', e);
}
export const auth = authInstance;

// 2. Configure Google Provider with required Drive scopes
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/drive.metadata.readonly');
provider.addScope('https://www.googleapis.com/auth/drive.readonly');

// 3. In-memory token cache (Do not store in localStorage per security guidelines)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Initialize auth state listener safely
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  if (!auth) {
    if (onAuthFailure) onAuthFailure();
    return () => {};
  }
  try {
    return onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        if (cachedAccessToken) {
          if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
        } else if (!isSigningIn) {
          if (onAuthFailure) onAuthFailure();
        }
      } else {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    });
  } catch (err) {
    console.warn('onAuthStateChanged error:', err);
    if (onAuthFailure) onAuthFailure();
    return () => {};
  }
};

// Sign in with Google (Popup)
export const signInWithGoogleDrive = async (): Promise<{
  user: User;
  accessToken: string;
} | null> => {
  if (!auth) {
    throw new Error('Google Authentication service is not initialized.');
  }
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google Drive access token from sign-in');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Sign in with Google error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const setAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const logOutGoogle = async () => {
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
  }
  cachedAccessToken = null;
};

// 4. Fetch list of files directly from Google Drive API
export const fetchDriveFiles = async (
  accessToken: string
): Promise<DriveFileInfo[]> => {
  try {
    const response = await fetch(
      'https://www.googleapis.com/drive/v3/files?pageSize=50&fields=files(id,name,mimeType,size,webContentLink,webViewLink,iconLink,modifiedTime)&orderBy=modifiedTime desc',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err?.error?.message || 'Failed to fetch files from Google Drive');
    }

    const data = await response.json();
    return (data.files || []).map((f: any) => ({
      id: f.id,
      name: f.name,
      mimeType: f.mimeType,
      size: f.size ? formatBytes(Number(f.size)) : 'Cloud Doc',
      webViewLink: f.webViewLink,
      webContentLink: f.webContentLink,
      iconLink: f.iconLink,
      modifiedTime: f.modifiedTime,
    }));
  } catch (err) {
    console.error('Error fetching Drive files:', err);
    throw err;
  }
};

// 5. Open Google Picker Widget
export const launchGooglePicker = (
  accessToken: string,
  onFileSelected: (file: DriveFileInfo) => void,
  onError: (msg: string) => void
) => {
  if (typeof window === 'undefined') return;

  const runPicker = () => {
    if (!window.google?.picker) {
      onError('Google Picker API is still loading. Please try again in 2 seconds.');
      return;
    }

    try {
      const pickerOrigin =
        window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0
          ? window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1]
          : window.location.origin;

      const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS)
        .setIncludeFolders(false)
        .setSelectFolderEnabled(false);

      const picker = new window.google.picker.PickerBuilder()
        .addView(view)
        .setOAuthToken(accessToken)
        .setCallback((data: any) => {
          if (data.action === window.google.picker.Action.PICKED) {
            const doc = data.docs[0];
            if (doc) {
              const fileInfo: DriveFileInfo = {
                id: doc.id,
                name: doc.name,
                mimeType: doc.mimeType || 'application/octet-stream',
                size: doc.sizeBytes ? formatBytes(Number(doc.sizeBytes)) : 'Ready',
                webViewLink: doc.url,
                webContentLink: `https://drive.google.com/uc?export=download&id=${doc.id}`,
              };
              onFileSelected(fileInfo);
            }
          }
        })
        .setOrigin(pickerOrigin)
        .build();

      picker.setVisible(true);
    } catch (e: any) {
      console.warn('Picker error:', e);
      onError(e?.message || 'Could not launch Google Picker.');
    }
  };

  // If gapi is loaded, load picker
  if (window.gapi) {
    window.gapi.load('picker', {
      callback: runPicker,
      onerror: () => onError('Failed to load Google Picker library.'),
    });
  } else {
    onError('Google API client is not initialized.');
  }
};

// 6. Download the ORIGINAL file directly from Google Drive API (fixing 0.61 KB error)
export const downloadOriginalDriveFile = async (
  file: DriveFileInfo,
  accessToken?: string | null
): Promise<{ success: boolean; error?: string }> => {
  try {
    const token = accessToken || cachedAccessToken;

    if (token) {
      // Check if it's a native Google Workspace file that needs exporting
      let downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;

      if (file.mimeType.includes('google-apps.document')) {
        downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=application/pdf`;
      } else if (file.mimeType.includes('google-apps.spreadsheet')) {
        downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=application/pdf`;
      } else if (file.mimeType.includes('google-apps.presentation')) {
        downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=application/pdf`;
      }

      const res = await fetch(downloadUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const blob = await res.blob();
        // Check if blob is valid and not empty
        if (blob.size > 0) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          // Retain original file extension or fallback
          let fileName = file.name;
          if (file.mimeType.includes('google-apps') && !fileName.toLowerCase().endsWith('.pdf')) {
            fileName = `${fileName}.pdf`;
          }
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(url), 2000);
          return { success: true };
        }
      }
    }

    // Direct download link fallback
    const directUrl =
      file.webContentLink ||
      `https://drive.google.com/uc?export=download&id=${file.id}`;
    window.open(directUrl, '_blank', 'noopener,noreferrer');
    return { success: true };
  } catch (err: any) {
    console.error('Download error:', err);
    // Final fallback: open web view link
    if (file.webViewLink) {
      window.open(file.webViewLink, '_blank', 'noopener,noreferrer');
      return { success: true };
    }
    return { success: false, error: err?.message || 'Could not download file' };
  }
};

// Helper: Format byte counts nicely
export function formatBytes(bytes: number, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
