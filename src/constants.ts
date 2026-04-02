import { Program, Coach, BlogPost, Offer, SiteSettings, Testimonial, MembershipTier, FreeResource, LegalPage, CounselingService } from './types.ts';

export const SEED_PROGRAMS: Program[] = [
  {
    id: '1',
    name: 'Elite Performance',
    description: 'Designed for professional athletes focusing on speed, agility, and explosive power.',
    category: 'Athletic Training',
    price: '₹15,000/mo',
    image: 'https://images.unsplash.com/photo-1517931182867-507c2c317505?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isEnabled: true,
  },
  {
    id: '2',
    name: 'Functional Strength',
    description: 'Build real-world strength that translates to daily life. Focuses on compound movements.',
    category: 'General Fitness',
    price: '₹6,000/mo',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isEnabled: true,
  },
  {
    id: '3',
    name: 'Senior Mobility',
    description: 'Low impact exercises designed to improve joint health, balance, and longevity.',
    category: 'Special Programs',
    price: '₹4,500/mo',
    discountPercentage: 10,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isEnabled: true,
  }
];

export const SEED_COACHES: Coach[] = [
  {
    id: '1',
    name: 'Alex Sterling',
    role: 'Head Performance Coach',
    experience: '12 Years',
    certifications: 'CSCS, NASM-CPT',
    achievements: 'Coached 3 Olympic Athletes.',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    socials: { instagram: 'alex_lifts' },
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    role: 'Mobility Specialist',
    experience: '8 Years',
    certifications: 'Yoga Alliance 500hr, DPT',
    achievements: 'Best Mobility Coach 2023.',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    socials: { instagram: 'sarah_moves' },
  }
];

export const SEED_BLOGS: BlogPost[] = [
  {
    id: '1',
    title: 'Why Recovery is as Important as Training',
    description: 'Recovery is often overlooked but is crucial for muscle growth and injury prevention.',
    content: 'Recovery is the unsung hero of performance...',
    author: 'Alex Sterling',
    date: '2023-10-15',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  }
];

export const SEED_OFFERS: Offer[] = [
  {
    id: '1',
    title: 'New Year Transformation',
    description: 'Join now and get 2 free personal training sessions.',
    discountText: '2 FREE SESSIONS',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    isEnabled: true,
  }
];

export const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'James Carter',
    role: 'Professional Sprinter',
    content: 'The facilities at Athletes Aura are unmatched. I shaved 0.2s off my 100m time.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  }
];

export const SEED_MEMBERSHIPS: MembershipTier[] = [
  {
    id: '1',
    name: 'Base Fitness',
    description: 'Access to gym floor and cardio equipment.',
    features: ['Open Gym Access (5am - 10pm)', '1 Free Intro Session', 'Locker Room Access'],
    highlight: false,
    pricing: {
      monthly: 2500,
      quarterly: 7000,
      biannual: 13000,
      yearly: 25000
    }
  },
  {
    id: '2',
    name: 'Athlete Pro',
    description: 'Full access + unlimited classes + recovery zone.',
    features: ['Everything in Base', 'Unlimited Group Classes', 'Recovery Zone Access'],
    highlight: true,
    pricing: {
      monthly: 5000,
      quarterly: 14000,
      biannual: 27000,
      yearly: 50000
    }
  }
];

export const SEED_FREE_RESOURCES: FreeResource[] = [
  {
    id: '1',
    title: '7-Day Shred Diet Plan',
    type: 'Diet',
    description: 'A starter guide to leaning out.',
    link: 'https://example.com/diet-plan.pdf'
  },
  {
    id: '2',
    title: 'Home Bodyweight Circuit',
    type: 'Workout',
    description: 'No equipment needed. 20 minute routine.',
    link: 'https://example.com/home-workout.pdf'
  }
];

export const SEED_COUNSELING: CounselingService[] = [
    {
        id: '1',
        title: 'Sports Psychology Session',
        description: 'Overcome mental blocks and build a champion\'s mindset with our certified sports psychologists.',
        price: 2000,
        duration: '60 Mins',
        image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        isEnabled: true
    },
    {
        id: '2',
        title: 'Nutritional Consulting',
        description: 'Detailed analysis of your eating habits and a roadmap to better fueling for your sport.',
        price: 1500,
        duration: '45 Mins',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        isEnabled: true
    }
];

export const SEED_LEGAL_PAGES: LegalPage[] = [
    {
        id: '1',
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        content: '<h1>Privacy Policy</h1><p>Standard privacy policy content...</p>',
        isVisible: true,
        lastUpdated: '2023-10-01'
    },
    {
        id: '2',
        title: 'Terms & Conditions',
        slug: 'terms-and-conditions',
        content: '<h1>Terms & Conditions</h1><p>Standard terms content...</p>',
        isVisible: true,
        lastUpdated: '2023-10-01'
    }
];

export const SEED_SETTINGS: SiteSettings = {
  logoUrl: '',
  faviconUrl: '',
  contactEmail: 'info@athletesaura.com',
  contactPhone: '+91 98765 43210',
  whatsappNumber: '919876543210',
  counselingWhatsapp: '919876543210',
  address: '100 Olympic Way, Sportscity, India',
  mapLinkUrl: 'https://maps.google.com',
  offersEnabled: true,
  programCategories: ['Athletic Training', 'General Fitness', 'Special Programs'],
  contactInterests: ['General Inquiry', 'Athletic Performance', 'Personal Training', 'Membership', 'Counseling'],
  socials: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    youtube: '',
    linkedin: '',
  },
  aboutUsTitle: 'About Athletes Aura',
  aboutUsSubtitle: 'Forging champions since 2010',
  aboutUsImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  aboutUsText1: 'We believe that everyone has an inner athlete waiting to be unleashed.',
  aboutUsText2: 'Our mission is to provide world-class facilities and coaching to help you reach your peak performance.',
  homeHeroTitle: 'Unleash Your\nInner Athlete',
  homeHeroSubtitle: 'Elite training facilities and expert coaching to help you reach your peak performance.',
  homeOpeningHours: 'Mon-Fri: 5:00 AM - 10:00 PM\nSat-Sun: 7:00 AM - 8:00 PM',
  homeStats: {
    coaches: '15+',
    members: '1200+',
    athletes: '50+',
    results: '100%',
  },
};
