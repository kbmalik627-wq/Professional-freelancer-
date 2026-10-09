import React from 'react';
import { Star, ShieldCheck, CheckCircle2, ArrowDown, Wallet, Sparkles } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/80">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle Category Kicker */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200/60 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Top Rated Freelance Hub</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6 text-balance">
          Professional Freelancer Services
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed mb-10">
          Quality freelance services for your projects. Select a service below and download your files instantly after secure payment via JazzCash.
        </p>

        {/* Badges Strip as required */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mb-10 max-w-3xl mx-auto">
          {/* Badge 1: 4.9 (152 Reviews) */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl border border-slate-200/90 shadow-sm text-slate-800">
            <div className="p-1 rounded-md bg-amber-50 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-slate-900 leading-none">
                4.9 <span className="text-xs font-normal text-slate-500">(152 Reviews)</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Top Client Rating</span>
            </div>
          </div>

          {/* Badge 2: Verified Freelancer */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl border border-emerald-200/90 shadow-sm text-slate-800">
            <div className="p-1 rounded-md bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-emerald-900 leading-none">
                Verified Freelancer
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">100% Identity Confirmed</span>
            </div>
          </div>

          {/* Badge 3: 200+ Projects Completed */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl border border-blue-200/90 shadow-sm text-slate-800">
            <div className="p-1 rounded-md bg-blue-50 text-blue-600">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-blue-900 leading-none">
                200+ Projects Completed
              </div>
              <span className="text-[11px] text-blue-700 font-medium">On-Time Delivery Record</span>
            </div>
          </div>
        </div>

        {/* Quick CTA Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/25 transition-all hover:-translate-y-0.5"
          >
            <span>Explore 6 Core Services</span>
            <ArrowDown className="w-4 h-4" />
          </a>
          <a
            href="#payment-download"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-700 hover:text-blue-600 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm transition-all hover:-translate-y-0.5"
          >
            <Wallet className="w-4 h-4 text-blue-600" />
            <span>Pay & Instant Download Portal</span>
          </a>
        </div>
      </div>
    </section>
  );
};
