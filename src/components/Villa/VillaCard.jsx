import React from "react";
import { Link } from "../NextLink";
import { MapPin, BedDouble, Bath, Ruler, Users, Dot } from "lucide-react";

const VillaCard = ({ villa, compact = false, index = 0 }) => {
  const cardPadding = compact ? "p-4" : "p-5";

  return (
    <Link
      to={`/villa/${villa.id}`}
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
      className="group relative block overflow-hidden rounded-[1.65rem] bg-white/85 text-slate-900 shadow-[0_8px_20px_rgba(25,36,30,.12)] backdrop-blur-md transition duration-300 ease-smooth hover:-translate-y-1 hover:shadow-[0_13px_26px_rgba(25,36,30,.18)] motion-safe:animate-rise dark:bg-[#091327]/75 dark:text-slate-100 dark:shadow-[0_8px_24px_rgba(0,0,0,.28)] dark:hover:shadow-[0_13px_30px_rgba(0,0,0,.4)]"
      aria-label={`Open ${villa.name} details`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={villa.image}
          alt={villa.name}
          className="h-full w-full object-cover transition duration-700 ease-smooth group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
        <span className="absolute bottom-4 right-4 rounded-full bg-[#073b2e]/90 px-4 py-2 text-xs font-semibold text-white opacity-0 shadow-[0_4px_12px_rgba(0,0,0,.2)] transition duration-300 ease-smooth group-hover:opacity-100">
          View stay <span aria-hidden="true">→</span>
        </span>
        <div className="absolute left-4 top-4 rounded-full bg-[#fffaf1]/95 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-[0_3px_9px_rgba(0,0,0,.14)]">
          Rs.{villa.dailyRent} / night
        </div>
      </div>

      <div className={`${cardPadding}`}>
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-300">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {villa.location}
          <Dot className="h-4 w-4" aria-hidden="true" />
          {villa.category}
        </p>

        <h3 className="font-display text-[1.55rem] font-semibold tracking-tight">{villa.name}</h3>

        {Number(villa.reviewCount) > 0 ? (
          <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200" aria-label={`${villa.rating} out of 5 from ${villa.reviewCount} reviews`}>
            <span aria-hidden="true">★</span> {Number(villa.rating).toFixed(1)} <span className="text-slate-500 dark:text-slate-400">({villa.reviewCount} reviews)</span>
          </p>
        ) : null}

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
          <div className="inline-flex items-center gap-2">
            <Users className="h-4 w-4" aria-hidden="true" />
            <span>{villa.guests} Guests</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <BedDouble className="h-4 w-4" aria-hidden="true" />
            <span>{villa.bedrooms} Bedrooms</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <Ruler className="h-4 w-4" aria-hidden="true" />
            <span>{villa.squareMeter} m2</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <Bath className="h-4 w-4" aria-hidden="true" />
            <span>{villa.bathrooms} Bathrooms</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VillaCard;

