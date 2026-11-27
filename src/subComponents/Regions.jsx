import React from "react";
import Image from "next/image";
import { Link } from "../components/NextLink";

const Regions = ({ villas, isLoading }) => {
  const destinations = [...new Set(villas.map((villa) => villa.location).filter(Boolean))].slice(0, 4);

  return (
    <section
      aria-labelledby="regions-heading"
      className="destination-section py-2 md:py-4"
    >
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#8a5d19] dark:text-[#f0c76e]">Explore by place</p>
      <h2 id="regions-heading" className="font-display text-[2.4rem] leading-[1.04] tracking-[-0.03em] text-[#102b43] dark:text-white md:text-[3.2rem]">
        Destinations in this collection
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#294862] dark:text-white/75">
        Browse the current collection by setting, then review each villa&apos;s listing details.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {isLoading && destinations.length === 0 ? (
          Array.from({ length: 2 }).map((_, index) => (
            <div key={`region-skeleton-${index}`} className="aspect-[16/10] animate-pulse rounded-[1.5rem] bg-white/30 dark:bg-white/10" aria-hidden="true" />
          ))
        ) : (
          destinations.map((destination) => {
            const villa = villas.find((item) => item.location === destination);
            const count = villas.filter((item) => item.location === destination).length;
            return (
              <Link
                key={destination}
                to={`/villas?place=${encodeURIComponent(destination)}`}
                className="group relative block overflow-hidden rounded-[1.5rem] border border-slate-900/10 bg-slate-900 shadow-[0_10px_24px_rgba(15,30,24,.14)] transition duration-300 ease-smooth hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,30,24,.2)] dark:border-white/15 dark:shadow-[0_8px_18px_rgba(0,0,0,.28)]"
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={villa?.image || "/villa6.jpg"}
                    alt={`Villa in ${destination}`}
                    fill
                    sizes="(max-width: 767px) 100vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="font-display text-[2.1rem] leading-none">{destination}</h3>
                  <p className="mt-2 inline-flex rounded-pill bg-white/18 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-sm">
                    {`${count} ${count === 1 ? "villa" : "villas"}`}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
};

export default Regions;
