import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";

// getAuth() is called inside the handlers so the BetterAuth instance
// (and the MongoClient) stays lazy — `next build` needs no MONGODB_URI.
export async function GET(request) {
  return toNextJsHandler(getAuth()).GET(request);
}

export async function POST(request) {
  return toNextJsHandler(getAuth()).POST(request);
}
