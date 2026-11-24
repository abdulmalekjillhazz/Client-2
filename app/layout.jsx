import "./globals.css";
import ClientShell from "./client-shell";

export const metadata = {
  title: "RoyalCity | Exceptional Villa Stays",
  description: "Discover and book distinctive villa stays with RoyalCity.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }) {
  return <html lang="en" className="dark" data-theme="dark" suppressHydrationWarning><body><ClientShell>{children}</ClientShell></body></html>;
}
