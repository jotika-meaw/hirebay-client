// Demo seed (02 §7). Creates the BetterAuth users via the running dev
// server's sign-up endpoint (run `npm run dev` in another terminal first),
// sets roles directly, inserts the 13 demo equipment rows, bookings +
// payments. Idempotent: existing users are skipped, equipment/bookings
// insert only when their collections are empty. Usage:
//   npm run dev                                    # terminal 1
//   npm run seed                                   # terminal 2, into .env.local DB_NAME
//   DB_NAME=hirebay npm run seed -- --production   # production, once (owner-approved)
import { readFileSync } from "node:fs";
import { MongoClient } from "mongodb";

function loadEnvFile(path) {
  try {
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#") || !t.includes("=")) continue;
      const i = t.indexOf("=");
      const k = t.slice(0, i).trim();
      let v = t.slice(i + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (!(k in process.env)) process.env[k] = v;
    }
  } catch {
    // No .env.local — required vars must come from the environment.
  }
}

loadEnvFile(new URL("../.env.local", import.meta.url));

const DB_NAME = process.env.DB_NAME ?? "hirebay_dev";
if (DB_NAME === "hirebay" && !process.argv.includes("--production")) {
  console.error("Refusing to seed the production database without --production.");
  process.exit(1);
}
for (const name of ["MONGODB_URI", "BETTER_AUTH_SECRET", "SEED_ADMIN_EMAIL", "SEED_ADMIN_PASSWORD", "SEED_USER_PASSWORD"]) {
  if (!process.env[name]) {
    console.error(`Missing ${name} — set it in .env.local before seeding.`);
    process.exit(1);
  }
}

const { equipment: demoEquipment } = await import("../src/lib/mock/data.js");
const { wholeDays, billableUnits } = await import("../src/lib/pricing.js");

const AUTH_URL = (process.env.BETTER_AUTH_URL || "http://localhost:3000").replace(/\/$/, "");

async function signUpEmail({ name, email, password, accountType }) {
  const res = await fetch(`${AUTH_URL}/api/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: AUTH_URL },
    body: JSON.stringify({ name, email, password, accountType }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`sign-up failed for ${email}: ${res.status} ${text.slice(0, 160)}`);
  }
}

const mongo = new MongoClient(process.env.MONGODB_URI);
await mongo.connect();
const db = mongo.db(DB_NAME);

const seedUsers = [
  { name: "Hirebay Admin", email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD, role: "admin", accountType: undefined },
  { name: "Karim Heavy Machinery", email: "karim@hirebay.test", password: process.env.SEED_USER_PASSWORD, role: "owner", accountType: "owner" },
  { name: "LensBox BD", email: "lensbox@hirebay.test", password: process.env.SEED_USER_PASSWORD, role: "owner", accountType: "owner" },
  { name: "Rafi Chowdhury", email: "rafi@hirebay.test", password: process.env.SEED_USER_PASSWORD, role: "customer", accountType: undefined },
  { name: "Nusrat Jahan", email: "nusrat@hirebay.test", password: process.env.SEED_USER_PASSWORD, role: "customer", accountType: undefined },
];

const byEmail = {};
let usersCreated = 0;
for (const u of seedUsers) {
  const existing = await db.collection("user").findOne({ email: u.email }, { projection: { _id: 1, email: 1, role: 1, name: 1, image: 1 } });
  if (existing) {
    byEmail[u.email] = existing;
    if ((existing.role ?? "customer") !== u.role) {
      await db.collection("user").updateOne({ _id: existing._id }, { $set: { role: u.role, updatedAt: new Date() } });
      existing.role = u.role;
    }
    continue;
  }
  const body = { name: u.name, email: u.email, password: u.password };
  if (u.accountType) body.accountType = u.accountType;
  await signUpEmail(body);
  const created = await db.collection("user").findOne({ email: u.email });
  if (u.role !== (created.role ?? "customer")) {
    await db.collection("user").updateOne({ _id: created._id }, { $set: { role: u.role, updatedAt: new Date() } });
    created.role = u.role;
  }
  byEmail[u.email] = created;
  usersCreated += 1;
}

const seedOwners = [byEmail["karim@hirebay.test"], byEmail["lensbox@hirebay.test"]];
const seedCustomers = [byEmail["rafi@hirebay.test"], byEmail["nusrat@hirebay.test"]];
function ownerSnapshot(user) {
  return { id: String(user._id), name: user.name ?? null, email: user.email ?? null, image: user.image ?? null };
}

let equipmentInserted = 0;
let equipmentIds = [];
if ((await db.collection("equipment").countDocuments({})) === 0) {
  const docs = demoEquipment.map((row, i) => {
    const owner = seedOwners[i % seedOwners.length];
    const terms = Array.isArray(row.terms) ? row.terms.join("\n\n") : String(row.terms ?? "");
    return {
      name: row.name,
      description: row.description,
      category: row.category,
      location: row.location,
      price: row.price,
      rentalType: row.rentalType,
      quantity: row.quantity,
      condition: row.condition,
      brand: row.brand ?? null,
      model: row.model ?? null,
      image: row.image ?? null,
      terms,
      status: row.status,
      owner: ownerSnapshot(owner),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt ?? row.createdAt),
    };
  });
  const result = await db.collection("equipment").insertMany(docs);
  equipmentIds = Object.values(result.insertedIds);
  equipmentInserted = docs.length;
} else {
  const rows = await db.collection("equipment").find({ status: "approved" }).sort({ createdAt: 1 }).toArray();
  equipmentIds = rows.map((r) => r._id);
}

let bookingsInserted = 0;
let paymentsInserted = 0;
if ((await db.collection("bookings").countDocuments({})) === 0 && equipmentIds.length > 0) {
  const approved = await db.collection("equipment").find({ status: "approved" }).sort({ createdAt: 1 }).toArray();
  const item = approved[0];
  const mk = ({ startISO, endISO, qty, status, paymentStatus, customerIdx, createdISO, liveHold }) => {
    const start = new Date(startISO);
    const end = new Date(endISO);
    const d = wholeDays(start, end);
    const units = billableUnits(d, item.rentalType);
    const now = new Date(createdISO);
    const customer = seedCustomers[customerIdx % seedCustomers.length];
    return {
      equipmentId: item._id,
      equipment: { name: item.name, image: item.image ?? null, category: item.category, rentalType: item.rentalType, price: item.price },
      owner: { id: item.owner?.id ?? null, name: item.owner?.name ?? null, email: item.owner?.email ?? null },
      customer: { id: String(customer._id), name: customer.name ?? null, email: customer.email ?? null, image: customer.image ?? null },
      startDate: start,
      endDate: end,
      quantity: qty,
      days: d,
      units,
      totalAmount: units * item.price * qty,
      phone: "+8801712345678",
      address: "House 1, Road 2, Dhaka",
      notes: "",
      status,
      paymentStatus,
      ...(liveHold ? { holdExpiresAt: new Date(Date.now() + 30 * 60 * 1000) } : {}),
      createdAt: now,
      updatedAt: now,
    };
  };
  const bookingDocs = [
    mk({ startISO: "2026-06-10T00:00:00.000Z", endISO: "2026-06-12T00:00:00.000Z", qty: 1, status: "completed", paymentStatus: "paid", customerIdx: 0, createdISO: "2026-06-12T10:00:00.000Z" }),
    mk({ startISO: "2026-07-12T00:00:00.000Z", endISO: "2026-07-13T00:00:00.000Z", qty: 2, status: "completed", paymentStatus: "paid", customerIdx: 1, createdISO: "2026-07-15T10:00:00.000Z" }),
    mk({ startISO: "2026-08-07T00:00:00.000Z", endISO: "2026-08-10T00:00:00.000Z", qty: 1, status: "completed", paymentStatus: "paid", customerIdx: 0, createdISO: "2026-08-09T10:00:00.000Z" }),
    mk({ startISO: "2026-09-15T00:00:00.000Z", endISO: "2026-09-17T00:00:00.000Z", qty: 1, status: "completed", paymentStatus: "paid", customerIdx: 1, createdISO: "2026-09-18T10:00:00.000Z" }),
    mk({ startISO: "2026-10-19T00:00:00.000Z", endISO: "2026-10-20T00:00:00.000Z", qty: 1, status: "completed", paymentStatus: "paid", customerIdx: 0, createdISO: "2026-10-21T10:00:00.000Z" }),
    mk({ startISO: "2026-11-08T00:00:00.000Z", endISO: "2026-11-10T00:00:00.000Z", qty: 1, status: "confirmed", paymentStatus: "paid", customerIdx: 1, createdISO: "2026-11-10T10:00:00.000Z" }),
    mk({ startISO: "2026-12-05T00:00:00.000Z", endISO: "2027-01-03T00:00:00.000Z", qty: 1, status: "confirmed", paymentStatus: "paid", customerIdx: 0, createdISO: "2026-11-20T10:00:00.000Z" }),
    mk({ startISO: "2026-11-28T00:00:00.000Z", endISO: "2026-11-30T00:00:00.000Z", qty: 1, status: "pending", paymentStatus: "unpaid", customerIdx: 1, createdISO: "2026-11-21T10:00:00.000Z", liveHold: true }),
  ];
  const bRes = await db.collection("bookings").insertMany(bookingDocs);
  bookingsInserted = bookingDocs.length;
  const paymentDocs = bookingDocs
    .filter((b) => b.paymentStatus === "paid")
    .map((b, i) => ({
      bookingId: bRes.insertedIds[bookingDocs.indexOf(b)],
      sessionId: `seed_cs_${DB_NAME}_${i}`,
      transactionId: `seed_pi_${DB_NAME}_${i}`,
      amount: b.totalAmount,
      currency: "bdt",
      customerEmail: b.customer.email,
      ownerEmail: b.owner.email,
      status: "paid",
      createdAt: b.createdAt,
    }));
  if (paymentDocs.length) {
    await db.collection("payments").insertMany(paymentDocs);
    paymentsInserted = paymentDocs.length;
  }
}

await mongo.close();

console.log(`seed into ${DB_NAME}: users created ${usersCreated}/5, equipment inserted ${equipmentInserted}, bookings inserted ${bookingsInserted}, payments inserted ${paymentsInserted}`);
console.log(`seeded emails: ${seedUsers.map((u) => u.email).join(", ")}`);
