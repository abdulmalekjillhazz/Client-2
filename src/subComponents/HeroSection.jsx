import React from "react";
import { useRouter } from "next/navigation";
import { Link } from "../components/NextLink";
import { ArrowRight, CalendarDays, MapPin, Search, Users } from "lucide-react";

const HeroSection = ({ locations = [], maxGuests = 1 }) => {
  const router = useRouter();

  const searchVillas = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    ["place", "startDate", "endDate", "guests"].forEach((key) => {
      const value = String(formData.get(key) || "").trim();
      if (value) params.set(key, value);
    });
    router.push(`/villas?${params.toString()}`);
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="hero-scene relative isolate flex min-h-[760px] items-center overflow-hidden bg-transparent px-4 pb-16 pt-24 text-white sm:px-6 md:h-[850px] md:min-h-[850px] md:px-8 md:pb-32 md:pt-28"
    >
      <div className="hero-scene__shade absolute inset-0 z-[1]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-32 bg-gradient-to-t from-[#06122a]/60 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1320px] py-8 md:py-0">
        <div className="max-w-3xl">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/90 md:text-sm">A more considered kind of escape</p>
          <h1 id="hero-heading" className="max-w-3xl font-display text-[clamp(2.65rem,10vw,3.35rem)] leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl md:text-[5.7rem]">
            Find your place <span className="block font-display italic text-[#f0c56e]">to slow down.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/85 md:text-lg">
            Explore the current villa collection, compare the details, and find a stay that fits your plans.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#featured-villas" className="inline-flex h-12 items-center gap-3 rounded-full bg-[#edbd62] px-6 text-sm font-bold text-[#10251e] shadow-[0_8px_22px_rgba(1,20,15,.22)] hover:-translate-y-0.5 hover:bg-[#f3ca79]">Explore villas <ArrowRight className="h-4 w-4" /></a>
            <Link to="/aboutus" className="inline-flex h-12 items-center rounded-full bg-[#10243a] px-6 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,.32)] hover:-translate-y-0.5 hover:bg-[#193451]">How it works</Link>
          </div>
        </div>

        <form onSubmit={searchVillas} className="hero-search-form mx-auto mt-10 grid w-full max-w-[1020px] grid-cols-1 text-white sm:mt-12 sm:grid-cols-2 md:mt-16 lg:grid-cols-[1.2fr_1fr_1fr_.75fr_auto] lg:items-center">
            <label className="hero-search-field flex min-h-14 min-w-0 items-center gap-3 rounded-full px-4 py-2.5 text-shadow-soft transition hover:-translate-y-0.5 focus-within:text-[#ffe1a3]" htmlFor="hero-place">
              <MapPin className="h-5 w-5 shrink-0 text-[#f0c56e] drop-shadow" aria-hidden="true" /><span className="grid min-w-0 gap-1"><span className="text-xs font-bold">Destination</span>
              <select id="hero-place" name="place" defaultValue="" className="hero-search-control h-6 min-w-0 bg-transparent text-sm text-white/90 outline-none">
                <option value="">Anywhere</option>
                {locations.map((location) => <option key={location} value={location}>{location}</option>)}
              </select></span>
            </label>
            <label className="hero-search-field flex min-h-14 min-w-0 items-center gap-3 rounded-full px-4 py-2.5 text-shadow-soft transition hover:-translate-y-0.5 focus-within:text-[#ffe1a3]" htmlFor="hero-start-date">
              <CalendarDays className="h-5 w-5 shrink-0 text-[#f0c56e] drop-shadow" aria-hidden="true" /><span className="grid min-w-0 gap-1"><span className="text-xs font-bold">Check-in</span>
              <input id="hero-start-date" name="startDate" type="date" required className="hero-search-control h-6 min-w-0 bg-transparent text-sm text-white/90 outline-none [color-scheme:dark]" /></span>
            </label>
            <label className="hero-search-field flex min-h-14 min-w-0 items-center gap-3 rounded-full px-4 py-2.5 text-shadow-soft transition hover:-translate-y-0.5 focus-within:text-[#ffe1a3]" htmlFor="hero-end-date">
              <CalendarDays className="h-5 w-5 shrink-0 text-[#f0c56e] drop-shadow" aria-hidden="true" /><span className="grid min-w-0 gap-1"><span className="text-xs font-bold">Check-out</span>
              <input id="hero-end-date" name="endDate" type="date" required className="hero-search-control h-6 min-w-0 bg-transparent text-sm text-white/90 outline-none [color-scheme:dark]" /></span>
            </label>
            <label className="hero-search-field flex min-h-14 min-w-0 items-center gap-3 rounded-full px-4 py-2.5 text-shadow-soft transition hover:-translate-y-0.5 focus-within:text-[#ffe1a3]" htmlFor="hero-guests">
              <Users className="h-5 w-5 shrink-0 text-[#f0c56e] drop-shadow" aria-hidden="true" /><span className="grid min-w-0 gap-1"><span className="text-xs font-bold">Guests</span>
              <input id="hero-guests" name="guests" type="number" min="1" max={maxGuests} defaultValue="2" required className="hero-search-control h-6 w-20 min-w-0 bg-transparent text-sm text-white/90 outline-none" /></span>
            </label>
            <button type="submit" className="hero-search-submit col-span-full inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#073b2e] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 lg:col-span-1 lg:w-auto">
              <Search className="h-4 w-4" /> Find a stay
            </button>
        </form>
      </div>
    </section>
  );
};

export default HeroSection;
