"use client";
import { Suspense } from "react";
import Register from "../../src/components/Auth/Register";
export default function Page() { return <Suspense fallback={null}><Register /></Suspense>; }
