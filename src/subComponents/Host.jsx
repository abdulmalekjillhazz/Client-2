import React from "react";
import { Link } from "../components/NextLink";

const Host = () => {
  return (
    <section
      aria-labelledby="host-heading"
      className="host-section relative overflow-hidden rounded-[2rem] border border-slate-900/10 bg-white/75 px-6 py-10 shadow-soft backdrop-blur-md dark:border-white/15 dark:bg-[#091327]/75 md:px-10 md:py-14"
    >
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a5d19] dark:text-[#f0c76e]">Become a host</p>
        <h2 id="host-heading" className="mt-3 font-display text-[clamp(2rem,6vw,2.6rem)] leading-tight text-[#102b43] dark:text-white">
          Manage a property on RoyalCity
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#294862] dark:text-white/80">
          Create an account to add a property, manage its availability, and review incoming booking requests.
        </p>
        <Link
          to="/register"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#edbd62] px-6 text-sm font-semibold text-[#14251e] shadow-[0_8px_20px_rgba(0,0,0,.18)] transition hover:-translate-y-0.5 hover:bg-[#f3ca79]"
        >
          Create an account
        </Link>
      </div>
    </section>
  );
};

export default Host;
