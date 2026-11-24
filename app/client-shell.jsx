"use client";

import Providers from "./providers";
import AppLayout from "../src/components/Layout/AppLayout";

export default function ClientShell({ children }) {
  return <Providers><AppLayout>{children}</AppLayout></Providers>;
}
