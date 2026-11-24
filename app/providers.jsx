"use client";

import { AuthProvider } from "../src/context/AuthContext";
import LenisProvider from "../src/components/LenisProvider";

export default function Providers({ children }) {
  return <AuthProvider><LenisProvider />{children}</AuthProvider>;
}
