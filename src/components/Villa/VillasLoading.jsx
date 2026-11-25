export default function VillasLoading() {
  return (
    <section className="space-y-6" aria-label="Loading villas" aria-busy="true">
      <header className="space-y-3 py-5 md:py-8">
        <div className="h-3 w-32 animate-pulse rounded-full bg-white/35 shadow-[0_0_12px_rgba(255,255,255,.14)]" />
        <div className="h-12 w-56 animate-pulse rounded-2xl bg-white/25 shadow-[0_8px_22px_rgba(0,0,0,.12)]" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded-full bg-white/20" />
      </header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <article className="animate-pulse" key={index} aria-hidden="true">
            <div className="aspect-[4/3] rounded-[1.65rem] bg-white/20 shadow-[0_12px_28px_rgba(0,0,0,.2)]" />
            <div className="mx-2 mt-4 h-3 w-2/3 rounded-full bg-white/25" />
            <div className="mx-2 mt-3 h-6 w-1/2 rounded-full bg-white/30" />
          </article>
        ))}
      </div>
    </section>
  );
}
