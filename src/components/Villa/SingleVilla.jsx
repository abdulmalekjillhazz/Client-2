import React, { useEffect, useMemo, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Link } from "../NextLink";
import { api } from "../../context/api";
import { useAuth } from "../../context/AuthContext";
import { useVillasData } from "../../hooks/useVillasData";
import BookingPanel from "./BookingPanel";
import Reviews from "./Reviews";
import { EmptyState, ErrorState, LoadingCards } from "../Feedback/AsyncStates";
import { ArrowLeft, ArrowRight, Bath, BedDouble, ChevronLeft, ChevronRight, MapPin, Users, X } from "lucide-react";

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
    <section className="space-y-6 rounded-card border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900 md:p-8">
      <header>
        <button
          type="button"
          className="mb-3 inline-flex items-center gap-2 border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-[#2a2a2a] dark:bg-[#111111] dark:text-slate-100 dark:hover:bg-[#171717]"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Go Back
        </button>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">Villa details</p>
        <h1 className="mt-2 font-display text-[2.8rem] leading-none md:text-[3.7rem]">{filteredVilla.name}</h1>
        <p className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {filteredVilla.location}
        </p>
        {filteredVilla.description ? (
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">{filteredVilla.description}</p>
        ) : null}
        {user ? (
          <button
            type="button"
            onClick={toggleSave}
            className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
          >
            {saved ? "Saved" : "Save villa"}
          </button>
        ) : (
          <Link to={`/login?next=${encodeURIComponent(pathname)}`} className="mt-4 inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 px-5 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:text-slate-100">
            Sign in to save
          </Link>
        )}
        {saveError ? <p className="mt-2 text-sm text-red-600">{saveError}</p> : null}
      </header>

      <div className={`grid grid-cols-1 gap-4 ${galleryImages.length > 1 ? "xl:grid-cols-[2fr_1fr]" : ""}`}>
        <button
          type="button"
          className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700"
          onClick={() => openLightbox(0)}
          aria-label="Open main villa image in full screen"
        >
          <div className="aspect-[4/3]">
            <img
              src={galleryImages[0].src}
              alt={galleryImages[0].alt}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            <span className="absolute bottom-3 right-3 border border-white/35 bg-black/55 px-2 py-1 text-xs font-semibold text-white">
              Click to expand
            </span>
          </div>
        </button>
        {galleryImages.length > 1 ? <div className="grid grid-cols-2 gap-3">
          {galleryImages.slice(1).map((image, idx) => (
            <button
              key={image.src}
              type="button"
              className="group overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700"
              onClick={() => openLightbox(idx + 1)}
              aria-label={`Open image ${idx + 2} in full screen`}
            >
              <div className="aspect-square">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </button>
          ))}
        </div> : null}
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-surface-900 dark:text-slate-200 md:grid-cols-4">
        <div className="inline-flex min-w-0 items-center gap-2 text-xs sm:text-sm">
          <BedDouble className="h-4 w-4" aria-hidden="true" />
          <span className="sm:hidden">{filteredVilla.bedrooms} beds</span>
          <span className="hidden sm:inline">{filteredVilla.bedrooms} Bedrooms</span>
        </div>
        <div className="inline-flex min-w-0 items-center gap-2 text-xs sm:text-sm">
          <Users className="h-4 w-4" aria-hidden="true" />
          {filteredVilla.guests} guests
        </div>
        <div className="inline-flex min-w-0 items-center gap-2 text-xs sm:text-sm">
          <Bath className="h-4 w-4" aria-hidden="true" />
          <span className="sm:hidden">{filteredVilla.bathrooms} baths</span>
          <span className="hidden sm:inline">{filteredVilla.bathrooms} Bathrooms</span>
        </div>
        <div className="inline-flex min-w-0 items-center gap-2 text-xs sm:text-sm">{filteredVilla.squareMeter} m2</div>
      </div>

      <BookingPanel villa={filteredVilla} user={user} />
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

      <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
        <h2 className="font-display text-[2.1rem] leading-none">Location</h2>
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
          {filteredVilla.location}
        </p>
      </div>

      {activeImageIndex !== null ? (
        <div className="fixed inset-0 z-[260] bg-black/95 p-4 text-white md:p-8">
          <div className="mx-auto flex h-full w-full max-w-[1480px] flex-col">
            <div className="mb-3 flex items-center justify-between">
              {galleryImages.length > 1 ? <button
                type="button"
                onClick={closeLightbox}
                className="inline-flex items-center gap-2 border border-white/30 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Go Back
              </button> : null}
              {galleryImages.length > 1 ? <button
                type="button"
                onClick={closeLightbox}
                className="inline-flex h-10 w-10 items-center justify-center border border-white/30 bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Close image viewer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button> : null}
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden border border-white/20 bg-black">
              <img
                src={galleryImages[activeImageIndex].src}
                alt={galleryImages[activeImageIndex].alt}
                className="lightbox-pop max-h-full w-auto max-w-full object-contain"
              />

              <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 border border-white/30 bg-black/50 p-2 text-white transition hover:bg-black/70"
                onClick={showPrev}
                aria-label="Show previous image"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 border border-white/30 bg-black/50 p-2 text-white transition hover:bg-black/70"
                onClick={showNext}
                aria-label="Show next image"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {galleryImages.length > 1 ? <div className="mt-3 grid grid-cols-5 gap-2">
              {galleryImages.map((image, index) => (
                <button
                  key={`preview-${image.src}`}
                  type="button"
                  className={`overflow-hidden border ${
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
            </div> : null}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default SingleVilla;

