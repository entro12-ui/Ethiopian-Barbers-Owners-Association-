export const SITE_NAME = "Ethiopian Barbers & Owners Association";
export const SITE_SHORT_NAME = "EBOA";
export const SITE_SLUG = "ethiopian-barbers-and-owners-association";
export const SITE_TAGLINE = "Modern Skills. Healthy Professionals. Stronger Community.";
export const SITE_DESCRIPTION =
  "A professional association dedicated to modernizing men's barbering and grooming in Ethiopia through professional development, workplace safety, health awareness, and community development.";
export const LOGO_PATH = "/images/eboa-logo.png";
export const LOGO_OG_PATH = "/images/eboa-logo-og.png";
export const LOGO_ALT = "Ethiopian Barbers & Owners Association logo";

export const CONTACT = {
  phone: "+251911237470",
  email: "eboaethiopia@gmail.com",
  address: "Addis Ababa, Ethiopia",
  social: {
    facebook: "https://www.facebook.com/share/18bM6Wjacp/",
    youtube: "https://www.youtube.com/@EBOAEthiopia",
    tiktok: "https://www.tiktok.com/@eboa11",
    instagram: "#",
    telegram: "#",
  },
};

export const MEMBERSHIP_PAYMENT = {
  bankName: "Commercial Bank of Ethiopia",
  accountName: "Ethiopian Barbers & Owners Association",
  accountNumber: "1000123456789",
  telebirr: "+251911237470",
  officerTitle: "Association President",
  officerName: "EBOA President",
  signaturePath: "public/images/admin-signature.png",
  fees: {
    gold: "ETB 2,000",
    silver: "ETB 1,200",
    white: "ETB 800",
  },
};

export const NAV_LINKS = [
  { key: "home", href: "/#home" },
  { key: "about", href: "/#about" },
  { key: "goals", href: "/#goals" },
  { key: "events", href: "/events" },
  { key: "jobs", href: "/jobs" },
  { key: "news", href: "/news" },
  { key: "membership", href: "/#membership" },
  { key: "gallery", href: "/#gallery" },
  { key: "contact", href: "/#contact" },
] as const;

export type NavLinkKey = (typeof NAV_LINKS)[number]["key"];

export const IMAGES = [
  "photo_2026-08-31_14-38-33.jpg",
  "photo_2026-08-31_14-38-41.jpg",
  "photo_2026-08-31_14-38-47.jpg",
  "photo_2026-08-31_14-38-52.jpg",
  "photo_2026-08-31_14-39-01.jpg",
  "photo_2026-08-31_14-39-10.jpg",
  "photo_2026-08-31_14-39-16.jpg",
  "photo_2026-08-31_14-39-23.jpg",
  "photo_2026-08-31_14-39-31.jpg",
  "photo_2026-08-31_14-39-45.jpg",
  "photo_2026-08-31_14-39-52.jpg",
  "photo_2026-08-31_14-40-00.jpg",
  "photo_2026-08-31_14-40-16.jpg",
  "photo_2026-08-31_14-40-24.jpg",
];

export function imagePath(filename: string) {
  return `/images/${filename}`;
}

export const GALLERY_ITEMS = [
  { src: "photo_2026-08-31_14-38-33.jpg", category: "hairStyling", altKey: "professionalHairStyling" },
  { src: "photo_2026-08-31_14-38-41.jpg", category: "barbers", altKey: "professionalBarberAtWork" },
  { src: "photo_2026-08-31_14-38-47.jpg", category: "beardGrooming", altKey: "beardGroomingSession" },
  { src: "photo_2026-08-31_14-38-52.jpg", category: "hairStyling", altKey: "modernHairStylingTechniques" },
  { src: "photo_2026-08-31_14-39-01.jpg", category: "barbershops", altKey: "professionalBarbershopInterior" },
  { src: "photo_2026-08-31_14-39-10.jpg", category: "training", altKey: "professionalTrainingSession" },
  { src: "photo_2026-08-31_14-39-16.jpg", category: "community", altKey: "communityGathering" },
  { src: "photo_2026-08-31_14-39-23.jpg", category: "events", altKey: "associationEvent" },
  { src: "photo_2026-08-31_14-39-31.jpg", category: "barbers", altKey: "barberProfessionalPortrait" },
  { src: "photo_2026-08-31_14-39-45.jpg", category: "events", altKey: "communitySportsEvent" },
  { src: "photo_2026-08-31_14-39-52.jpg", category: "training", altKey: "skillsDevelopmentWorkshop" },
  { src: "photo_2026-08-31_14-40-00.jpg", category: "community", altKey: "membersCommunityActivity" },
  { src: "photo_2026-08-31_14-40-16.jpg", category: "barbershops", altKey: "modernBarbershop" },
  { src: "photo_2026-08-31_14-40-24.jpg", category: "beardGrooming", altKey: "beardStylingExpertise" },
] as const;

export const GALLERY_CATEGORIES = [
  "all",
  "hairStyling",
  "beardGrooming",
  "barbers",
  "barbershops",
  "training",
  "events",
  "community",
] as const;

export type GalleryCategoryKey = (typeof GALLERY_CATEGORIES)[number];

export const FAQ_ITEMS = [
  {
    question: "Who can become a member?",
    answer: "Professional barbers and barbershop owners who meet the association's requirements.",
  },
  {
    question: "What is the minimum age?",
    answer: "Applicants must be 18 years or older.",
  },
  {
    question: "Can I apply online?",
    answer: "Yes. Applicants can complete the membership application online or in person.",
  },
  {
    question: "What identification documents are accepted?",
    answer: "A renewed resident ID, passport, or driver's license.",
  },
  {
    question: "What documents are required from a barbershop owner?",
    answer: "A renewed business license.",
  },
  {
    question: "What documents are required from a professional barber?",
    answer: "A COC certificate or proof of work experience in a barbershop.",
  },
  {
    question: "How many photographs are required?",
    answer: "Two recent head photographs for the membership ID.",
  },
  {
    question: "What fees are required?",
    answer: "The registration fee and the first monthly subscription.",
  },
];
