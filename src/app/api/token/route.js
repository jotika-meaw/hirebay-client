import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { getAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Short-lived access token for the Express API, minted from the
// BetterAuth session. Never logs or returns secrets.
export async function GET() {
  const session = await getAuth().api.getSession({ headers: await headers() });
  const user = session?.user;
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role ?? "customer" },
    process.env.JWT_SECRET,
    {
      algorithm: "HS256",
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
      expiresIn: "1h",
    }
  );
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  return Response.json(
    { token, expiresAt },
    { headers: { "Cache-Control": "no-store" } }
  );
}
