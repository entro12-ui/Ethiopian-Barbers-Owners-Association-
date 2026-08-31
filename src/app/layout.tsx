import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Men's Hairdressing & Grooming Association Ethiopia | Professional Barber Community",
  description:
    "A professional association dedicated to modernizing men's hairdressing and grooming in Ethiopia through professional development, workplace safety, health awareness, and community development.",
  keywords: [
    "Barber Association Ethiopia",
    "Men's Hairdressing Ethiopia",
    "Barber Training Ethiopia",
    "Men's Grooming Ethiopia",
    "Barber Professional Development",
    "Barbershop Association Ethiopia",
    "Men's Hair Styling Ethiopia",
    "Beard Grooming Ethiopia",
    "EBOA",
    "Ethiopian Hairdressers and Owners Association",
  ],
  openGraph: {
    title: "Men's Hairdressing & Grooming Association Ethiopia",
    description:
      "Modern Skills. Healthy Professionals. Stronger Community. Join Ethiopia's premier men's grooming professional association.",
    type: "website",
    locale: "en_US",
    images: ["/images/eboa-logo.png"],
  },
  icons: {
    icon: "/images/eboa-logo.png",
    apple: "/images/eboa-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
