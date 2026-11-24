"use client";
import { Suspense } from "react";
import Login from "../../src/components/Auth/Login";
export default function Page() { return <Suspense fallback={null}><Login /></Suspense>; }
