// mockSource: in-memory stand-in for the Express API.
// Same function names and shapes as api-source.js:
//   lists → { items, total, page, pages }, singles → { data },
//   errors thrown as { status, message }.
// Server semantics copied from 02-ARCHITECTURE.md §5 + 01 decisions 1–3.

import {
  adminAnalytics,
  bookings as seedBookings,
  equipment as seedEquipment,
  favorites as seedFavorites,
  ownerAnalytics,
  publicStats,
  users as seedUsers,
} from "@/lib/mock/data";
import { billableUnits, wholeDays } from "@/lib/pricing";
import { normalizePhone } from "@/lib/validators";

let equipment = structuredClone(seedEquipment);
let users = structuredClone(seedUsers);
let bookings = structuredClone(seedBookings);
let favorites = structuredClone(seedFavorites);

let equipmentSeq = equipment.length + 1;
let bookingSeq = bookings.length + 1;

let sessionUserId = null;

export function setMockSession(userId) {
  sessionUserId = userId;
}

export function resetMockStore() {
  equipment = structuredClone(seedEquipment);
  users = structuredClone(seedUsers);
  bookings = structuredClone(seedBookings);
  favorites = structuredClone(seedFavorites);
  equipmentSeq = equipment.length + 1;
  bookingSeq = bookings.length + 1;
  sessionUserId = null;
}

function delay() {
  const ms = 300 + Math.floor(Math.random() * 301);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fail(status, message) {
  throw { status, message };
}

function me() {
  if (!sessionUserId) fail(401, "Please log in first");
  const user = users.find((u) => u.id === sessionUserId);
  if (!user) fail(401, "Account not found");
  return user;
}

function requireRole(...roles) {
  const user = me();
  if (!roles.includes(user.role)) fail(403, "You do not have permission for this");
  return user;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchStatus(row, status) {
  if (!status) return true;
  const wanted = String(status)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (wanted.length === 0) return true;
  return wanted.includes(row.status);
}

function paginate(rows, page, limit) {
  const safePage = Math.max(1, page || 1);
  const safeLimit = Math.min(24, Math.max(1, limit || 9));
  const total = rows.length;
  const pages = Math.max(1, Math.ceil(total / safeLimit));
  const items = rows.slice((safePage - 1) * safeLimit, safePage * safeLimit);
  return { items, total, page: safePage, pages };
}

function overlap(aStart, aEnd, bStart, bEnd) {
  return new Date(aStart) <= new Date(bEnd) && new Date(bStart) <= new Date(aEnd);
}

function holdActive(b) {
  return (
    b.paymentStatus === "unpaid" &&
    b.status === "pending" &&
    b.holdExpiresAt &&
    new Date(b.holdExpiresAt) > new Date()
  );
}

function countsAgainst(b) {
  return (b.paymentStatus === "paid" && b.status === "confirmed") || holdActive(b);
}

// Units already booked for an equipment row over [startDate, endDate].
export function bookedUnits(equipmentId, startDate, endDate) {
  return bookings
    .filter(
      (b) =>
        b.equipmentId === equipmentId && overlap(b.startDate, b.endDate, startDate, endDate) && countsAgainst(b)
    )
    .reduce((sum, b) => sum + b.quantity, 0);
}

export function availableUnits(item, startDate, endDate) {
  return Math.max(0, item.quantity - bookedUnits(item.id, startDate, endDate));
}

function applyEquipmentFilters(rows, params = {}) {
  let out = rows.filter((e) => e.status === "approved");
  const { search, category, rentalType, minPrice, maxPrice, availability, sort } = params;

  if (search && String(search).slice(0, 60).trim()) {
    const re = new RegExp(escapeRegex(String(search).slice(0, 60).trim()), "i");
    out = out.filter((e) => re.test(e.name) || re.test(e.location) || re.test(e.category));
  }
  if (params.location && String(params.location).slice(0, 60).trim()) {
    const re = new RegExp(escapeRegex(String(params.location).slice(0, 60).trim()), "i");
    out = out.filter((e) => re.test(e.location));
  }
  if (category) {
    const cats = String(category)
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    if (cats.length) out = out.filter((e) => cats.includes(e.category));
  }
  if (rentalType) out = out.filter((e) => e.rentalType === rentalType);
  if (minPrice !== undefined && minPrice !== "") out = out.filter((e) => e.price >= Number(minPrice));
  if (maxPrice !== undefined && maxPrice !== "") out = out.filter((e) => e.price <= Number(maxPrice));
  if (availability === "available") out = out.filter((e) => e.quantity > 0);
  if (availability === "unavailable") out = out.filter((e) => e.quantity === 0);

  if (sort === "price_asc") out = [...out].sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") out = [...out].sort((a, b) => b.price - a.price);
  else out = [...out].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return out;
}

// ---------- public ----------

export async function getPublicStats() {
  await delay();
  return { data: { ...publicStats } };
}

export async function getCategories() {
  await delay();
  const counts = {};
  for (const e of equipment) {
    if (e.status !== "approved") continue;
    counts[e.category] = (counts[e.category] || 0) + 1;
  }
  return {
    data: Object.entries(counts).map(([category, count]) => ({ category, count })),
  };
}

export async function getFeaturedEquipment() {
  await delay();
  const data = equipment
    .filter((e) => e.status === "approved")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);
  return { data };
}

export async function listEquipment(params = {}) {
  await delay();
  const rows = applyEquipmentFilters(equipment, params);
  return paginate(rows, Number(params.page), Number(params.limit));
}

export async function getEquipment(id) {
  await delay();
  const item = equipment.find((e) => e.id === id);
  if (!item) fail(404, "Equipment not found");
  if (item.status === "approved") return { data: { ...item } };
  const user = me();
  if (user.role !== "admin" && item.owner.id !== user.id) fail(404, "Equipment not found");
  return { data: { ...item } };
}

// ---------- favorites (customer) ----------

function joinedFavorites(userId) {
  return favorites
    .filter((f) => f.userId === userId)
    .map((f) => ({ ...f, equipment: equipment.find((e) => e.id === f.equipmentId) || null }))
    .filter((f) => f.equipment);
}

export async function listFavorites() {
  await delay();
  const user = requireRole("customer");
  return { data: joinedFavorites(user.id) };
}

export async function getFavoriteIds() {
  await delay();
  const user = requireRole("customer");
  return { data: favorites.filter((f) => f.userId === user.id).map((f) => f.equipmentId) };
}

export async function addFavorite(equipmentId) {
  await delay();
  const user = requireRole("customer");
  if (!equipment.some((e) => e.id === equipmentId)) fail(404, "Equipment not found");
  if (!favorites.some((f) => f.userId === user.id && f.equipmentId === equipmentId)) {
    favorites.push({ userId: user.id, equipmentId, createdAt: new Date().toISOString() });
  }
  return { data: { equipmentId } };
}

export async function removeFavorite(equipmentId) {
  await delay();
  const user = requireRole("customer");
  favorites = favorites.filter((f) => !(f.userId === user.id && f.equipmentId === equipmentId));
  return { data: { equipmentId } };
}

// ---------- bookings ----------

function startOfTodayUTC() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function createBooking(input) {
  await delay();
  const user = requireRole("customer");
  const item = equipment.find((e) => e.id === input.equipmentId);
  if (!item || item.status !== "approved") fail(404, "Equipment not available");

  const start = new Date(input.startDate);
  const end = new Date(input.endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) fail(400, "Valid dates are required");
  if (start < startOfTodayUTC()) fail(400, "Start date cannot be in the past");
  if (end < start) fail(400, "End date cannot be before the start date");

  const quantity = Number(input.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > item.quantity) {
    fail(400, `Quantity must be between 1 and ${item.quantity}`);
  }
  if (normalizePhone(input.phone) === null) fail(400, "Enter a valid Bangladeshi mobile number");
  const address = String(input.address || "").trim();
  if (address.length < 5 || address.length > 200) fail(400, "Address needs 5–200 characters");
  const notes = String(input.notes || "");
  if (notes.length > 500) fail(400, "Notes must be under 500 characters");

  const days = wholeDays(start, end);
  const units = billableUnits(days, item.rentalType);
  if (bookedUnits(item.id, start.toISOString(), end.toISOString()) + quantity > item.quantity) {
    fail(409, "Not enough units available for these dates");
  }

  const now = new Date();
  const row = {
    id: `b${bookingSeq++}-mock`,
    equipmentId: item.id,
    equipment: {
      name: item.name,
      image: item.image,
      category: item.category,
      rentalType: item.rentalType,
      price: item.price,
    },
    owner: { ...item.owner },
    customer: { id: user.id, name: user.name, email: user.email, image: user.image },
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    quantity,
    days,
    units,
    totalAmount: units * item.price * quantity,
    phone: normalizePhone(input.phone),
    address,
    notes,
    status: "pending",
    paymentStatus: "unpaid",
    holdExpiresAt: new Date(now.getTime() + 30 * 60 * 1000).toISOString(),
    checkoutSessionId: null,
    transactionId: null,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  bookings.unshift(row);
  return { data: { ...row } };
}

export async function createCheckout({ bookingId }) {
  await delay();
  const user = requireRole("customer");
  const row = bookings.find((b) => b.id === bookingId);
  if (!row || row.customer.id !== user.id) fail(404, "Booking not found");
  if (row.paymentStatus === "paid") fail(400, "This booking is already paid");
  if (!holdActive(row)) fail(400, "This booking hold has expired");
  return { data: { url: `/payment/success?demo=1&bookingId=${row.id}` } };
}

export async function confirmPayment({ bookingId }) {
  await delay();
  const user = requireRole("customer");
  const row = bookings.find((b) => b.id === bookingId);
  if (!row || row.customer.id !== user.id) fail(404, "Booking not found");
  if (row.paymentStatus === "unpaid") {
    row.paymentStatus = "paid";
    row.status = "confirmed";
    row.transactionId = `pi_mock_${row.id}`;
    row.holdExpiresAt = null;
    row.updatedAt = new Date().toISOString();
  }
  return { data: { booking: { ...row }, payment: { transactionId: row.transactionId } } };
}

function bookingsFor(rows) {
  return [...rows].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function listMyBookings(params = {}) {
  await delay();
  const user = requireRole("customer");
  let rows = bookingsFor(bookings.filter((b) => b.customer.id === user.id));
  if (params.status) rows = rows.filter((b) => matchStatus(b, params.status));
  return paginate(rows, Number(params.page), Number(params.limit));
}

export async function listOwnerBookings(params = {}) {
  await delay();
  const user = requireRole("owner");
  let rows = bookingsFor(bookings.filter((b) => b.owner.id === user.id));
  if (params.status) rows = rows.filter((b) => matchStatus(b, params.status));
  return paginate(rows, Number(params.page), Number(params.limit));
}

export async function listAdminBookings(params = {}) {
  await delay();
  requireRole("admin");
  let rows = bookingsFor(bookings);
  if (params.status) rows = rows.filter((b) => matchStatus(b, params.status));
  return paginate(rows, Number(params.page), Number(params.limit));
}

export async function updateBookingStatus(id, status) {
  await delay();
  requireRole("admin");
  if (!["confirmed", "completed", "cancelled"].includes(status)) fail(400, "Invalid status");
  const row = bookings.find((b) => b.id === id);
  if (!row) fail(404, "Booking not found");
  row.status = status;
  row.updatedAt = new Date().toISOString();
  return { data: { ...row } };
}

// ---------- owner equipment ----------

const EQUIPMENT_FIELDS = [
  "name",
  "description",
  "category",
  "location",
  "price",
  "rentalType",
  "quantity",
  "condition",
  "brand",
  "model",
  "image",
  "terms",
];

export async function createEquipment(input) {
  await delay();
  const user = requireRole("owner");
  const now = new Date().toISOString();
  const row = {
    id: `e${equipmentSeq++}-mock`,
    status: "pending",
    owner: { id: user.id, name: user.name, email: user.email, image: user.image },
    createdAt: now,
    updatedAt: now,
  };
  for (const field of EQUIPMENT_FIELDS) row[field] = input[field];
  if (typeof row.terms === "string") row.terms = row.terms.split("\n").map((t) => t.trim()).filter(Boolean);
  equipment.unshift(row);
  return { data: { ...row } };
}

export async function listMyEquipment(params = {}) {
  await delay();
  const user = requireRole("owner");
  let rows = equipment
    .filter((e) => e.owner.id === user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (params.status) rows = rows.filter((e) => e.status === params.status);
  return paginate(rows, Number(params.page), Number(params.limit));
}

export async function updateEquipment(id, input) {
  await delay();
  const user = me();
  const row = equipment.find((e) => e.id === id);
  if (!row) fail(404, "Equipment not found");
  const isAdmin = user.role === "admin";
  if (!isAdmin && (user.role !== "owner" || row.owner.id !== user.id)) {
    fail(403, "You do not have permission for this");
  }
  for (const field of EQUIPMENT_FIELDS) {
    if (input[field] !== undefined) row[field] = input[field];
  }
  if (!isAdmin) row.status = "pending";
  row.updatedAt = new Date().toISOString();
  return { data: { ...row } };
}

export async function deleteEquipment(id) {
  await delay();
  const user = me();
  const index = equipment.findIndex((e) => e.id === id);
  if (index === -1) fail(404, "Equipment not found");
  const row = equipment[index];
  const isAdmin = user.role === "admin";
  if (!isAdmin && (user.role !== "owner" || row.owner.id !== user.id)) {
    fail(403, "You do not have permission for this");
  }
  const upcomingPaid = bookings.some(
    (b) =>
      b.equipmentId === id &&
      b.paymentStatus === "paid" &&
      new Date(b.endDate) >= startOfTodayUTC()
  );
  if (upcomingPaid) fail(409, "Cannot delete equipment with upcoming paid bookings");
  equipment.splice(index, 1);
  favorites = favorites.filter((f) => f.equipmentId !== id);
  return { data: { id } };
}

// ---------- admin ----------

export async function listAdminEquipment(params = {}) {
  await delay();
  requireRole("admin");
  let rows = [...equipment].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (params.status) rows = rows.filter((e) => e.status === params.status);
  if (params.search && String(params.search).trim()) {
    const re = new RegExp(escapeRegex(String(params.search).trim()), "i");
    rows = rows.filter((e) => re.test(e.name) || re.test(e.location) || re.test(e.category));
  }
  return paginate(rows, Number(params.page), Number(params.limit));
}

export async function updateEquipmentStatus(id, status) {
  await delay();
  requireRole("admin");
  if (!["approved", "rejected"].includes(status)) fail(400, "Invalid status");
  const row = equipment.find((e) => e.id === id);
  if (!row) fail(404, "Equipment not found");
  row.status = status;
  row.updatedAt = new Date().toISOString();
  return { data: { ...row } };
}

export async function listAdminUsers(params = {}) {
  await delay();
  requireRole("admin");
  let rows = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (params.role) rows = rows.filter((u) => u.role === params.role);
  if (params.search && String(params.search).trim()) {
    const re = new RegExp(escapeRegex(String(params.search).trim()), "i");
    rows = rows.filter((u) => re.test(u.name) || re.test(u.email));
  }
  return paginate(rows, Number(params.page), Number(params.limit));
}

export async function updateUserRole(id, role) {
  await delay();
  const user = requireRole("admin");
  if (!["customer", "owner", "admin"].includes(role)) fail(400, "Invalid role");
  if (id === user.id) fail(400, "You cannot change your own role");
  const target = users.find((u) => u.id === id);
  if (!target) fail(404, "User not found");
  target.role = role;
  return { data: { ...target } };
}

export async function deleteUser(id) {
  await delay();
  const user = requireRole("admin");
  if (id === user.id) fail(400, "You cannot remove yourself");
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) fail(404, "User not found");
  users.splice(index, 1);
  favorites = favorites.filter((f) => f.userId !== id);
  return { data: { id } };
}

// ---------- analytics + profile ----------

export async function getAdminAnalytics() {
  await delay();
  requireRole("admin");
  return { data: structuredClone(adminAnalytics) };
}

export async function getOwnerAnalytics() {
  await delay();
  requireRole("owner");
  return { data: structuredClone(ownerAnalytics) };
}

export async function getMe() {
  await delay();
  return { data: { ...me() } };
}

export async function updateMe(input) {
  await delay();
  if (input.phone !== undefined && normalizePhone(input.phone) === null) {
    fail(400, "Enter a valid Bangladeshi mobile number");
  }
  const user = me();
  for (const field of ["name", "image", "phone", "address"]) {
    if (input[field] !== undefined) user[field] = input[field];
  }
  return { data: { ...user } };
}
