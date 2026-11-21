// apiSource: real backend calls (wired in Phase W).
// Same function names and shapes as mockSource; components stay untouched.
// Server `_id`s arrive alongside a string `id` (withId), so `.id`,
// `.equipmentId` and joined rows match what the hooks already consume.

import { api } from "@/lib/api";
import { monthOverMonth } from "@/lib/analytics";

async function unwrap(promise) {
  try {
    const { data } = await promise;
    return data;
  } catch (err) {
    throw {
      status: err?.response?.status ?? 500,
      message: err?.response?.data?.message || err?.message || "Request failed",
    };
  }
}

export function setMockSession() {
  // No-op in API mode (the session comes from BetterAuth).
}

export function resetMockStore() {
  // No-op in API mode (state lives in MongoDB).
}

export async function getPublicStats() {
  return unwrap(api.get("/stats/public"));
}

export async function getCategories() {
  return unwrap(api.get("/equipment/categories"));
}

export async function getFeaturedEquipment() {
  return unwrap(api.get("/equipment/featured"));
}

const EQUIPMENT_PARAMS = [
  "search",
  "location",
  "category",
  "rentalType",
  "minPrice",
  "maxPrice",
  "availability",
  "sort",
  "page",
  "limit",
];

function pickParams(params = {}, keys) {
  const out = {};
  for (const key of keys) {
    const value = params[key];
    if (value !== undefined && value !== "" && value !== null) out[key] = value;
  }
  return out;
}

export async function listEquipment(params = {}) {
  return unwrap(api.get("/equipment", { params: pickParams(params, EQUIPMENT_PARAMS) }));
}

export async function getEquipment(id) {
  return unwrap(api.get(`/equipment/${id}`));
}

export async function listFavorites() {
  return unwrap(api.get("/favorites"));
}

export async function getFavoriteIds() {
  return unwrap(api.get("/favorites/ids"));
}

function toEquipmentId(input) {
  if (typeof input === "string") return input;
  return input?.equipmentId ?? input?.id ?? input?._id;
}

export async function addFavorite(equipmentId) {
  return unwrap(api.post("/favorites", { equipmentId: toEquipmentId(equipmentId) }));
}

export async function removeFavorite(equipmentId) {
  return unwrap(api.delete(`/favorites/${toEquipmentId(equipmentId)}`));
}

export async function createBooking(input) {
  return unwrap(api.post("/bookings", input));
}

export async function createCheckout({ bookingId }) {
  const data = await unwrap(api.post("/payments/checkout", { bookingId }));
  // Stripe URLs are external: leave the SPA with a full navigation.
  if (/^https?:\/\//.test(data?.data?.url ?? "")) window.location.href = data.data.url;
  return data;
}

export async function confirmPayment({ sessionId }) {
  return unwrap(api.post("/payments/confirm", { sessionId }));
}

const BOOKING_PARAMS = ["status", "page", "limit"];

export async function listMyBookings(params = {}) {
  return unwrap(api.get("/bookings/mine", { params: pickParams(params, BOOKING_PARAMS) }));
}

export async function listOwnerBookings(params = {}) {
  return unwrap(api.get("/bookings/owner", { params: pickParams(params, BOOKING_PARAMS) }));
}

export async function listAdminBookings(params = {}) {
  return unwrap(api.get("/admin/bookings", { params: pickParams(params, BOOKING_PARAMS) }));
}

export async function updateBookingStatus(id, status) {
  return unwrap(api.patch(`/admin/bookings/${id}/status`, { status }));
}

function equipmentPayload(input = {}) {
  const out = { ...input };
  if (Array.isArray(out.terms)) out.terms = out.terms.join("\n");
  return out;
}

export async function createEquipment(input) {
  return unwrap(api.post("/equipment", equipmentPayload(input)));
}

const MINE_PARAMS = ["status", "page", "limit"];

export async function listMyEquipment(params = {}) {
  return unwrap(api.get("/equipment/mine/list", { params: pickParams(params, MINE_PARAMS) }));
}

export async function updateEquipment(id, input) {
  return unwrap(api.patch(`/equipment/${id}`, equipmentPayload(input)));
}

export async function deleteEquipment(id) {
  await unwrap(api.delete(`/equipment/${id}`));
  return { data: { id } };
}

export async function listAdminEquipment(params = {}) {
  return unwrap(api.get("/admin/equipment", { params: pickParams(params, ["status", "search", "page", "limit"]) }));
}

export async function updateEquipmentStatus(id, status) {
  return unwrap(api.patch(`/admin/equipment/${id}/status`, { status }));
}

export async function listAdminUsers(params = {}) {
  return unwrap(api.get("/admin/users", { params: pickParams(params, ["role", "search", "page", "limit"]) }));
}

export async function updateUserRole(id, role) {
  return unwrap(api.patch(`/admin/users/${id}/role`, { role }));
}

export async function deleteUser(id) {
  await unwrap(api.delete(`/admin/users/${id}`));
  return { data: { id } };
}

export async function getAdminAnalytics() {
  return unwrap(api.get("/analytics/admin"));
}

export async function getOwnerAnalytics() {
  const data = await unwrap(api.get("/analytics/owner"));
  // The server has no `thisMonthDelta` display string (contract wins):
  // derive "+X% vs <Mon>" from monthly[] when computable, else omit it.
  const mom = monthOverMonth(data?.data?.monthly, "earnings");
  if (mom) {
    data.data.thisMonthDelta = `${mom.pct >= 0 ? "+" : ""}${mom.pct}% vs ${mom.label}`;
  }
  return data;
}

export async function getMe() {
  return unwrap(api.get("/users/me"));
}

export async function updateMe(input) {
  return unwrap(api.patch("/users/me", input));
}
