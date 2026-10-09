import React, { useState, useEffect } from 'react';
import {
  Palette,
  Code2,
  FileText,
  Video,
  TrendingUp,
  Share2,
  Clock,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  services: ServiceItem[];
  onLike: (id: string) => void;
  onUnlike: (id: string) => void;
  onSelectForPayment: (service: ServiceItem) => void;
  onNotify: (message: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onLike,
  onUnlike,
  onSelectForPayment,
  onNotify,
}) => {
  const [likedStatus, setLikedStatus] = useState<Record<string, boolean>>({});

  // Check localStorage on mount for each service liked status
  useEffect(() => {
    const status: Record<string, boolean> = {};
    services.forEach((s) => {
      if (localStorage.getItem('liked_' + s.id) === 'yes') {
        status[s.id] = true;
      }
    });
    setLikedStatus(status);
  }, [services]);

  const handleServiceLike = (service: ServiceItem) => {
    const isAlreadyLiked = localStorage.getItem('liked_' + service.id) === 'yes' || likedStatus[service.id];
    if (isAlreadyLiked) {
      onNotify('Aap pehle hi Like kar chuke ho! 1 ID se 1 bar hi Like hota hai');
      return;
    }

    localStorage.setItem('liked_' + service.id, 'yes');
    setLikedStatus((prev) => ({ ...prev, [service.id]: true }));
    onLike(service.id);
    onNotify('✓ Service Liked! Thanks for your vote.');
  };

  const handleServiceUnlike = (service: ServiceItem) => {
    onUnlike(service.id);
    onNotify('Thanks for feedback');
  };

  const renderIcon = (iconName: ServiceItem['iconName']) => {
    switch (iconName) {
      case 'design':
        return <Palette className="w-5 h-5 text-blue-600" />;
      case 'web':
        return <Code2 className="w-5 h-5 text-blue-600" />;
      case 'content':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-blue-600" />;
      case 'seo':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'social':
        return <Share2 className="w-5 h-5 text-blue-600" />;
    }
  };

  const getWhatsAppUrl = (service: ServiceItem) => {
    const message = encodeURIComponent(
      `Hello KM! I am interested in your freelance service: "${service.title}" (${service.pricePkr} / ${service.priceUsd}). Please share more details and project starting steps.`
    );
    return `https://wa.me/923267976823?text=${message}`;
  };

  return (
    <section id="services" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Specialized Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Core Freelance Services
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Handpicked, high-impact digital solutions with transparent rates in USD & PKR. All deliverables are protected and ready for instant release upon payment.
          </p>
        </div>

        {/* 6 Cards in 2 rows, 3 per row on lg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const isLiked = likedStatus[service.id];

            return (
              <div
                key={service.id}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-200 overflow-hidden"
              >
                {/* Image Preview with Blur and Watermark */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden select-none">
                  <img
                    src={service.image}
                    alt={`${service.title} showcase preview`}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    draggable="false"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter blur-[1.8px] scale-105 group-hover:scale-108 transition-transform duration-300 pointer-events-none select-none"
                  />

                  {/* Watermark Diagonal Overlay */}
                  <div className="absolute inset-0 bg-slate-900/35 watermark-pattern flex items-center justify-center pointer-events-none">
                    <div className="transform -rotate-12 border-2 border-white/80 bg-black/60 backdrop-blur-xs px-4 py-2 rounded-lg text-center shadow-lg">
                      <div className="flex items-center justify-center gap-1.5 text-amber-300 text-[11px] font-bold tracking-widest uppercase">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>{service.watermarkText}</span>
                      </div>
                      <span className="text-white text-xs font-semibold tracking-wider">
                        CONFIDENTIAL · WATERMARKED
                      </span>
                    </div>
                  </div>

                  {/* Delivery Time Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-sm text-white text-xs font-medium shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>{service.deliveryDays}</span>
                  </div>

                  {/* Service Tag */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-sm">
                    {renderIcon(service.iconName)}
                    <span>Service #{index + 1}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {service.title}
                      </h3>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {service.description}
                    </p>

                    {/* Pricing Display */}
                    <div className="mb-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Service Price
                        </span>
                        <div className="text-right">
                          <span className="text-lg font-extrabold text-blue-600 tabular-nums">
                            {service.priceUsd}
                          </span>
                          <span className="ml-2 text-sm font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 tabular-nums">
                            {service.pricePkr}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
                        <span>Standard Delivery</span>
                        <span className="font-semibold text-slate-700">{service.deliveryDays}</span>
                      </div>
                    </div>
                  </div>

                  {/* Buttons Action Bar */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    {/* WhatsApp Direct Inbox Button */}
                    <a
                      href={getWhatsAppUrl(service)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm shadow-emerald-600/20 hover:shadow-md hover:shadow-emerald-600/30 transition-all active:scale-[0.98]"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Inbox WhatsApp</span>
                    </a>

                    {/* Secondary Row: Like, Unlike, and Instant Pay Selection */}
                    <div className="flex items-center gap-2">
                      {/* Like Button with 1-ID-1-Bar-Like logic */}
                      <button
                        id={`likeBtn-${service.id}`}
                        onClick={() => handleServiceLike(service)}
                        style={
                          isLiked
                            ? { background: '#008000', color: 'white', borderColor: '#008000' }
                            : { background: '#eef5ff', color: '#1e3a8a', borderColor: '#cbd5e1' }
                        }
                        title={isLiked ? 'Already Liked' : 'Like this service'}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all active:scale-95 cursor-pointer shadow-2xs"
                      >
                        {isLiked ? (
                          <>
                            <span>✓ Liked 👍</span>
                            <span className="tabular-nums font-bold">{service.likes}</span>
                          </>
                        ) : (
                          <>
                            <span>👍</span>
                            <span className="tabular-nums font-bold">{service.likes}</span>
                          </>
                        )}
                      </button>

                      {/* Unlike Button with feedback confirmation */}
                      <button
                        onClick={() => handleServiceUnlike(service)}
                        title="Unlike this service"
                        style={{
                          background: '#f8fafc',
                          borderColor: '#cbd5e1',
                          color: '#64748b',
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors active:scale-95 cursor-pointer"
                      >
                        <span>👎</span>
                        <span className="tabular-nums font-bold">{service.unlikes}</span>
                      </button>

                      {/* Pay & Download Trigger */}
                      <button
                        onClick={() => onSelectForPayment(service)}
                        title="Select this service to pay and unlock"
                        className="flex-2 inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 text-xs font-bold rounded-lg border border-blue-200 transition-colors cursor-pointer"
                      >
                        <span>Pay & Unlock</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
