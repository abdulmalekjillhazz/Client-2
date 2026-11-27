"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Building2, Crown, House, Info, Menu, Moon, Sun, X } from "lucide-react";
import { Link } from "../NextLink";
import { useAuth } from "../../context/AuthContext";

const links = [
  ["/", "Home", House],
  ["/villas", "Villas", Building2],
  ["/aboutus", "About Us", Info],
];

function ThemeToggle({ dark, onToggle, className }) {
  return (
    <button
      type="button"
      className={className}
      onClick={onToggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, logout } = useAuth();
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setDark(saved === "dark");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const renderLinks = () => links.map(([href, label, Icon]) => {
    const active = pathname === href || (href === "/villas" && pathname.startsWith("/villa/"));
    return (
      <Link
        key={href}
        to={href}
        prefetch={href === "/villas" ? true : undefined}
        aria-current={active ? "page" : undefined}
        onClick={() => setMenuOpen(false)}
      >
        <Icon className="royal-topbar__icon" aria-hidden="true" />
        {label}
      </Link>
    );
  });

  const accountLinks = user ? (
    <>
      <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
      {user.role === "host" && <Link to="/manage" onClick={() => setMenuOpen(false)}>Manage villas</Link>}
      <button type="button" onClick={async () => { await logout(); setMenuOpen(false); router.push("/"); }}>Sign out</button>
    </>
  ) : (
    <>
      <Link to={`/login?next=${encodeURIComponent(pathname)}`} onClick={() => setMenuOpen(false)}>Sign in</Link>
      <Link to="/register" onClick={() => setMenuOpen(false)}>Create account</Link>
    </>
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  return (
    <header className={`royal-topbar ${scrolled ? "royal-topbar--scrolled" : ""}`.trim()}>
      <Link to="/" className="royal-topbar__brand"><Crown aria-hidden="true" size={22} /> RoyalCity</Link>
      <nav className="royal-topbar__primary-nav" aria-label="Main navigation">
        {renderLinks()}
        {user?.role === "host" && <Link to="/manage">Manage villas</Link>}
      </nav>
      <div className="royal-topbar__actions">
        <ThemeToggle dark={dark} onToggle={toggleTheme} className="royal-topbar__desktop-theme" />
        {ready && (
          <div className="royal-topbar__desktop-account">
            {user ? (
              <>
                <Link to="/profile">Profile</Link>
                <button type="button" onClick={async () => { await logout(); router.push("/"); }}>Sign out</button>
              </>
            ) : (
              <Link to={`/login?next=${encodeURIComponent(pathname)}`}>Sign in</Link>
            )}
          </div>
        )}
        <Link to="/contact" className="royal-topbar__primary">Contact us</Link>
        <button
          type="button"
          className="royal-topbar__mobile-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="royal-mobile-menu"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>
      {menuOpen && (
        <nav id="royal-mobile-menu" className="royal-topbar__mobile-nav" aria-label="Mobile navigation">
          {renderLinks()}
          <div className="royal-topbar__mobile-account">
            <ThemeToggle dark={dark} onToggle={toggleTheme} className="royal-topbar__mobile-theme" />
            {ready ? accountLinks : null}
          </div>
        </nav>
      )}
    </header>
  );
}
