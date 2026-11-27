import { handleExpressRequest } from "../../../server/next-bridge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  return handleExpressRequest(request);
}

export async function HEAD(request) {
  return handleExpressRequest(request);
}
