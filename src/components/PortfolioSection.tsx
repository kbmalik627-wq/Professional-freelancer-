import React, { useState } from 'react';
import { PORTFOLIO_PROJECTS } from '../data/servicesData';
import { ExternalLink, CheckCircle2, ShieldAlert, MessageCircle } from 'lucide-react';

export const PortfolioSection: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'Graphic Design', 'Web Development', 'Video Editing', 'Social Media', 'Content Writing', 'SEO Optimization'];

  const filteredProjects = filter === 'All'
    ? PORTFOLIO_PROJECTS
    : PORTFOLIO_PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="portfolio" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Client Proven Results</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Selected Portfolio Work
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            A showcase of recent client deliveries across branding, responsive development, video production, and organic search optimization.
          </p>

          {/* Interactive filter control tabs (styled with clean segmented backgrounds as permitted by frontend design) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-slate-100 rounded-xl max-w-2xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  filter === cat
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col"
            >
              {/* Preview with protected watermark */}
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  draggable="false"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter blur-[1px] group-hover:scale-105 transition-transform duration-300 pointer-events-none select-none"
                />
                <div className="absolute inset-0 bg-slate-900/30 watermark-pattern flex items-center justify-center pointer-events-none">
                  <div className="transform -rotate-6 border border-white/70 bg-black/55 backdrop-blur-xs px-3 py-1.5 rounded-md text-center">
                    <span className="text-white text-[11px] font-bold tracking-wider">
                      PF WATERMARKED SAMPLE
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-black/75 backdrop-blur-sm text-white text-[11px] font-medium">
                  {project.category}
                </div>
              </div>

              {/* Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>Client: <strong className="text-slate-700">{project.client}</strong></span>
                    <span>Turnaround: <strong className="text-slate-700">{project.timeline}</strong></span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Delivered & Approved
                  </span>

                  <a
                    href={`https://wa.me/923267976823?text=${encodeURIComponent(
                      `Hi KM, I saw your portfolio project "${project.title}" and would like something similar.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <span>Request Similar</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
