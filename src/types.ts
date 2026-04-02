export interface Program {
  id: string;
  name: string;
  description: string;
  category: string;
  price?: string;
  discountPercentage?: number;
  image: string;
  isEnabled: boolean;
}

export interface Coach {
  id: string;
  name: string;
  role: string;
  experience: string;
  certifications: string;
  achievements: string;
  image: string;
  socials: {
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string; 
  author: string;
  date: string;
  image: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  discountText: string;
  isEnabled: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  date: string;
}

export interface MembershipTier {
  id: string;
  name: string;
  description: string;
  features: string[];
  highlight: boolean;
  pricing: {
    monthly: number;
    quarterly?: number;
    biannual?: number;
    yearly?: number;
  };
}

export interface PlanInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Diet' | 'Workout';
  goals: string;
  date: string;
}

export interface FreeResource {
  id: string;
  title: string;
  type: 'Diet' | 'Workout';
  link: string;
  description?: string;
}

export interface LegalPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  isVisible: boolean;
  lastUpdated: string;
}

export interface CounselingService {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  isEnabled: boolean;
}

export interface SiteSettings {
  logoUrl?: string;
  faviconUrl?: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  counselingWhatsapp?: string;
  address: string;
  mapLinkUrl?: string;
  offersEnabled: boolean;
  programCategories: string[];
  contactInterests: string[];
  socials: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
  aboutUsTitle?: string;
  aboutUsSubtitle?: string;
  aboutUsImage?: string;
  aboutUsText1?: string;
  aboutUsText2?: string;
  homeHeroTitle?: string;
  homeHeroSubtitle?: string;
  homeOpeningHours?: string;
  homeStats?: {
    coaches: string;
    members: string;
    athletes: string;
    results: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  failedAttempts: number;
  lastFailedAttempt: number | null;
}
