export const SITE_NAME = "Men's Hairdressing & Grooming Association";
export const SITE_SHORT_NAME = "EBOA";
export const SITE_TAGLINE = "Modern Skills. Healthy Professionals. Stronger Community.";

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

export const STATS = [
  { value: 500, suffix: "+", label: "Professional Members", placeholder: true },
  { value: 50, suffix: "+", label: "Training Programs", placeholder: true },
  { value: 20, suffix: "+", label: "Community Events", placeholder: true },
  { value: 10, suffix: "+", label: "Years of Professional Development", placeholder: true },
];

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Goals", href: "#goals" },
  { label: "Professional Development", href: "#development" },
  { label: "Health & Safety", href: "#health-safety" },
  { label: "Membership", href: "#membership" },
  { label: "Events", href: "#events" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
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

export const EVENTS = [
  {
    id: 1,
    title: "Annual Sports & Mazega Day",
    date: "2026-03-15",
    location: "Addis Ababa",
    category: "Sports & Mazega",
    description: "A day of sports activities and Mazega to promote physical health and social connection among members.",
    image: "photo_2026-08-31_14-39-45.jpg",
  },
  {
    id: 2,
    title: "Modern Hair Styling Workshop",
    date: "2026-04-20",
    location: "Addis Ababa",
    category: "Professional Training",
    description: "Hands-on training in contemporary men's haircutting and styling techniques from international experts.",
    image: "photo_2026-08-31_14-38-33.jpg",
  },
  {
    id: 3,
    title: "Beard Grooming Masterclass",
    date: "2026-05-10",
    location: "Addis Ababa",
    category: "Grooming Workshops",
    description: "Professional skills in beard shaping, trimming, styling, and maintenance.",
    image: "photo_2026-08-31_14-38-47.jpg",
  },
  {
    id: 4,
    title: "Workplace Safety Training",
    date: "2026-06-05",
    location: "Addis Ababa",
    category: "Workplace Safety Training",
    description: "Essential safety and hygiene training for barbering professionals.",
    image: "photo_2026-08-31_14-39-16.jpg",
  },
  {
    id: 5,
    title: "Occupational Health Awareness",
    date: "2026-07-12",
    location: "Addis Ababa",
    category: "Health Awareness",
    description: "Raising awareness about health challenges faced by barbering professionals.",
    image: "photo_2026-08-31_14-39-23.jpg",
  },
  {
    id: 6,
    title: "Quarterly Association Meeting",
    date: "2026-08-01",
    location: "Addis Ababa",
    category: "Association Meetings",
    description: "Quarterly gathering of members to discuss association progress and plans.",
    image: "photo_2026-08-31_14-40-00.jpg",
  },
  {
    id: 7,
    title: "Professional Networking Event",
    date: "2026-09-18",
    location: "Addis Ababa",
    category: "Networking Events",
    description: "Connect with fellow grooming professionals and share industry knowledge.",
    image: "photo_2026-08-31_14-40-16.jpg",
  },
  {
    id: 8,
    title: "Facial Care & Grooming Seminar",
    date: "2026-10-25",
    location: "Addis Ababa",
    category: "Grooming Workshops",
    description: "Modern men's facial care and grooming practices for professional barbers.",
    image: "photo_2026-08-31_14-38-52.jpg",
  },
];

export const EVENT_CATEGORIES = [
  "All",
  "Sports & Mazega",
  "Professional Training",
  "Grooming Workshops",
  "Health Awareness",
  "Workplace Safety Training",
  "Association Meetings",
  "Networking Events",
];

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
