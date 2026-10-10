import { ServiceItem, PaymentDetails } from '../types';

export const PAYMENT_CONFIG: PaymentDetails = {
  accountNumber: '03267976823',
  accountTitle: 'KM',
  provider: 'JazzCash',
  adminWhatsApp: '923267976823',
  driveLink: 'https://drive.google.com/uc?export=download&id=1H3O0YemVMw-FzJyLxKpUzLYrGYGpZI27'
};

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    description: 'Logos, branding, social media creatives, posters',
    priceUsd: '$25 - $100',
    pricePkr: '500 Rs',
    deliveryDays: '2-3 days',
    iconName: 'design',
    image: '/src/assets/images/service_graphic_design_1791536731178.jpg',
    watermarkText: 'PF PROTECTED PREVIEW',
    likes: 47,
    unlikes: 2,
    tags: ['Logos', 'Branding', 'Vector Art', 'Print Ready']
  },
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Responsive websites, landing pages',
    priceUsd: '$50 - $300',
    pricePkr: '1000 Rs',
    deliveryDays: '5-7 days',
    iconName: 'web',
    image: '/src/assets/images/service_web_dev_1791536744801.jpg',
    watermarkText: 'PF PROTECTED PREVIEW',
    likes: 89,
    unlikes: 3,
    tags: ['React', 'Next.js', 'Tailwind', 'Mobile Friendly']
  },
  {
    id: 'content-writing',
    title: 'Content Writing',
    description: 'Blogs, SEO articles',
    priceUsd: '$20 - $80',
    pricePkr: '300 Rs',
    deliveryDays: '1-3 days',
    iconName: 'content',
    image: '/src/assets/images/service_content_writing_1791536918340.jpg',
    watermarkText: 'PF PROTECTED PREVIEW',
    likes: 36,
    unlikes: 1,
    tags: ['SEO Articles', 'Copywriting', '100% Human Written']
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    description: 'YouTube videos, reels, ads',
    priceUsd: '$40 - $150',
    pricePkr: '700 Rs',
    deliveryDays: '3-5 days',
    iconName: 'video',
    image: '/src/assets/images/service_video_editing_1791536759259.jpg',
    watermarkText: 'PF PROTECTED PREVIEW',
    likes: 64,
    unlikes: 2,
    tags: ['Reels / Shorts', 'Color Grading', 'Sound Design']
  },
  {
    id: 'seo-optimization',
    title: 'SEO Optimization',
    description: 'Keyword research, on-page SEO',
    priceUsd: '$30 - $120',
    pricePkr: '600 Rs',
    deliveryDays: '4-6 days',
    iconName: 'seo',
    image: '/src/assets/images/service_seo_optimization_1791536928949.jpg',
    watermarkText: 'PF PROTECTED PREVIEW',
    likes: 52,
    unlikes: 1,
    tags: ['Rank 1 Strategy', 'Keyword Mapping', 'Audit Report']
  },
  {
    id: 'social-media-management',
    title: 'Social Media Management',
    description: 'Content strategy, posting',
    priceUsd: '$35 - $120',
    pricePkr: '800 Rs',
    deliveryDays: 'Monthly',
    iconName: 'social',
    image: '/src/assets/images/service_social_media_1791536771767.jpg',
    watermarkText: 'PF PROTECTED PREVIEW',
    likes: 58,
    unlikes: 3,
    tags: ['Calendar Planning', 'Engagement', 'Analytics Reports']
  }
];

export const PORTFOLIO_PROJECTS = [
  {
    id: 'proj-1',
    title: 'NovaTech Identity & Brand Book',
    category: 'Graphic Design',
    image: '/src/assets/images/service_graphic_design_1791536731178.jpg',
    summary: 'Complete visual identity system, stationery mockups, and corporate brand guidelines.',
    client: 'NovaTech Systems',
    timeline: '3 Days'
  },
  {
    id: 'proj-2',
    title: 'SaaS Analytics Dashboard Web App',
    category: 'Web Development',
    image: '/src/assets/images/service_web_dev_1791536744801.jpg',
    summary: 'Ultra-fast responsive web portal with real-time analytics graphs and mobile layout.',
    client: 'Pulse Metrics Inc.',
    timeline: '6 Days'
  },
  {
    id: 'proj-3',
    title: 'Fintech YouTube & Instagram Ads',
    category: 'Video Editing',
    image: '/src/assets/images/service_video_editing_1791536759259.jpg',
    summary: 'High-converting video commercials, kinetic typography, dynamic transitions.',
    client: 'CashFlow Global',
    timeline: '4 Days'
  },
  {
    id: 'proj-4',
    title: 'Global Engagement Marketing Rollout',
    category: 'Social Media',
    image: '/src/assets/images/service_social_media_1791536771767.jpg',
    summary: 'Full monthly content calendar, viral reels, community responses, 3.5M impressions.',
    client: 'Lumina Lifestyle',
    timeline: 'Monthly Retainer'
  },
  {
    id: 'proj-5',
    title: 'B2B Enterprise Authority Blog Hub',
    category: 'Content Writing',
    image: '/src/assets/images/service_content_writing_1791536918340.jpg',
    summary: '15 research-backed long-form articles ranking in top 3 Google search positions.',
    client: 'Apex Industrial Cloud',
    timeline: '2 Days'
  },
  {
    id: 'proj-6',
    title: 'E-Commerce Organic SERP Domination',
    category: 'SEO Optimization',
    image: '/src/assets/images/service_seo_optimization_1791536928949.jpg',
    summary: 'Technical SEO fix, schema integration, +140% organic impressions boost in 45 days.',
    client: 'Nordic Gear Store',
    timeline: '5 Days'
  }
];
