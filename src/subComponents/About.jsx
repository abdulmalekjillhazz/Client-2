"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

const gallery = [
  {
    src: "/landing.jpg",
    alt: "Oceanfront villa terrace with infinity pool",
  },
  {
    src: "/contact.jpg",
    alt: "Poolside lounge overlooking sea and mountain horizon",
  },
  {
    src: "/villa2.jpg",
    alt: "Warm modern villa bedroom opening onto forest views",
  },
];

const About = () => {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % gallery.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  const showImage = (direction) => {
    setActiveImage((current) => (current + direction + gallery.length) % gallery.length);
  };

  return (
    <section
      aria-labelledby="about-mini-heading"
      className="grid min-w-0 grid-cols-1 items-center gap-8 py-6 text-shadow-soft md:grid-cols-[0.95fr_1.05fr] md:gap-10 md:py-10"
    >
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a5d19] dark:text-[#f0c76e]">About us</p>
        <h2 id="about-mini-heading" className="mt-3 font-display text-[clamp(2rem,7vw,2.5rem)] leading-tight text-[#102b43] dark:text-white md:text-[3.1rem]">
          Explore the current villa collection
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-7 text-[#1f3d58] dark:text-slate-300">
          <p>Browse the available listings and compare location, guest capacity, and the details shown for each villa.</p>
          <p>Open a villa page to review its photos, check dates, and see whether it fits your stay.</p>
          <p>Create an account to save a villa or continue with a booking.</p>
        </div>
        <p className="mt-5 rounded-xl border border-slate-900/10 bg-white/85 px-4 py-3 text-sm font-semibold text-[#102b43] shadow-soft backdrop-blur dark:border-[#f0c76e]/25 dark:bg-white/10 dark:text-brand-100">
          Review the details on each listing before you book.
        </p>
      </div>

      <div className="relative min-w-0 overflow-hidden rounded-2xl border border-slate-900/10 bg-slate-950 shadow-[0_20px_55px_rgba(0,10,25,.3)] dark:border-white/20">
        <div className="relative aspect-[16/10] w-full">
          {gallery.map((image, index) => (
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              loading="eager"
              priority={index === 0}
              aria-hidden={index !== activeImage}
              className={`about-gallery-image object-cover ${index === activeImage ? "about-gallery-image--active" : ""}`}
            />
          ))}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/10" />
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-4 sm:p-5">
            <div className="flex items-center gap-2" aria-label={`Image ${activeImage + 1} of ${gallery.length}`}>
              {gallery.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${index === activeImage ? "w-8 bg-white" : "w-2 bg-white/55 hover:bg-white/85"}`}
                  aria-label={`Show image ${index + 1}`}
                  aria-current={index === activeImage ? "true" : undefined}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => showImage(-1)} className="about-gallery-control" aria-label="Previous image">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => showImage(1)} className="about-gallery-control" aria-label="Next image">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
