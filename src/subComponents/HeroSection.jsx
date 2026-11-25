import React from "react";
import { useRouter } from "next/navigation";
import { Link } from "../components/NextLink";
import { ArrowRight, CalendarDays, MapPin, Search, Users } from "lucide-react";

const HeroSection = ({ locations = [], maxGuests = 1 }) => {
  const router = useRouter();
  const guestLimit = Math.max(1, Number(maxGuests) || 1);

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
    <section aria-labelledby="hero-heading" className="hero-scene relative isolate flex min-h-[760px] items-center overflow-hidden bg-transparent px-4 pb-16 pt-24 text-white sm:px-6 md:min-h-[min(900px,calc(100svh-64px))] md:px-8 md:py-24">
      <div className="hero-scene__shade absolute inset-0 z-[1]" />
      <div className="hero-layout relative z-10 mx-auto grid w-full max-w-[1440px] items-center gap-10 py-8 lg:grid-cols-[1.04fr_.96fr] lg:gap-12 xl:gap-16">
        <div className="hero-copy max-w-[690px]">
          <p className="hero-eyebrow mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/90 md:text-sm">A more considered kind of escape</p>
          <h1 id="hero-heading" className="max-w-[700px] font-display text-[clamp(2.65rem,8vw,3.35rem)] leading-[1.06] tracking-[-0.04em] text-white sm:text-6xl lg:text-[clamp(4rem,5.6vw,5.25rem)]">
            Find your place <span className="block font-display italic text-[#f4c66b]">to slow down.</span>
          </h1>
          <p className="mt-5 max-w-[540px] text-base leading-7 text-white/85 md:text-lg md:leading-8">
            Explore the current villa collection, compare the details, and find a stay that fits your plans.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#featured-villas" className="hero-primary-action inline-flex min-h-12 items-center gap-3 rounded-full bg-[#f4c66b] px-6 text-sm font-bold text-[#10233d] transition hover:-translate-y-0.5">Explore villas <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            <Link to="/aboutus" className="hero-secondary-action inline-flex min-h-12 items-center rounded-full px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5">How it works</Link>
          </div>
        </div>

        <div className="hero-booking-wrap">
          <p className="hero-booking-kicker" aria-hidden="true">Your next escape, in four easy steps</p>
          <form onSubmit={searchVillas} className="hero-search-form" aria-label="Search villa stays">
            <label className="hero-search-field" htmlFor="hero-place">
              <MapPin className="hero-search-icon" aria-hidden="true" />
              <span className="hero-search-copy"><span className="hero-search-label">Destination</span>
                <select id="hero-place" name="place" defaultValue="" className="hero-search-control">
                  <option value="">Anywhere</option>
                  {locations.map((location) => <option key={location} value={location}>{location}</option>)}
                </select>
              </span>
            </label>
            <label className="hero-search-field" htmlFor="hero-start-date">
              <CalendarDays className="hero-search-icon" aria-hidden="true" />
              <span className="hero-search-copy"><span className="hero-search-label">Check-in</span>
                <input id="hero-start-date" name="startDate" type="date" required className="hero-search-control" aria-label="Check-in date" />
              </span>
            </label>
            <label className="hero-search-field" htmlFor="hero-end-date">
              <CalendarDays className="hero-search-icon" aria-hidden="true" />
              <span className="hero-search-copy"><span className="hero-search-label">Check-out</span>
                <input id="hero-end-date" name="endDate" type="date" required className="hero-search-control" aria-label="Check-out date" />
              </span>
            </label>
            <label className="hero-search-field" htmlFor="hero-guests">
              <Users className="hero-search-icon" aria-hidden="true" />
              <span className="hero-search-copy"><span className="hero-search-label">Guests</span>
                <input id="hero-guests" name="guests" type="number" min="1" max={guestLimit} defaultValue={Math.min(2, guestLimit)} required className="hero-search-control" aria-label="Number of guests" />
              </span>
            </label>
            <button type="submit" className="hero-search-submit"><Search className="h-[18px] w-[18px]" aria-hidden="true" /> Find a stay <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
