import React from 'react';
import { INITIAL_SERVICES } from '../data/servicesData';
import { Check, ShieldCheck, ArrowRight, MessageCircle } from 'lucide-react';
import { ServiceItem } from '../types';

interface PricingSectionProps {
  onSelectForPayment: (service: ServiceItem) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectForPayment }) => {
  return (
    <section id="pricing" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Direct & Fair Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Transparent Pricing Matrix
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            No hidden costs or platform middleman commissions. Pay directly in Pakistani Rupees (PKR) via JazzCash or International USD rates.
          </p>
        </div>

        {/* Pricing Table Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-700">
                  <th className="py-4 px-6">Service</th>
                  <th className="py-4 px-6">Scope & Deliverables</th>
                  <th className="py-4 px-6">USD Rate</th>
                  <th className="py-4 px-6">JazzCash Rate (PKR)</th>
                  <th className="py-4 px-6">Turnaround</th>
                  <th className="py-4 px-6 text-right">Instant Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {INITIAL_SERVICES.map((s) => (
                  <tr key={s.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">
                      {s.title}
                    </td>
                    <td className="py-4 px-6 text-slate-600 max-w-xs text-xs">
                      {s.description}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-700 whitespace-nowrap tabular-nums">
                      {s.priceUsd}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 tabular-nums">
                        {s.pricePkr}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap text-xs font-medium">
                      {s.deliveryDays}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectForPayment(s)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                      >
                        <span>Select & Pay</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Guarantee Footer */}
          <div className="bg-slate-50 p-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full satisfaction guarantee · 2 free revision cycles included with every package</span>
            </div>
            <a
              href="https://wa.me/923267976823?text=Hi%20KM,%20I%20have%20a%20custom%20freelance%20inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Need a custom quote? Message on WhatsApp: 03267976823</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
