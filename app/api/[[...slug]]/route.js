import { handleExpressRequest } from "../../../server/next-bridge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function dispatch(request) {
  return handleExpressRequest(request);
}

export const GET = dispatch;
export const POST = dispatch;
export const PUT = dispatch;
export const PATCH = dispatch;
export const DELETE = dispatch;
export const OPTIONS = dispatch;
export const HEAD = dispatch;
