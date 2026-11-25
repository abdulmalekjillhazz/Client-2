"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Building2, Crown, House, Info, Mail, Moon, Sun } from "lucide-react";
import { Link } from "../NextLink";
import { useAuth } from "../../context/AuthContext";

const links = [
  ["/", "Home", House],
  ["/villas", "Villas", Building2],
  ["/aboutus", "About Us", Info],
  ["/contact", "Contact", Mail],
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, logout } = useAuth();
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setDark(saved === "dark");
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  return (
    <header className="royal-topbar">
      <Link to="/" className="royal-topbar__brand"><Crown aria-hidden="true" size={22} /> RoyalCity</Link>
      <nav aria-label="Main navigation">
        {links.map(([href, label, Icon]) => {
          const active = pathname === href || (href === "/villas" && pathname.startsWith("/villa/"));
          return <Link key={href} to={href} prefetch={href === "/villas" ? true : undefined} aria-current={active ? "page" : undefined}><Icon className="royal-topbar__icon" aria-hidden="true" />{label}</Link>;
        })}
        {user?.role === "host" && <Link to="/manage">Manage villas</Link>}
      </nav>
      <div className="royal-topbar__actions">
        <button type="button" onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
          {dark ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        {ready && (user ? <>
          <Link to="/profile">Profile</Link>
          <button type="button" onClick={async () => { await logout(); router.push("/"); }}>Sign out</button>
        </> : <>
          <Link to={`/login?next=${encodeURIComponent(pathname)}`}>Sign in</Link>
          <Link to="/register" className="royal-topbar__primary">Create account</Link>
        </>)}
      </div>
    </header>
  );
}
