import React from 'react';
import { ShieldCheck, Award, Star, Clock, CheckCircle2, MessageCircle } from 'lucide-react';
import { PAYMENT_CONFIG } from '../data/servicesData';

export const AboutSection: React.FC = () => {
  const skills = [
    'Graphic & Brand Identity Design',
    'Full-Stack Web Development (React / Next.js / Tailwind)',
    'High-Retention Video Editing & Shorts',
    'Data-Driven SEO & Content Marketing',
    'Social Media Campaigns & Audience Growth',
    'Conversion Optimization & Landing Pages'
  ];

  return (
    <section id="about" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Bio Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 border-2 border-white/30 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">
                  KM
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xl font-bold">KM</h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-blue-200 font-medium">
                    Lead Freelancer & Creative Developer
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    WhatsApp: {PAYMENT_CONFIG.accountNumber}
                  </p>
                </div>
              </div>

              {/* Verified Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10 mb-6 text-center">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="block text-2xl font-black text-amber-400 tabular-nums">4.9 ★</span>
                  <span className="text-[11px] text-slate-300">152 Client Reviews</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="block text-2xl font-black text-blue-400 tabular-nums">200+</span>
                  <span className="text-[11px] text-slate-300">Projects Completed</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Prompt delivery within promised turnarounds</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct communication on WhatsApp (03267976823)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Clean deliverable files delivered via Google Drive</span>
                </div>
              </div>

              <a
                href={`https://wa.me/${PAYMENT_CONFIG.adminWhatsApp}?text=Hello%20KM,%20I%20want%20to%20discuss%20a%20project`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp Directly</span>
              </a>
            </div>
          </div>

          {/* Right Column: Bio Prose & Capabilities */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
              <span>About the Freelancer</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Dedicated to Crafting High-Quality Results Without Hassle
            </h2>
            <p className="text-base text-slate-600 leading-relaxed mb-4">
              Welcome to <strong className="text-slate-900">Professional Freelancer</strong>. I am KM, an independent multi-disciplinary freelancer providing corporate graphic design, high-speed responsive web development, engaging video editing, research-driven SEO, and social media management for startups, content creators, and local businesses.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Unlike typical agencies with inflated pricing, you work directly with me from the first brief to final file delivery. Payments are simple and locally verifiable via JazzCash, and all file deliverables are immediately made available in full resolution via protected Google Drive cloud links.
            </p>

            {/* Core Competencies List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#services"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors"
              >
                View Available Services
              </a>
              <a
                href="#contact"
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
              >
                Send Direct Message
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
