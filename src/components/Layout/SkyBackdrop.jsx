"use client";

import React, { useEffect, useRef } from "react";

const SkyBackdrop = () => {
  const skyRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    const syncCelestialPosition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollY = window.scrollY || 0;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const y = reduceMotion ? 0 : -Math.min(scrollY * 0.045, 120);
        const x = reduceMotion ? 0 : Math.sin(scrollY / 420) * 13;
        document.documentElement.style.setProperty("--celestial-shift-y", `${y.toFixed(1)}px`);
        document.documentElement.style.setProperty("--celestial-shift-x", `${x.toFixed(1)}px`);
      });
    };

    syncCelestialPosition();
    window.addEventListener("scroll", syncCelestialPosition, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", syncCelestialPosition);
      document.documentElement.style.removeProperty("--celestial-shift-y");
      document.documentElement.style.removeProperty("--celestial-shift-x");
    };
  }, []);

  return (
    <div ref={skyRef} className="site-sky" aria-hidden="true">
      <div className="site-sky__night" />
      <div className="site-sky__day" />
      <div className="site-sky__moonlight" />
    </div>
  );
};

export default SkyBackdrop;
