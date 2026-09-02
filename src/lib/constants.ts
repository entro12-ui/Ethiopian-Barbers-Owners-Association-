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

export const NAV_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Goals", href: "/#goals" },
  { label: "Events", href: "/events" },
  { label: "Jobs", href: "/jobs" },
  { label: "News", href: "/news" },
  { label: "Membership", href: "/#membership" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Contact", href: "/#contact" },
];

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
  { src: "photo_2026-08-31_14-38-33.jpg", category: "Hair Styling", alt: "Professional hair styling" },
  { src: "photo_2026-08-31_14-38-41.jpg", category: "Barbers", alt: "Professional barber at work" },
  { src: "photo_2026-08-31_14-38-47.jpg", category: "Beard Grooming", alt: "Beard grooming session" },
  { src: "photo_2026-08-31_14-38-52.jpg", category: "Hair Styling", alt: "Modern hair styling techniques" },
  { src: "photo_2026-08-31_14-39-01.jpg", category: "Barbershops", alt: "Professional barbershop interior" },
  { src: "photo_2026-08-31_14-39-10.jpg", category: "Training", alt: "Professional training session" },
  { src: "photo_2026-08-31_14-39-16.jpg", category: "Community", alt: "Community gathering" },
  { src: "photo_2026-08-31_14-39-23.jpg", category: "Events", alt: "Association event" },
  { src: "photo_2026-08-31_14-39-31.jpg", category: "Barbers", alt: "Barber professional portrait" },
  { src: "photo_2026-08-31_14-39-45.jpg", category: "Events", alt: "Community sports event" },
  { src: "photo_2026-08-31_14-39-52.jpg", category: "Training", alt: "Skills development workshop" },
  { src: "photo_2026-08-31_14-40-00.jpg", category: "Community", alt: "Members community activity" },
  { src: "photo_2026-08-31_14-40-16.jpg", category: "Barbershops", alt: "Modern barbershop" },
  { src: "photo_2026-08-31_14-40-24.jpg", category: "Beard Grooming", alt: "Beard styling expertise" },
];

export const GALLERY_CATEGORIES = [
  "All",
  "Hair Styling",
  "Beard Grooming",
  "Barbers",
  "Barbershops",
  "Training",
  "Events",
  "Community",
];

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
