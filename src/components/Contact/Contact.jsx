import React from "react";
import SubContact from "../../subComponents/Contact";

const Contact = () => {
  return (
    <section className="mx-auto max-w-[1120px] space-y-6" aria-labelledby="contact-page-heading">
      <header className="pt-4 text-shadow-soft md:pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a5d19] dark:text-[#f0c76e]">Contact us</p>
        <h1 id="contact-page-heading" className="mt-2 font-display text-[clamp(2.1rem,8vw,2.8rem)] leading-tight text-[#102b43] dark:text-white md:text-[3.7rem]">
          Planning your next stay?
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700 dark:text-slate-200">
          Use the form below to ask about a villa, confirm travel dates, or discuss listing a property.
        </p>
      </header>

      <SubContact hideHeading />
    </section>
  );
};

export default Contact;

