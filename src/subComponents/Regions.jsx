import React from "react";
import { Link } from "../components/NextLink";

const Regions = ({ villas, isLoading }) => {
  const destinations = [...new Set(villas.map((villa) => villa.location).filter(Boolean))].slice(0, 4);

  return (
    <section
      aria-labelledby="regions-heading"
      className="destination-section p-2 text-white md:p-4"
    >
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#9a6722] dark:text-[#e5b75f]">Explore by place</p>
      <h2 id="regions-heading" className="font-display text-[2.5rem] leading-[1.04] tracking-[-0.03em] md:text-[3.2rem]">
        Destinations in this collection
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">
        Browse the current collection by setting, then review each villa&apos;s listing details.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {destinations.map((destination, index) => {
          const villa = villas.find((item) => item.location === destination);
          return (
          <Link
            key={destination}
            to={`/villas?place=${encodeURIComponent(destination)}`}
            className="group relative block overflow-hidden rounded-[1.5rem] shadow-[0_8px_18px_rgba(15,30,24,.11)] transition duration-300 ease-smooth hover:-translate-y-1 hover:shadow-[0_12px_23px_rgba(15,30,24,.16)] dark:shadow-[0_8px_18px_rgba(0,0,0,.28)]"
          >
            <div className="aspect-[5/4]">
              <img
                src={villa?.image}
                alt={`Villa in ${destination}`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <h3 className="font-display text-[2.1rem] leading-none">{destination}</h3>
              <p className="mt-2 inline-flex rounded-pill bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-sm">
                {isLoading
                  ? "Loading..."
                  : `${villas.filter((item) => item.location === destination).length} ${villas.filter((item) => item.location === destination).length === 1 ? "villa" : "villas"}`}
              </p>
            </div>
          </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Regions;
