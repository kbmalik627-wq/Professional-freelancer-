import React, { useState, useEffect } from 'react';
import { Mail, Phone, MessageCircle, Clock } from 'lucide-react';
import { PAYMENT_CONFIG } from '../data/servicesData';
import { GoogleUser } from '../types';

interface ContactSectionProps {
  user: GoogleUser | null;
  onNotify: (msg: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ user, onNotify }) => {
  const [service, setService] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const [statusText, setStatusText] = useState('');

  // Auto fill name if Google user logged in
  useEffect(() => {
    if (user && !name) {
      setName(user.name);
    }
  }, [user]);

  const sendToWhatsApp = () => {
    if (!service || !name || !msg) {
      onNotify('Please Sare Boxes Bharo! Service, Naam aur Message Zaruri Hai');
      return;
    }

    const finalMsg = `Salam KM Bhai!\n\n🔹 Service: ${service}\n👤 Naam: ${name}\n📱 Number: ${phone || 'Not provided'}\n💬 Message: ${msg}\n\nWebsite se contact kiya hai.`;
    const url = `https://wa.me/923267976823?text=${encodeURIComponent(finalMsg)}`;

    setStatusText('WhatsApp Khul Raha Hai...');
    onNotify('WhatsApp Khul Raha Hai...');

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Direct WhatsApp Inquiry</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact Us & Order Directly
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Select your desired service, enter your details, and send directly to WhatsApp for an instant response.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Freelancer Direct Info */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-900">
                Contact Information
              </h3>

              {/* WhatsApp direct card */}
              <a
                href={`https://wa.me/${PAYMENT_CONFIG.adminWhatsApp}?text=Salam%20KM%20Bhai`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3.5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-emerald-950">
                      WhatsApp Instant Chat
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.2 rounded-full">
                      Online
                    </span>
                  </div>
                  <span className="text-base font-black font-mono text-emerald-800 block mt-0.5">
                    {PAYMENT_CONFIG.accountNumber}
                  </span>
                  <span className="text-xs text-emerald-700">
                    Response time: 10 - 15 minutes
                  </span>
                </div>
              </a>

              {/* Email */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                    Official Email
                  </span>
                  <a
                    href="mailto:kmfreelancer@gmail.com"
                    className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors select-text"
                  >
                    kmfreelancer@gmail.com
                  </a>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    For project files & formal agreements
                  </span>
                </div>
              </div>

              {/* JazzCash payment info summary */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="p-2.5 rounded-xl bg-slate-900 text-white shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                    JazzCash Account
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-900 block">
                    {PAYMENT_CONFIG.accountNumber} (KM)
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    Secure local payments with instant access
                  </span>
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-2.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Available 7 Days a Week: 9:00 AM – 11:00 PM (PKT)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Exact Requested Form Card */}
          <div className="lg:col-span-7">
            <div
              style={{
                maxWidth: '500px',
                margin: 'auto',
                background: 'white',
                padding: '24px',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #eee',
              }}
            >
              <h3
                style={{
                  textAlign: 'center',
                  marginTop: 0,
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#1a202c',
                  marginBottom: '16px',
                }}
              >
                📩 Contact Us / Order Now
              </h3>

              {user && (
                <div className="mb-3 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex items-center justify-between">
                  <span>Logged in as: <strong>{user.name}</strong></span>
                  <span className="text-emerald-700 font-bold">Google Verified</span>
                </div>
              )}

              {/* 1. Select Service */}
              <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#2d3748', display: 'block' }}>
                Select Service *
              </label>
              <select
                id="service"
                value={service}
                onChange={(e) => setService(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  margin: '5px 0 15px 0',
                  backgroundColor: 'white',
                  fontSize: '14px',
                  color: '#1a202c',
                  outline: 'none',
                }}
                className="focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">-- Service Select Karo --</option>
                <option value="Graphic Designing">🎨 Graphic Designing - 300 Rs</option>
                <option value="Video Editing">🎬 Video Editing - 700 Rs</option>
                <option value="SEO Optimization">🚀 SEO Optimization - 600 Rs</option>
                <option value="Social Media Management">📱 Social Media Management - 800 Rs</option>
                <option value="Notes / Projects">📚 Notes / Projects / Assignments</option>
                <option value="Other">Other - Kuch Aur</option>
              </select>

              {/* 2. Aap Ka Naam */}
              <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#2d3748', display: 'block' }}>
                Aap Ka Naam *
              </label>
              <input
                id="cname"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Apna Naam Likhen"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  margin: '5px 0 15px 0',
                  backgroundColor: 'white',
                  fontSize: '14px',
                  color: '#1a202c',
                  outline: 'none',
                }}
                className="focus:ring-2 focus:ring-emerald-500 focus:border-transparent select-text"
              />

              {/* 3. WhatsApp Number */}
              <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#2d3748', display: 'block' }}>
                WhatsApp Number *
              </label>
              <input
                id="cphone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03XX-XXXXXXX"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  margin: '5px 0 15px 0',
                  backgroundColor: 'white',
                  fontSize: '14px',
                  color: '#1a202c',
                  outline: 'none',
                }}
                className="focus:ring-2 focus:ring-emerald-500 focus:border-transparent select-text"
              />

              {/* 4. Message Likhen */}
              <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#2d3748', display: 'block' }}>
                Message Likhen *
              </label>
              <textarea
                id="cmsg"
                rows={4}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Mujhe kis cheez me help chahiye? Detail likhen..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  margin: '5px 0 15px 0',
                  backgroundColor: 'white',
                  fontSize: '14px',
                  color: '#1a202c',
                  outline: 'none',
                }}
                className="focus:ring-2 focus:ring-emerald-500 focus:border-transparent select-text"
              />

              {/* Submit Button */}
              <button
                type="button"
                onClick={sendToWhatsApp}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#25D366',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                }}
                className="hover:bg-emerald-600 transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2"
              >
                <span>💬 WhatsApp Par Bhejo</span>
              </button>

              <p
                id="status"
                style={{
                  textAlign: 'center',
                  fontSize: '12px',
                  marginTop: '10px',
                  color: 'grey',
                }}
              >
                {statusText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
