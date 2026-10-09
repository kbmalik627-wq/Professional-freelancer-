import React, { useState } from 'react';
import { Mail, Copy, Check } from 'lucide-react';

interface EmailBannerProps {
  onNotify: (msg: string) => void;
}

export const EmailBanner: React.FC<EmailBannerProps> = ({ onNotify }) => {
  const [copied, setCopied] = useState(false);
  const email = 'kmfreelancer@gmail.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    onNotify('Email Copied to Clipboard!');
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 my-8">
      <div
        style={{
          textAlign: 'center',
          padding: '18px 20px',
          background: '#f5f5f5',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
        className="shadow-xs"
      >
        <p className="text-sm sm:text-base font-semibold text-slate-800 m-0 flex items-center justify-center flex-wrap gap-2">
          <span>📧 Email:</span>
          <a
            href={`mailto:${email}`}
            className="text-blue-600 hover:text-blue-800 font-bold underline select-text"
          >
            {email}
          </a>
          <button
            onClick={handleCopy}
            className="text-xs bg-white border border-slate-300 px-2.5 py-1 rounded-md text-slate-700 hover:bg-slate-100 transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
            title="Copy Email"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-500" />
                <span>Copy</span>
              </>
            )}
          </button>
        </p>
        <p className="text-xs text-slate-500 mt-2 mb-0">
          Direct client inbox for project orders, design briefs, and inquiries. (Alternative: <a href="mailto:khateebmalik50@gmail.com" className="text-slate-600 underline">khateebmalik50@gmail.com</a>)
        </p>
      </div>
    </div>
  );
};
