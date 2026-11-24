"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";

export function Link({ to, children, state: _state, ...props }) {
  return <NextLink href={to} {...props}>{children}</NextLink>;
}

export function NavLink({ to, children, className, end, ...props }) {
  const pathname = usePathname();
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
  return <NextLink href={to} className={typeof className === "function" ? className({ isActive }) : className} aria-current={isActive ? "page" : undefined} {...props}>{children}</NextLink>;
}
