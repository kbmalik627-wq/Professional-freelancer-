import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppPromoBanner: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <div
        style={{
          background: 'linear-gradient(135deg, #25D366, #128C7E)',
          padding: '24px 20px',
          borderRadius: '16px',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(18, 140, 126, 0.25)',
        }}
        className="relative overflow-hidden"
      >
        <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>
          📚 WhatsApp Par Bhi Hasil Karen!
        </h3>
        <p className="mt-2 mb-5 text-sm sm:text-base text-emerald-50 max-w-xl mx-auto font-medium">
          Aap log WhatsApp par bhi Notes, Projects, Aur Jo Cheezen Hain Lay Sakte Hain!
        </p>
        <a
          href="https://wa.me/923267976823?text=Salam%20KM%20Bhai%2C%20Mujhe%20Notes%20Chahiye"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'white',
            color: '#128C7E',
            padding: '12px 28px',
            borderRadius: '25px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '15px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
          className="hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 fill-[#128C7E]" />
          <span>💬 WhatsApp - 03267976823</span>
        </a>
      </div>
    </div>
  );
};
