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
import { DrivePickerModal } from './components/DrivePickerModal';
import { AdminPanel } from './components/AdminPanel';
import { useSecurityProtection } from './hooks/useSecurityProtection';
import { INITIAL_SERVICES } from './data/servicesData';
import { ServiceItem, FeedbackStats, GoogleUser, DriveFileInfo, PaymentSubmission } from './types';
import {
  initAuth,
  logOutGoogle,
  setAccessToken
} from './services/googleDriveService';

export default function App() {
  const { securityAlert, dismissAlert } = useSecurityProtection();
  const [userNotification, setUserNotification] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDrivePickerOpen, setIsDrivePickerOpen] = useState(false);
  const [driveAccessToken, setDriveAccessToken] = useState<string | null>(null);

  // Admin Route detection (#admin or ?admin=1 or manual state)
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(() => {
    return (
      window.location.hash === '#admin' ||
      window.location.search.includes('admin=1') ||
      window.location.pathname.endsWith('/admin')
    );
  });

  // Listen for hashchange so #admin works immediately
  useEffect(() => {
    const handleHash = () => {
      if (
        window.location.hash === '#admin' ||
        window.location.search.includes('admin=1') ||
        window.location.pathname.endsWith('/admin')
      ) {
        setShowAdminPanel(true);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Pending Payments array in localStorage
  const [pendingPayments, setPendingPayments] = useState<PaymentSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('pendingPayments');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Approved TIDs list in localStorage
  const [approvedTIDs, setApprovedTIDs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('approvedTIDs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Google User Auth state
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => {
    try {
      const saved = localStorage.getItem('google_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // Google Drive Linked Deliverable File (Default to user's real file ID 1H3O0YemVMw-FzJyLxKpUzLYrGYGpZI27)
  const [linkedDriveFile, setLinkedDriveFile] = useState<DriveFileInfo | null>(() => {
    try {
      const saved = localStorage.getItem('linked_drive_file');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.id === '1H3O0YemVMw-FzJyLxKpUzLYrGYGpZI27') return parsed;
      }
    } catch {}
    return {
      id: '1H3O0YemVMw-FzJyLxKpUzLYrGYGpZI27',
      name: 'Deliverables_Package.zip',
      mimeType: 'application/octet-stream',
      size: 'Original Drive File',
      webContentLink: 'https://drive.google.com/uc?export=download&id=1H3O0YemVMw-FzJyLxKpUzLYrGYGpZI27',
      webViewLink: 'https://drive.google.com/file/d/1H3O0YemVMw-FzJyLxKpUzLYrGYGpZI27/view?usp=sharing',
    };
  });

  const showNotification = useCallback((message: string) => {
    setUserNotification(message);
    const timer = setTimeout(() => {
      setUserNotification(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Sync Firebase Auth state on load
  useEffect(() => {
    initAuth(
      (user, token) => {
        setDriveAccessToken(token);
        setGoogleUser({
          name: user.displayName || 'Google User',
          email: user.email || '',
          picture: user.photoURL || undefined,
          id: user.uid,
          verified: true,
        });
      },
      () => {
        setDriveAccessToken(null);
      }
    );
  }, []);

  // Sync pending payments to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pendingPayments', JSON.stringify(pendingPayments));
    } catch {}
  }, [pendingPayments]);

  // Sync approved TIDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('approvedTIDs', JSON.stringify(approvedTIDs));
    } catch {}
  }, [approvedTIDs]);

  // Sync linked Drive file to localStorage
  useEffect(() => {
    if (linkedDriveFile) {
      localStorage.setItem('linked_drive_file', JSON.stringify(linkedDriveFile));
    }
  }, [linkedDriveFile]);

  // Load services
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem('pf_services_state');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SERVICES;
  });

  // Selected service (default Content Writing 300 Rs)
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(() => {
    try {
      const savedId = localStorage.getItem('selected_service_id');
      if (savedId) {
        const found = INITIAL_SERVICES.find((s) => s.id === savedId);
        if (found) return found;
      }
    } catch {}
    return INITIAL_SERVICES[2];
  });

  // Footer feedback stats
  const [feedback, setFeedback] = useState<FeedbackStats>(() => {
    try {
      const saved = localStorage.getItem('pf_feedback_stats');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      likes: 128,
      unlikes: 12,
      userVote: null,
    };
  });

  // Save selected service ID
  useEffect(() => {
    if (selectedService) {
      localStorage.setItem('selected_service_id', selectedService.id);
    }
  }, [selectedService]);

  // Save services state
  useEffect(() => {
    try {
      localStorage.setItem('pf_services_state', JSON.stringify(services));
    } catch {}
  }, [services]);

  // Save feedback state
  useEffect(() => {
    try {
      localStorage.setItem('pf_feedback_stats', JSON.stringify(feedback));
    } catch {}
  }, [feedback]);

  // 1. Client submits new payment with TID + Screenshot
  const handleNewPaymentSubmitted = (submission: PaymentSubmission) => {
    setPendingPayments((prev) => [submission, ...prev]);
  };

  // 2. Admin Approves Payment
  const handleApprovePayment = (tid: string) => {
    setApprovedTIDs((prev) => (prev.includes(tid) ? prev : [...prev, tid]));
    setPendingPayments((prev) =>
      prev.map((p) => (p.tid === tid ? { ...p, status: 'approved' } : p))
    );
  };

  // 2. Admin Rejects Payment
  const handleRejectPayment = (tid: string) => {
    setApprovedTIDs((prev) => prev.filter((t) => t !== tid));
    setPendingPayments((prev) =>
      prev.map((p) => (p.tid === tid ? { ...p, status: 'rejected' } : p))
    );
  };

  // 2. Admin Manual Add TID
  const handleManualAddTID = (tid: string) => {
    setApprovedTIDs((prev) => (prev.includes(tid) ? prev : [...prev, tid]));
    showNotification(`TID ${tid} added to approved whitelist!`);
  };

  // Google Login handlers
  const handleLoginSuccess = (user: GoogleUser) => {
    setGoogleUser(user);
    showNotification(`Signed in as ${user.name} (${user.email}) ✅`);
  };

  const handleLogout = async () => {
    await logOutGoogle();
    localStorage.removeItem('google_user');
    setGoogleUser(null);
    setDriveAccessToken(null);
    setAccessToken(null);
    showNotification('Logged out from Google account.');
  };

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

  const handleSelectForPayment = (service: ServiceItem) => {
    setSelectedService(service);
    const element = document.getElementById('payment-download');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    showNotification(`Selected: ${service.title} (${service.pricePkr})`);
  };

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
      {/* Toast Notification */}
      <SecurityToast
        message={activeToastMessage}
        onClose={handleDismissToast}
      />

      {/* Admin Panel Modal / Screen */}
      {showAdminPanel && (
        <AdminPanel
          pendingPayments={pendingPayments}
          approvedTIDs={approvedTIDs}
          onApprove={handleApprovePayment}
          onReject={handleRejectPayment}
          onManualAddTID={handleManualAddTID}
          onClose={() => {
            setShowAdminPanel(false);
            window.history.pushState(null, '', '/');
          }}
          onNotify={showNotification}
        />
      )}

      {/* Google Login Authentication Modal */}
      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Google Drive Picker & File Explorer Modal */}
      <DrivePickerModal
        isOpen={isDrivePickerOpen}
        onClose={() => setIsDrivePickerOpen(false)}
        onFileSelected={(file) => setLinkedDriveFile(file)}
        currentSelectedFile={linkedDriveFile}
        accessToken={driveAccessToken}
        onTokenAcquired={(token, usr) => {
          setDriveAccessToken(token);
          setAccessToken(token);
          if (usr) {
            const gu: GoogleUser = {
              name: usr.displayName || 'Google User',
              email: usr.email || '',
              picture: usr.photoURL || undefined,
              id: usr.uid,
              verified: true,
            };
            setGoogleUser(gu);
            localStorage.setItem('google_user', JSON.stringify(gu));
          }
        }}
        onNotify={showNotification}
      />

      {/* Global Header */}
      <Header
        onHireMeClick={scrollToHireMe}
        user={googleUser}
        onOpenLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {/* Banner with 4.9 Reviews, Verified Freelancer, 200+ Projects Completed */}
        <HeroBanner />

        {/* SECTION 1 - OUR SERVICES */}
        <ServicesSection
          services={services}
          onLike={handleLikeService}
          onUnlike={handleUnlikeService}
          onSelectForPayment={handleSelectForPayment}
          onNotify={showNotification}
        />

        {/* WhatsApp Promo Banner */}
        <WhatsAppPromoBanner />

        {/* SECTION 2 - PAYMENT AND DOWNLOAD (OPTION 1: SECURE VERIFICATION SYSTEM) */}
        <PaymentAndDownload
          selectedService={selectedService}
          services={services}
          onSelectService={setSelectedService}
          onNotify={showNotification}
          user={googleUser}
          driveFile={linkedDriveFile}
          onOpenDrivePicker={() => setIsDrivePickerOpen(true)}
          accessToken={driveAccessToken}
          pendingPayments={pendingPayments}
          approvedTIDs={approvedTIDs}
          onNewPaymentSubmitted={handleNewPaymentSubmitted}
          onOpenAdmin={() => setShowAdminPanel(true)}
        />

        {/* Supplementary Detailed Showcase Sections */}
        <PortfolioSection />
        <PricingSection onSelectForPayment={handleSelectForPayment} />
        <AboutSection />

        {/* Contact Us / Order Now */}
        <ContactSection
          user={googleUser}
          onNotify={showNotification}
        />

        {/* Email Banner */}
        <EmailBanner onNotify={showNotification} />
      </main>

      {/* FOOTER SECTION */}
      <FooterSection
        feedback={feedback}
        onFeedbackVote={handleFeedbackVote}
      />
    </div>
  );
}
