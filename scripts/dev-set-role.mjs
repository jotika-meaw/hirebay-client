// Dev helper: set a user's role directly in MongoDB.
// Usage: node --env-file=.env.local scripts/dev-set-role.mjs <email> <role>
// Refuses to run unless DB_NAME is exactly hirebay_dev (never production).
import { MongoClient } from "mongodb";

const [email, role] = process.argv.slice(2);

if (process.env.DB_NAME !== "hirebay_dev") {
  console.error("Refusing to run: DB_NAME must be hirebay_dev");
  process.exit(1);
}
if (!email || !["customer", "owner", "admin"].includes(role)) {
  console.error("Usage: node --env-file=.env.local scripts/dev-set-role.mjs <email> <customer|owner|admin>");
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set");
  process.exit(1);
}

const client = new MongoClient(process.env.MONGODB_URI);
try {
  const db = client.db(process.env.DB_NAME);
  const res = await db
    .collection("user")
    .updateOne({ email: email.toLowerCase() }, { $set: { role } });
  if (res.matchedCount === 0) {
    console.error("No user found with that email");
    process.exit(1);
  }
  console.log(`Role updated for ${email}`);
} finally {
  await client.close();
}
