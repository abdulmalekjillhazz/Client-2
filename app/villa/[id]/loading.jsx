export default function Loading() {
  return (
    <section className="grid animate-pulse gap-8 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,.7fr)]" aria-label="Loading villa details" aria-busy="true">
      <div className="space-y-6">
        <div className="aspect-[4/3] rounded-[1.75rem] bg-white/20 shadow-[0_14px_34px_rgba(0,0,0,.22)]" />
        <div className="h-9 w-2/3 rounded-xl bg-white/25" />
        <div className="h-4 w-1/2 rounded-full bg-white/20" />
      </div>
      <div className="min-h-80 rounded-[1.75rem] bg-white/20 shadow-[0_14px_34px_rgba(0,0,0,.22)]" />
    </section>
  );
}
