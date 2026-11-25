"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import VillaCard from "./VillaCard";
import { useVillasData } from "../../hooks/useVillasData";
import { api } from "../../context/api";
import { EmptyState, ErrorState, LoadingCards } from "../Feedback/AsyncStates";

const Villas = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { villas, isLoading, error, retry } = useVillasData();
  const [availableVillaIds, setAvailableVillaIds] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const places = [...new Set(villas.map((villa) => villa.location).filter(Boolean))].sort();
  const categories = [...new Set(villas.map((villa) => villa.category).filter(Boolean))].sort();
  const place = searchParams.get("place") || "";
  const category = searchParams.get("category") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const guestCount = Number(searchParams.get("guests") || 0);

  useEffect(() => {
    if (!startDate && !endDate) {
      setAvailableVillaIds(null);
      setAvailabilityError("");
      setCheckingAvailability(false);
      return undefined;
    }

    if (!startDate || !endDate || endDate <= startDate) {
      setAvailableVillaIds(new Set());
      setAvailabilityError("Choose a check-out date after check-in to search availability.");
      setCheckingAvailability(false);
      return undefined;
    }

    let cancelled = false;
    setCheckingAvailability(true);
    setAvailabilityError("");
    const candidates = villas.filter((villa) =>
      (!place || villa.location === place) &&
      (!category || villa.category === category) &&
      (!guestCount || Number(villa.guests) >= guestCount)
    );

    Promise.all(candidates.map(async (villa) => {
      const params = new URLSearchParams({ startDate, endDate, guests: String(guestCount || 1) });
      const result = await api(`/villas/${villa.id}/availability?${params}`);
      return result.available ? villa.id : null;
    }))
      .then((results) => {
        if (!cancelled) setAvailableVillaIds(new Set(results.filter((id) => id !== null)));
      })
      .catch(() => {
        if (!cancelled) {
          setAvailableVillaIds(null);
          setAvailabilityError("We could not verify those dates. Open a villa to check availability.");
        }
      })
      .finally(() => {
        if (!cancelled) setCheckingAvailability(false);
      });

    return () => { cancelled = true; };
  }, [villas, place, category, startDate, endDate, guestCount]);

  const filteredVillas = villas.filter((villa) => {
    if (place && villa.location !== place) return false;
    if (category && villa.category !== category) return false;
    if (guestCount && Number(villa.guests) < guestCount) return false;
    if (availableVillaIds && !availableVillaIds.has(villa.id)) return false;
    return true;
  });

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    router.replace(`${pathname}${next.size ? `?${next.toString()}` : ""}`, { scroll: false });
  };

  const clearStaySearch = () => {
    const next = new URLSearchParams(searchParams);
    ["startDate", "endDate", "guests"].forEach((key) => next.delete(key));
    router.replace(`${pathname}${next.size ? `?${next.toString()}` : ""}`, { scroll: false });
  };

  const hasStaySearch = Boolean(startDate || endDate || guestCount);

  return (
    <section className="space-y-6" aria-labelledby="all-villas-heading">
      <header className="py-5 text-shadow-soft md:py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">Villa directory</p>
        <h1 id="all-villas-heading" className="mt-2 font-display text-[2.8rem] leading-none md:text-[3.7rem]">
          All Villas
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
          {isLoading ? "Loading properties..." : checkingAvailability ? "Checking your dates..." : `${filteredVillas.length} ${hasStaySearch ? "stays match your search" : "properties available"}`}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {[{ key: "place", label: "Anywhere", value: "" }, ...places.map((item) => ({ key: "place", label: item, value: item }))].map((item) => (
            <FilterChip key={`place-${item.label}`} active={place === item.value} onClick={() => setFilter("place", item.value)}>
              {item.label}
            </FilterChip>
          ))}
          {categories.map((item) => (
            <FilterChip key={item} active={category === item} onClick={() => setFilter("category", category === item ? "" : item)}>
              {item}
            </FilterChip>
          ))}
        </div>
        {hasStaySearch ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            {startDate && endDate ? <span className="rounded-full bg-surface-100 px-3 py-1.5 dark:bg-white/10">{startDate} to {endDate}</span> : null}
            {guestCount ? <span className="rounded-full bg-surface-100 px-3 py-1.5 dark:bg-white/10">{guestCount} guests</span> : null}
            <button type="button" onClick={clearStaySearch} className="rounded-full px-3 py-1.5 font-semibold text-brand-700 underline underline-offset-2 dark:text-brand-300">Clear stay search</button>
          </div>
        ) : null}
        {availabilityError ? <p role="status" className="mt-3 text-sm text-amber-800 dark:text-amber-200">{availabilityError}</p> : null}
      </header>

      {isLoading || checkingAvailability ? <LoadingCards count={6} /> : null}

      {!isLoading && !checkingAvailability && error ? (
        <ErrorState
          title="Failed to load villas"
          description={error}
          retryLabel="Retry request"
          onRetry={retry}
        />
      ) : null}

      {!isLoading && !checkingAvailability && !error && filteredVillas.length === 0 ? (
        <EmptyState
          title={place || category ? "No villas match these filters" : "No villas available"}
          description={place || category ? "Try a different destination or villa type." : "No listings found. Please check back shortly."}
        />
      ) : null}

      {!isLoading && !checkingAvailability && !error && filteredVillas.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredVillas.map((villa, index) => (
            <VillaCard key={villa.id} villa={villa} index={index} />
          ))}
        </div>
      ) : null}
    </section>
  );
};

const FilterChip = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`h-9 rounded-full px-4 text-sm font-medium transition duration-200 ease-smooth ${
      active
        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
        : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-surface-900 dark:text-slate-100 dark:hover:bg-slate-800"
    }`}
  >
    {children}
  </button>
);

export default Villas;

