"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import SkyBackdrop from "./SkyBackdrop";
import { smoothScrollTo } from "../../utils/smoothScroll";

const AppLayout = ({ children }) => {
  const pathname = usePathname();
  const isNotesRoute = pathname === "/notes";

  useEffect(() => {
    const hash = window.location.hash;
    const anchor = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (anchor) {
      window.scrollTo({ top: anchor.getBoundingClientRect().top + window.scrollY, behavior: "auto" });
      return;
    }
    smoothScrollTo(0, { immediate: true });
  }, [pathname]);

  return (
    <>
      <SkyBackdrop />
      <div className="site-shell relative isolate z-10 min-h-screen bg-transparent text-slate-900 transition-colors duration-300 dark:text-slate-100" style={{ paddingRight: 0 }}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[150] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-slate-900"
        >
          Skip to main content
        </a>
        <Navbar />
        <main
          id="main-content"
          className={`relative z-10 min-h-[calc(100vh-24rem)] bg-transparent pb-16 ${
            isNotesRoute
              ? "notes-main px-0 pt-28 md:pt-32"
              : pathname === "/"
                ? "px-0 pt-0"
                : "px-pagex pt-28 md:px-pagexl md:pt-32"
          }`}
        >
          <div className={isNotesRoute || pathname === "/" ? "w-full" : "page-content-column mx-auto w-full max-w-[1280px]"}>{children}</div>
        </main>
        <Footer hideContactCta={pathname === "/contact"} />
      </div>
    </>
  );
};

export default AppLayout;
