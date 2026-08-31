import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Goals from "@/components/sections/Goals";
import ProfessionalDevelopment from "@/components/sections/ProfessionalDevelopment";
import HealthSafety from "@/components/sections/HealthSafety";
import Membership from "@/components/sections/Membership";
import Events from "@/components/sections/Events";
import Gallery from "@/components/sections/Gallery";
import Community from "@/components/sections/Community";
import Statistics from "@/components/sections/Statistics";
import CTASection from "@/components/sections/CTASection";
import Contact from "@/components/sections/Contact";
import FAQ from "@/components/sections/FAQ";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Goals />
        <ProfessionalDevelopment />
        <HealthSafety />
        <Membership />
        <Events />
        <Gallery />
        <Community />
        <Statistics />
        <CTASection />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
