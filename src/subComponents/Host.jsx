import React from "react";
import { Link } from "../components/NextLink";

const Host = () => {
  return (
    <section
      aria-labelledby="host-heading"
      className="host-section relative px-pagex py-16 md:px-pagexl md:py-24"
    >
      <div className="relative mx-auto max-w-[1200px]">
        <div className="max-w-xl text-white [text-shadow:0_2px_12px_rgba(0,0,0,.65)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f0c76e]">Become a host</p>
          <h2 id="host-heading" className="mt-3 font-display text-[2.6rem] leading-none">
            Manage a property on RoyalCity
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/80">
            Create an account to add a property, manage its availability, and review incoming booking requests.
          </p>
          <Link
            to="/register"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#edbd62] px-5 text-sm font-semibold text-[#14251e] shadow-[0_8px_20px_rgba(0,0,0,.24)] hover:bg-[#f3ca79]"
          >
            Create an account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Host;
