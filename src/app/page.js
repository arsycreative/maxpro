import Hero from "@/components/Hero";
import ImageCarousel from "@/components/ImageCarousel";
import EventTypes from "@/components/EventTypes";
import HowToRent from "@/components/HowToRent";
import Advantages from "@/components/Advantages";
import ProductCards from "@/components/ProductCards";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import { RentalTerms } from "@/components/RentalTerms";
import { ServiceTypes } from "@/components/ServiceTypes";

export default function Home() {
  return (
    <>
      <Hero />
      <ImageCarousel />
      <EventTypes />
      <ServiceTypes />
      <HowToRent />
      <Advantages />
      <ProductCards />
      <RentalTerms />
      <Testimonials />
      <FAQ />
    </>
  );
}
