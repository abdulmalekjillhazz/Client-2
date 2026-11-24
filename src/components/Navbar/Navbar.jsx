"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronRight, Crown, Menu, Moon, Send, Sun, X } from "lucide-react";
import { Link } from "../NextLink";
import { useAuth } from "../../context/AuthContext";

const baseNavItems = [
  { to: "/", label: "Home", symbol: "🏠" },
  { to: "/villas", label: "Villas", symbol: "🏘️" },
  { to: "/aboutus", label: "About Us", symbol: "👨‍👩‍👧" },
  { to: "/contact", label: "Contact", symbol: "💌" },
];

const activePath = (pathname, to) => to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, logout } = useAuth();
  const [isDark, setIsDark] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    setIsDark(savedTheme ? savedTheme === "dark" : true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  useEffect(() => {
    const keepDesktopNavigationVisible = () => {
      if (window.innerWidth >= 1100) setIsOpen(true);
    };
    window.addEventListener("resize", keepDesktopNavigationVisible);
    return () => window.removeEventListener("resize", keepDesktopNavigationVisible);
  }, []);

  const navItems = user?.role === "host"
    ? [...baseNavItems, { to: "/manage", label: "Manage villas", symbol: "🔑" }]
    : baseNavItems;

  const onLogout = async () => {
    await logout();
    setIsOpen(false);
    router.push("/");
  };

  const closeMenu = () => {
    if (window.innerWidth >= 1100) return;
    setIsOpen(false);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[120]" aria-label="RoyalCity navigation">
      {isOpen ? (
        <>
          <button
            type="button"
            className="royal-drawer__backdrop pointer-events-auto absolute inset-0 h-full w-full cursor-default min-[1100px]:hidden"
            aria-label="Close navigation menu"
            onClick={closeMenu}
          />
          <aside className="royal-drawer pointer-events-auto absolute inset-y-0 right-0 flex flex-col" aria-label="RoyalCity navigation menu">
            <button type="button" onClick={closeMenu} className="royal-drawer__close absolute right-5 top-5 z-20 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65c9ff] min-[1100px]:hidden" aria-label="Close menu">
              <X className="h-8 w-8" aria-hidden="true" />
            </button>

            <div className="royal-drawer__scroll relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-7 pb-8 pt-16 sm:px-10">
              <Link to="/" onClick={closeMenu} className="royal-drawer__brand mx-auto flex w-full max-w-[390px] flex-col items-center text-center" aria-label="RoyalCity home">
                <Crown className="h-[4.4rem] w-[4.4rem] text-[#ffc51e] drop-shadow-[0_0_12px_rgba(255,181,0,.72)]" strokeWidth={2.1} aria-hidden="true" />
                <span className="mt-1 font-display text-[2.75rem] font-bold leading-none tracking-[-.055em] text-white">Royal<span className="text-[#ffc01b]">City</span></span>
                <span className="royal-drawer__tagline mt-3 text-[11px] font-semibold uppercase tracking-[.27em] text-white/90">Luxury properties</span>
              </Link>

              <nav className="mt-8 flex flex-col gap-3 sm:mt-10 sm:gap-4" aria-label="Main navigation">
                {navItems.map(({ to, label, symbol }) => {
                  const active = activePath(pathname, to);
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className={`royal-drawer__item group flex items-center gap-4 px-5 sm:gap-5 sm:px-6 ${active ? "royal-drawer__item--active" : ""}`}
                    >
                      {label === "Sign in" ? (
                        <span className="royal-drawer__emoji" aria-hidden="true">👤<span className="royal-drawer__emoji-badge">🔒</span></span>
                      ) : <span className="royal-drawer__emoji" aria-hidden="true">{symbol}</span>}
                      <span className="min-w-0 flex-1 truncate font-display text-[1.45rem] font-bold tracking-[-.025em] sm:text-[1.75rem]">{label}</span>
                      <ChevronRight className="h-8 w-8 shrink-0 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.3} aria-hidden="true" />
                    </Link>
                  );
                })}

                <button type="button" onClick={() => setIsDark((value) => !value)} className="royal-drawer__item group flex items-center gap-4 px-5 text-left sm:gap-5 sm:px-6" aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}>
                  <span className="royal-drawer__theme-toggle" aria-hidden="true">
                    <span className="royal-drawer__theme-track">{isDark ? <Moon /> : <Sun />}</span>
                    <span className={`royal-drawer__theme-thumb ${isDark ? "royal-drawer__theme-thumb--dark" : "royal-drawer__theme-thumb--light"}`}>{isDark ? <Sun /> : <Moon />}</span>
                  </span>
                  <span className="min-w-0 flex-1 whitespace-nowrap font-display text-[1.15rem] font-bold tracking-[-.025em] sm:text-[1.3rem]">{isDark ? "Dark Mode" : "Light Mode"}</span>
                  <ChevronRight className="h-8 w-8 shrink-0" strokeWidth={2.3} aria-hidden="true" />
                </button>

                {ready && user ? (
                  <>
                    <Link to="/profile" onClick={closeMenu} className="royal-drawer__item group flex items-center gap-4 px-5 sm:gap-5 sm:px-6">
                      <span className="royal-drawer__emoji" aria-hidden="true">👤</span>
                      <span className="min-w-0 flex-1 truncate font-display text-[1.45rem] font-bold sm:text-[1.75rem]">{user.name || "Profile"}</span>
                      <ChevronRight className="h-8 w-8 shrink-0" aria-hidden="true" />
                    </Link>
                    <button type="button" onClick={onLogout} className="royal-drawer__item group flex items-center gap-4 px-5 text-left sm:gap-5 sm:px-6">
                      <span className="royal-drawer__emoji" aria-hidden="true">↪️</span>
                      <span className="min-w-0 flex-1 font-display text-[1.45rem] font-bold sm:text-[1.75rem]">Sign out</span>
                      <ChevronRight className="h-8 w-8 shrink-0" aria-hidden="true" />
                    </button>
                  </>
                ) : null}

                {ready && !user ? (
                  <Link to={`/login?next=${encodeURIComponent(pathname)}`} onClick={closeMenu} className="royal-drawer__item group flex items-center gap-4 px-5 sm:gap-5 sm:px-6">
                    <span className="royal-drawer__emoji" aria-hidden="true">👤🔒</span>
                    <span className="min-w-0 flex-1 font-display text-[1.45rem] font-bold sm:text-[1.75rem]">Sign in</span>
                    <ChevronRight className="h-8 w-8 shrink-0" aria-hidden="true" />
                  </Link>
                ) : null}
              </nav>

              {ready && !user ? (
                <div className="royal-drawer__separator my-5 flex items-center gap-4 text-[#ffc51e]" aria-hidden="true">
                  <span /> <Crown className="h-7 w-7" /> <span />
                </div>
              ) : null}

              {ready && !user ? (
                <Link to="/register" onClick={closeMenu} className="royal-drawer__create group flex min-h-[68px] items-center justify-center gap-4 rounded-full px-6 font-display text-[1.35rem] font-extrabold tracking-[-.025em] sm:min-h-[78px] sm:text-[1.6rem]">
                  <Send className="royal-drawer__create-icon" aria-hidden="true" />
                  <span>Create Account</span>
                </Link>
              ) : (
                <div className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-white/70"><Check className="h-4 w-4 text-[#ffc51e]" /> Your RoyalCity account</div>
              )}
            </div>
          </aside>
        </>
      ) : (
        <button type="button" onClick={() => setIsOpen(true)} className="royal-drawer__launcher pointer-events-auto absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-white sm:right-5 sm:top-5 sm:h-14 sm:w-14 sm:rounded-2xl min-[1100px]:hidden" aria-label="Open navigation menu" aria-expanded="false">
          <Menu className="h-5 w-5 sm:h-7 sm:w-7" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
