import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { APIError } from "better-auth/api";
import { PASSWORD_MESSAGE, passwordSchema } from "@/lib/validators";

// Lazy singleton: the MongoClient is created on first use and cached on
// globalThis, so `next build` never needs MONGODB_URI.
export function getAuth() {
  if (globalThis.__hirebayAuth) return globalThis.__hirebayAuth;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) throw new Error("BETTER_AUTH_SECRET is not set");

  const client = new MongoClient(uri);
  const db = client.db(process.env.DB_NAME ?? "hirebay_dev");
  const baseURL = process.env.BETTER_AUTH_URL;

  const auth = betterAuth({
    baseURL,
    secret,
    trustedOrigins: [baseURL].filter(Boolean),
    database: mongodbAdapter(db),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      // Server floor matches the product rule (01: ≥ 6 chars); the
      // create.before hook below enforces upper + lowercase with our message.
      minPasswordLength: 6,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      },
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "customer",
          input: false,
        },
        phone: { type: "string", required: false, input: false },
        address: { type: "string", required: false, input: false },
      },
    },
    databaseHooks: {
      user: {
        create: {
          async before(user, ctx) {
            const password = ctx.body?.password;
            if (typeof password === "string") {
              const parsed = passwordSchema.safeParse(password);
              if (!parsed.success) {
                throw new APIError("BAD_REQUEST", { message: PASSWORD_MESSAGE });
              }
            }
            // accountType comes from the signup form; anything else —
            // including Google sign-ups and accountType "admin" — is customer.
            // Never admin from signup. input:false also rejects a
            // client-supplied `role` with "role is not allowed to be set".
            const accountType = ctx.body?.accountType;
            return { data: { role: accountType === "owner" ? "owner" : "customer" } };
          },
        },
      },
    },
  });

  globalThis.__hirebayAuth = auth;
  return auth;
}
