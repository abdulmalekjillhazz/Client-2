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
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#f0c76e]">
            Current collection
          </p>
          <h2 id="top-villas-heading" className="font-display text-[2.7rem] leading-[1.04] tracking-[-0.035em] md:text-[3.7rem]">
            Find your kind of escape
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">
            Explore the available stays and compare location, guest capacity, and each listing&apos;s details.
          </p>
        </div>
        <Link
          to="/villas"
          className="inline-flex h-11 items-center justify-center rounded-full bg-white/10 px-5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(0,0,0,.16)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
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
