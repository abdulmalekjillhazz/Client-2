import React from "react";
import { Link } from "../components/NextLink";
import VillaCard from "../components/Villa/VillaCard";
import { EmptyState, ErrorState, LoadingCards } from "../components/Feedback/AsyncStates";

const TopVillas = ({ villas, isLoading, error, onRetry }) => {
  const featuredVillas = villas.slice(0, 3);

  return (
    <section aria-labelledby="top-villas-heading">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#8a5d19] dark:text-[#f0c76e]">
            Current collection
          </p>
          <h2 id="top-villas-heading" className="font-display text-[2.5rem] leading-[1.04] tracking-[-0.035em] text-[#102b43] dark:text-white md:text-[3.5rem]">
            Find your kind of escape
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#294862] dark:text-slate-300 md:text-base">
            Explore the available stays and compare location, guest capacity, and each listing&apos;s details.
          </p>
        </div>
        <Link
          to="/villas"
          prefetch
          className="inline-flex h-11 items-center justify-center rounded-full border border-slate-900/15 bg-white/85 px-5 text-sm font-semibold text-[#10233d] shadow-[0_4px_14px_rgba(16,35,61,.12)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:shadow-[0_4px_14px_rgba(0,0,0,.16)] dark:hover:bg-white/15"
        >
          See all villas
        </Link>
      </div>

      {isLoading ? <LoadingCards count={3} /> : null}

      {!isLoading && error ? (
        <ErrorState
          title="Featured villas failed to load"
          description={error}
          retryLabel="Retry loading villas"
          onRetry={onRetry}
        />
      ) : null}

      {!isLoading && !error && featuredVillas.length === 0 ? (
        <EmptyState
          title="No featured villas available"
          description="Try again in a moment or adjust your data source."
        />
      ) : null}

      {!isLoading && !error && featuredVillas.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredVillas.map((villa, index) => (
            <VillaCard key={villa.id} villa={villa} index={index} />
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default TopVillas;
