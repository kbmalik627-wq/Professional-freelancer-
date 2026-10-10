export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  priceUsd: string;
  pricePkr: string;
  deliveryDays: string;
  iconName: 'design' | 'web' | 'content' | 'video' | 'seo' | 'social';
  image: string;
  watermarkText: string;
  likes: number;
  unlikes: number;
  tags: string[];
}

export interface PaymentDetails {
  accountNumber: string;
  accountTitle: string;
  provider: string;
  adminWhatsApp: string;
  driveLink: string;
}

export interface FeedbackStats {
  likes: number;
  unlikes: number;
  userVote: 'like' | 'unlike' | null;
}

export interface GoogleUser {
  name: string;
  email: string;
  picture?: string;
  id: string;
  verified: boolean;
}

export interface DriveFileInfo {
  id: string;
  name: string;
  mimeType: string;
  size?: number | string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  modifiedTime?: string;
}

export interface PaymentSubmission {
  id: string;
  tid: string;
  screenshotBase64: string;
  date: string;
  timestamp: number;
  serviceTitle: string;
  amountPkr: string;
  senderName?: string;
  status: 'pending' | 'approved' | 'rejected';
}



