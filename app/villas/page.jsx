import { Suspense } from "react";
import Villas from "../../src/components/Villa/Villas";
import VillasLoading from "../../src/components/Villa/VillasLoading";

export default function Page() {
  return <Suspense fallback={<VillasLoading />}><Villas /></Suspense>;
}
