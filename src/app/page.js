import Hero from "@/components/Hero";
import ImageCarousel from "@/components/ImageCarousel";
import EventTypes from "@/components/EventTypes";
import HowToRent from "@/components/HowToRent";
import Advantages from "@/components/Advantages";
import ProductCards from "@/components/ProductCards";
// import PricingSection from "@/components/PricingSection";
import Testimonials from "@/components/Testimonials";
// import Clients from "@/components/Clients";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <>
      <Hero />
      <ImageCarousel />
      <EventTypes />
      <HowToRent />
      <Advantages />
      <ProductCards />
      <Testimonials />
      <FAQ />
      {/* <PricingSection />
      <Clients />
      */}
    </>
  );
}
