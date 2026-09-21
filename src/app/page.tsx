import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Goals from "@/components/sections/Goals";
import ProfessionalDevelopment from "@/components/sections/ProfessionalDevelopment";
import HealthSafety from "@/components/sections/HealthSafety";
import Membership from "@/components/sections/Membership";
import PostListSection from "@/components/posts/PostListSection";
import Gallery from "@/components/sections/Gallery";
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
        <PostListSection
          id="events"
          type="event"
          viewAllHref="/events"
        />
        <PostListSection
          type="job"
          viewAllHref="/jobs"
        />
        <PostListSection
          type="announcement"
          types={["announcement", "general"]}
          viewAllHref="/news"
        />
        <Gallery />
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
