import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Link } from "../NextLink";
import { api } from "../../context/api";
import { useAuth } from "../../context/AuthContext";
import { useVillasData } from "../../hooks/useVillasData";
import BookingPanel from "./BookingPanel";
import Reviews from "./Reviews";
import { EmptyState, ErrorState, LoadingCards } from "../Feedback/AsyncStates";
import { ArrowLeft, ArrowRight, Bath, BedDouble, ChevronLeft, ChevronRight, Expand, MapPin, Ruler, Users, X } from "lucide-react";

const SingleVilla = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams();
  const numericId = Number(id);
  const { user } = useAuth();
  const { villas, isLoading, error, retry } = useVillasData();
  const filteredVilla = villas.find((villa) => villa.id === numericId);
  const villaId = filteredVilla?.id;
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [showMobileBooking, setShowMobileBooking] = useState(false);

  useEffect(() => {
    setShowMobileBooking(false);
    if (villaId == null) return undefined;
    const bookingPanel = document.getElementById("booking-panel");
    if (!bookingPanel) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setShowMobileBooking(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setShowMobileBooking(!entry.isIntersecting && entry.boundingClientRect.top > 0);
    }, { threshold: 0.1 });
    observer.observe(bookingPanel);
    return () => observer.disconnect();
  }, [villaId]);

  useEffect(() => {
    if (!user) {
      setSaved(false);
      return;
    }
    api("/api/favorites")
      .then((list) => setSaved(list.some((item) => String(item.villaId) === String(numericId))))
      .catch(() => setSaved(false));
  }, [user, numericId]);

  const toggleSave = async () => {
    setSaveError("");
    try {
      if (saved) {
        await api(`/api/favorites/${numericId}`, { method: "DELETE" });
        setSaved(false);
      } else {
        await api(`/api/favorites/${numericId}`, { method: "POST" });
        setSaved(true);
      }
    } catch (requestError) {
      setSaveError(requestError.message);
    }
  };

  const galleryImages = useMemo(() => {
    if (!filteredVilla) {
      return [];
    }

    return [
      { src: filteredVilla.image, alt: `${filteredVilla.name} hero view` },
    ];
  }, [filteredVilla]);

  const openLightbox = (index) => setActiveImageIndex(index);
  const closeLightbox = () => setActiveImageIndex(null);
  const showPrev = () =>
    setActiveImageIndex((prev) => (prev === null ? null : (prev - 1 + galleryImages.length) % galleryImages.length));
  const showNext = () =>
    setActiveImageIndex((prev) => (prev === null ? null : (prev + 1) % galleryImages.length));

  useEffect(() => {
    if (activeImageIndex === null) {
      return undefined;
    }

    const lenis = window.__lenis;
    lenis?.stop?.();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closeLightbox();
        return;
      }
      if (event.key === "ArrowLeft") {
        showPrev();
        return;
      }
      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      lenis?.start?.();
    };
  }, [activeImageIndex, galleryImages.length]);

  if (isLoading) {
    return (
      <section aria-label="Loading villa details">
        <LoadingCards count={1} />
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <ErrorState title="Failed to load villa details" description={error} onRetry={retry} />
      </section>
    );
  }

  if (!filteredVilla) {
    return (
      <section>
        <EmptyState
          title="Villa not found"
          description="The requested villa does not exist. Please return to the villas list."
        />
      </section>
    );
  }

  return (
    <section className="space-y-8 rounded-card border border-slate-200 bg-white/95 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-surface-900 md:p-8">
      <div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/15 dark:bg-[#11192b] dark:text-slate-100 dark:hover:bg-[#18233a]"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Go Back
        </button>
      </div>

      <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[1.3fr_1fr] lg:gap-9">
        <div className="space-y-5">
          <div className={`grid grid-cols-1 gap-4 ${galleryImages.length > 1 ? "xl:grid-cols-[2fr_1fr]" : ""}`}>
            <button
              type="button"
              className="group relative block w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-900/20 text-left dark:border-slate-700"
              onClick={() => openLightbox(0)}
              aria-label="Open main villa image in full screen"
            >
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={galleryImages[0].src || "/villa6.jpg"}
                  alt={galleryImages[0].alt}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 58vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
                <span className="absolute bottom-3.5 right-3.5 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-slate-950/70 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                  <Expand className="h-3.5 w-3.5" aria-hidden="true" />
                  Expand photo
                </span>
              </div>
            </button>
            {galleryImages.length > 1 ? (
              <div className="grid grid-cols-2 gap-3">
                {galleryImages.slice(1).map((image, idx) => (
                  <button
                    key={image.src}
                    type="button"
                    className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700"
                    onClick={() => openLightbox(idx + 1)}
                    aria-label={`Open image ${idx + 2} in full screen`}
                  >
                    <div className="relative aspect-square w-full">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 1023px) 50vw, 20vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-surface-950/70 dark:text-slate-200 sm:grid-cols-4">
            <div className="inline-flex min-w-0 items-center gap-2 text-xs sm:text-sm">
              <BedDouble className="h-4 w-4 shrink-0 text-brand-600 dark:text-[#f0c76e]" aria-hidden="true" />
              <span className="sm:hidden">{filteredVilla.bedrooms} beds</span>
              <span className="hidden sm:inline">{filteredVilla.bedrooms} Bedrooms</span>
            </div>
            <div className="inline-flex min-w-0 items-center gap-2 text-xs sm:text-sm">
              <Users className="h-4 w-4 shrink-0 text-brand-600 dark:text-[#f0c76e]" aria-hidden="true" />
              <span>{filteredVilla.guests} guests</span>
            </div>
            <div className="inline-flex min-w-0 items-center gap-2 text-xs sm:text-sm">
              <Bath className="h-4 w-4 shrink-0 text-brand-600 dark:text-[#f0c76e]" aria-hidden="true" />
              <span className="sm:hidden">{filteredVilla.bathrooms} baths</span>
              <span className="hidden sm:inline">{filteredVilla.bathrooms} Bathrooms</span>
            </div>
            <div className="inline-flex min-w-0 items-center gap-2 text-xs sm:text-sm">
              <Ruler className="h-4 w-4 shrink-0 text-brand-600 dark:text-[#f0c76e]" aria-hidden="true" />
              <span>{filteredVilla.squareMeter} m²</span>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-[#f0c76e]">
              {filteredVilla.category ? `${filteredVilla.category} · Villa details` : "Villa details"}
            </p>
            <h1 className="break-words font-display text-[clamp(2.1rem,6vw,3.1rem)] leading-[1.06] text-slate-900 dark:text-white">{filteredVilla.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {filteredVilla.location}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-slate-900 dark:text-white">Rs.{filteredVilla.dailyRent} / night</span>
            </div>
            {filteredVilla.description ? (
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{filteredVilla.description}</p>
            ) : null}
            <div>
              {user ? (
                <button
                  type="button"
                  onClick={toggleSave}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                >
                  {saved ? "Saved" : "Save villa"}
                </button>
              ) : (
                <Link
                  to={`/login?next=${encodeURIComponent(pathname)}`}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300 px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-white/10"
                >
                  Sign in to save
                </Link>
              )}
              {saveError ? <p className="mt-2 text-sm text-red-600">{saveError}</p> : null}
            </div>
          </header>

          <BookingPanel villa={filteredVilla} user={user} />
        </div>
      </div>

      {showMobileBooking ? (
        <a
          href="#booking-panel"
          className="mobile-booking-shortcut md:hidden"
          aria-label={`Check dates for ${filteredVilla.name}, Rs.${filteredVilla.dailyRent} per night`}
        >
          <span>Rs.{filteredVilla.dailyRent} / night</span>
          <span className="inline-flex items-center gap-2">Check dates <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
        </a>
      ) : null}
      <Reviews villaId={filteredVilla.id} user={user} />

      <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
        <h2 className="font-display text-[1.9rem] leading-none">Location</h2>
        <p className="mt-2.5 text-sm text-slate-700 dark:text-slate-300">
          {filteredVilla.location}
        </p>
      </div>

      {activeImageIndex !== null ? (
        <div className="fixed inset-0 z-[260] bg-black/95 p-4 text-white md:p-8" role="dialog" aria-modal="true" aria-label={`${filteredVilla.name} photo viewer`}>
          <div className="mx-auto flex h-full w-full max-w-[1480px] flex-col">
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={closeLightbox}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to villa
              </button>
              <button
                type="button"
                onClick={closeLightbox}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Close image viewer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-black">
              <img
                src={galleryImages[activeImageIndex].src}
                alt={galleryImages[activeImageIndex].alt}
                className="lightbox-pop max-h-full w-auto max-w-full object-contain"
              />

              {galleryImages.length > 1 ? (
                <>
                  <button
                    type="button"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/50 p-2 text-white transition hover:bg-black/70"
                    onClick={showPrev}
                    aria-label="Show previous image"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/50 p-2 text-white transition hover:bg-black/70"
                    onClick={showNext}
                    aria-label="Show next image"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </>
              ) : null}
            </div>

            {galleryImages.length > 1 ? (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {galleryImages.map((image, index) => (
                  <button
                    key={`preview-${image.src}`}
                    type="button"
                    className={`overflow-hidden rounded-lg border ${
                      index === activeImageIndex ? "border-white" : "border-white/30"
                    }`}
                    onClick={() => openLightbox(index)}
                    aria-label={`Open preview image ${index + 1}`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-16 w-full object-cover md:h-20"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default SingleVilla;

