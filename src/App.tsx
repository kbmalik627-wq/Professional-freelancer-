import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ServicesSection } from './components/ServicesSection';
import { WhatsAppPromoBanner } from './components/WhatsAppPromoBanner';
import { PaymentAndDownload } from './components/PaymentAndDownload';
import { EmailBanner } from './components/EmailBanner';
import { PortfolioSection } from './components/PortfolioSection';
import { PricingSection } from './components/PricingSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { FooterSection } from './components/FooterSection';
import { SecurityToast } from './components/SecurityToast';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { useSecurityProtection } from './hooks/useSecurityProtection';
import { INITIAL_SERVICES } from './data/servicesData';
import { ServiceItem, FeedbackStats, GoogleUser } from './types';

export default function App() {
  const { securityAlert, dismissAlert } = useSecurityProtection();
  const [userNotification, setUserNotification] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Google User Auth state
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => {
    try {
      const saved = localStorage.getItem('google_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });

  const showNotification = useCallback((message: string) => {
    setUserNotification(message);
    const timer = setTimeout(() => {
      setUserNotification(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Load services with preserved like/unlike counts
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem('pf_services_state');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback to default
    }
    return INITIAL_SERVICES;
  });

  // Selected service highlighted for payment (default to first or previously selected)
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(() => {
    try {
      const savedId = localStorage.getItem('selected_service_id');
      if (savedId) {
        const found = INITIAL_SERVICES.find((s) => s.id === savedId);
        if (found) return found;
      }
    } catch {
      // fallback
    }
    return INITIAL_SERVICES[2]; // Content Writing as shown in screenshot
  });

  // Payment Unlocking State
  const [isPaid, setIsPaid] = useState<boolean>(() => {
    try {
      const paidYes = localStorage.getItem('paid') === 'yes';
      const statusTrue = localStorage.getItem('pf_payment_status') === 'true';
      return paidYes || statusTrue;
    } catch {
      return false;
    }
  });

  // Footer feedback stats: Like 128, Unlike 12
  const [feedback, setFeedback] = useState<FeedbackStats>(() => {
    try {
      const saved = localStorage.getItem('pf_feedback_stats');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return {
      likes: 128,
      unlikes: 12,
      userVote: null,
    };
  });

  // Save selected service ID to localStorage
  useEffect(() => {
    if (selectedService) {
      localStorage.setItem('selected_service_id', selectedService.id);
    }
  }, [selectedService]);

  // Sync services state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pf_services_state', JSON.stringify(services));
    } catch {
      // safe
    }
  }, [services]);

  // Sync payment state to localStorage
  useEffect(() => {
    try {
      if (isPaid) {
        localStorage.setItem('paid', 'yes');
        localStorage.setItem('pf_payment_status', 'true');
      } else {
        localStorage.removeItem('paid');
        localStorage.setItem('pf_payment_status', 'false');
      }
    } catch {
      // safe
    }
  }, [isPaid]);

  // Sync feedback to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pf_feedback_stats', JSON.stringify(feedback));
    } catch {
      // safe
    }
  }, [feedback]);

  // Google Login handlers
  const handleLoginSuccess = (user: GoogleUser) => {
    setGoogleUser(user);
    showNotification(`Signed in as ${user.name} (${user.email}) ✅`);
  };

  const handleLogout = () => {
    localStorage.removeItem('google_user');
    setGoogleUser(null);
    showNotification('Logged out from Google account.');
  };

  // Handlers for Service Like / Unlike
  const handleLikeService = (id: string) => {
    setServices((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
  };

  const handleUnlikeService = (id: string) => {
    setServices((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, unlikes: item.unlikes + 1 } : item
      )
    );
  };

  // When user selects a service from cards or table
  const handleSelectForPayment = (service: ServiceItem) => {
    setSelectedService(service);
    const element = document.getElementById('payment-download');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    showNotification(`Selected: ${service.title} (${service.pricePkr})`);
  };

  // Payment Confirmation Action ("I Have Paid")
  const handleConfirmPayment = (trxid?: string) => {
    setIsPaid(true);
    localStorage.setItem('paid', 'yes');
    if (trxid) localStorage.setItem('trxid', trxid);

    const element = document.getElementById('payment-download');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetPayment = () => {
    setIsPaid(false);
    localStorage.removeItem('paid');
    localStorage.removeItem('trxid');
    localStorage.setItem('pf_payment_status', 'false');
    showNotification('Payment status reset to locked.');
  };

  // Footer Feedback voting
  const handleFeedbackVote = (type: 'like' | 'unlike') => {
    setFeedback((prev) => {
      if (prev.userVote === type) {
        return {
          ...prev,
          likes: type === 'like' ? prev.likes - 1 : prev.likes,
          unlikes: type === 'unlike' ? prev.unlikes - 1 : prev.unlikes,
          userVote: null,
        };
      }

      let newLikes = prev.likes;
      let newUnlikes = prev.unlikes;

      if (prev.userVote === 'like') newLikes -= 1;
      if (prev.userVote === 'unlike') newUnlikes -= 1;

      if (type === 'like') newLikes += 1;
      if (type === 'unlike') newUnlikes += 1;

      return {
        likes: newLikes,
        unlikes: newUnlikes,
        userVote: type,
      };
    });

    showNotification(type === 'like' ? '✓ Feedback registered: Liked!' : 'Thanks for feedback');
  };

  const scrollToHireMe = () => {
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeToastMessage = userNotification || securityAlert;
  const handleDismissToast = () => {
    setUserNotification(null);
    dismissAlert();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      {/* Toast Notification (Handles both Security and User Alerts) */}
      <SecurityToast
        message={activeToastMessage}
        onClose={handleDismissToast}
      />

      {/* Google Login Authentication Modal */}
      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Global Header with Google Login */}
      <Header
        onHireMeClick={scrollToHireMe}
        user={googleUser}
        onOpenLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {/* Banner with 4.9 Reviews, Verified Freelancer, 200+ Projects Completed */}
        <HeroBanner />

        {/* SECTION 1 - OUR SERVICES (6 Cards in 2 rows, 3 per row) */}
        <ServicesSection
          services={services}
          onLike={handleLikeService}
          onUnlike={handleUnlikeService}
          onSelectForPayment={handleSelectForPayment}
          onNotify={showNotification}
        />

        {/* WhatsApp Promo Banner requested by user */}
        <WhatsAppPromoBanner />

        {/* SECTION 2 - PAYMENT AND DOWNLOAD (Interactive Service Selector, Google User Safe Tag, Side-by-side Boxes) */}
        <PaymentAndDownload
          selectedService={selectedService}
          services={services}
          onSelectService={setSelectedService}
          isPaid={isPaid}
          onConfirmPayment={handleConfirmPayment}
          onResetPayment={handleResetPayment}
          onNotify={showNotification}
          user={googleUser}
          onOpenLogin={() => setIsAuthModalOpen(true)}
        />

        {/* Supplementary Detailed Showcase Sections */}
        <PortfolioSection />
        <PricingSection onSelectForPayment={handleSelectForPayment} />
        <AboutSection />

        {/* Contact Us / Order Now (Exact layout and WhatsApp format) */}
        <ContactSection
          user={googleUser}
          onNotify={showNotification}
        />

        {/* Email Banner requested by user */}
        <EmailBanner onNotify={showNotification} />
      </main>

      {/* FOOTER SECTION (128 Likes, 12 Unlike, Feedback, Links, JazzCash Admin WhatsApp) */}
      <FooterSection
        feedback={feedback}
        onFeedbackVote={handleFeedbackVote}
      />
    </div>
  );
}
