import React from "react";

const steps = [
  {
    number: "01",
    title: "Browse",
    description: "Filter the current collection by destination or villa type.",
  },
  {
    number: "02",
    title: "Compare",
    description: "Review nightly price, location, guest capacity, and property details.",
  },
  {
    number: "03",
    title: "Check dates",
    description: "Choose your dates and guest count to check availability before booking.",
  },
];

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
          <h1 id="about-page-heading" className="font-display text-[clamp(2.1rem,8vw,2.8rem)] leading-tight md:text-[3.7rem]">
            A clearer way to choose a villa
          </h1>
          <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
            RoyalCity brings the current villa collection into one place.
          </p>
          <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
            Compare destination, guest capacity, nightly rates, and the details shown for each stay.
          </p>
          <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
            Open a listing to review its photo and details, then check dates before you book.
          </p>
        </div>
      </div>
      <section aria-labelledby="about-steps-heading" className="space-y-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">How it works</p>
          <h2 id="about-steps-heading" className="mt-2 font-display text-[clamp(1.8rem,6vw,2.5rem)] leading-tight">
            Plan your stay in three steps
          </h2>
        </div>
        <ol className="grid gap-3 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.number} className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-soft dark:border-slate-700 dark:bg-surface-900/80">
              <span className="text-xs font-bold tracking-[0.16em] text-brand-700 dark:text-brand-300">{step.number}</span>
              <h3 className="mt-3 font-display text-2xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
};

export default AboutUs;

