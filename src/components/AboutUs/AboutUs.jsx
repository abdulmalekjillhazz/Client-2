import React from "react";
import AboutComponentMini from "../../subComponents/About";
const AboutUs = () => {
  return (
    <section className="space-y-8" aria-labelledby="about-page-heading">
      <div className="grid grid-cols-1 items-center gap-8 py-5 md:grid-cols-[1.1fr_1fr] md:py-8">
        <div className="group/cover">
          <div className="relative overflow-hidden rounded-[2rem] shadow-[0_24px_60px_rgba(0,10,25,.28)] transition-shadow duration-500 hover:shadow-[0_28px_70px_rgba(0,10,25,.34)]">
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-indigo-500/0 via-sky-400/0 to-cyan-400/0 opacity-0 transition duration-500 group-hover/cover:opacity-100 group-hover/cover:from-indigo-500/20 group-hover/cover:via-sky-400/10 group-hover/cover:to-cyan-400/20" />
          <div className="aspect-[4/3]">
            <img
              src="https://plus.unsplash.com/premium_photo-1661749309788-0bba60b81222?w=1200&q=80"
              alt="Modern living room in a villa"
              className="h-full w-full object-cover transition duration-700 ease-out group-hover/cover:scale-[1.025]"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
        </div>
        <div className="space-y-4 text-shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">About RoyalCity</p>
          <h1 id="about-page-heading" className="font-display text-[2.8rem] leading-none md:text-[3.7rem]">
            Find a villa that fits your stay
          </h1>
          <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
            Browse the current villa listings and compare the information available for each stay.
          </p>
          <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
            Each listing page shows its available photos, location, capacity, and booking date check.
          </p>
          <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
            Check the details and dates before you decide to book.
          </p>
        </div>
      </div>
      <AboutComponentMini />
    </section>
  );
};

export default AboutUs;

