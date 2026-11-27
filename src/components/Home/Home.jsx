import React from "react";
import HeroSection from "../../subComponents/HeroSection";
import TopVillas from "../../subComponents/TopVillas";
import Regions from "../../subComponents/Regions";
import Host from "../../subComponents/Host";
import About from "../../subComponents/About";
import Contact from "../../subComponents/Contact";
import { useVillasData } from "../../hooks/useVillasData";
import PageContainer from "../Layout/PageContainer";

const Home = () => {
  const { villas, isLoading, error, retry } = useVillasData();
  const locations = [...new Set(villas.map((villa) => villa.location).filter(Boolean))].sort();
  const maxGuests = Math.max(1, ...villas.map((villa) => Number(villa.guests) || 0));

  return (
    <article className="-mt-28 overflow-hidden bg-transparent pt-28 text-[#f4efe6] transition-colors duration-300" aria-label="Home page content">
      <HeroSection locations={locations} maxGuests={maxGuests} />
      <PageContainer className="space-y-12 px-5 py-16 md:space-y-16 md:px-10 md:py-20">
        <div id="featured-villas" className="scroll-mt-28"><TopVillas villas={villas} isLoading={isLoading} error={error} onRetry={retry} /></div>
        <Regions villas={villas} isLoading={isLoading} />
        <Host />
        <About />
        <Contact />
      </PageContainer>
    </article>
  );
};

export default Home;
