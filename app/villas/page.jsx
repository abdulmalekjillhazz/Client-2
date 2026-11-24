"use client";
import { Suspense } from "react";
import Villas from "../../src/components/Villa/Villas";
export default function Page() { return <Suspense fallback={null}><Villas /></Suspense>; }
