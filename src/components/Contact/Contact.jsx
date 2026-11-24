import React from "react";
import SubContact from "../../subComponents/Contact";

const Contact = () => {
  return (
    <section className="space-y-6" aria-labelledby="contact-page-heading">
      <header className="py-5 text-shadow-soft md:py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">Contact us</p>
        <h1 id="contact-page-heading" className="mt-2 font-display text-[2.8rem] leading-none md:text-[3.7rem]">
          Planning your next stay?
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700 dark:text-slate-300">
          Use the form to ask about a villa, dates, or listing a property.
        </p>
      </header>

      <SubContact />
    </section>
  );
};

export default Contact;

