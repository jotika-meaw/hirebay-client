// apiSource: real backend calls (wired in Phase W).
// Same function names and shapes as mockSource; components stay untouched.

function notWired(name) {
  throw { status: 501, message: `API source not wired yet: ${name} (Phase W)` };
}

export function setMockSession() {
  notWired("setMockSession");
}

export function resetMockStore() {
  notWired("resetMockStore");
}

export async function getPublicStats() {
  notWired("getPublicStats");
}

export async function getCategories() {
  notWired("getCategories");
}

export async function getFeaturedEquipment() {
  notWired("getFeaturedEquipment");
}

export async function listEquipment() {
  notWired("listEquipment");
}

export async function getEquipment() {
  notWired("getEquipment");
}

export async function listFavorites() {
  notWired("listFavorites");
}

export async function getFavoriteIds() {
  notWired("getFavoriteIds");
}

export async function addFavorite() {
  notWired("addFavorite");
}

export async function removeFavorite() {
  notWired("removeFavorite");
}

export async function createBooking() {
  notWired("createBooking");
}

export async function createCheckout() {
  notWired("createCheckout");
}

export async function confirmPayment() {
  notWired("confirmPayment");
}

export async function listMyBookings() {
  notWired("listMyBookings");
}

export async function listOwnerBookings() {
  notWired("listOwnerBookings");
}

export async function listAdminBookings() {
  notWired("listAdminBookings");
}

export async function updateBookingStatus() {
  notWired("updateBookingStatus");
}

export async function createEquipment() {
  notWired("createEquipment");
}

export async function listMyEquipment() {
  notWired("listMyEquipment");
}

export async function updateEquipment() {
  notWired("updateEquipment");
}

export async function deleteEquipment() {
  notWired("deleteEquipment");
}

export async function listAdminEquipment() {
  notWired("listAdminEquipment");
}

export async function updateEquipmentStatus() {
  notWired("updateEquipmentStatus");
}

export async function listAdminUsers() {
  notWired("listAdminUsers");
}

export async function updateUserRole() {
  notWired("updateUserRole");
}

export async function deleteUser() {
  notWired("deleteUser");
}

export async function getAdminAnalytics() {
  notWired("getAdminAnalytics");
}

export async function getOwnerAnalytics() {
  notWired("getOwnerAnalytics");
}

export async function getMe() {
  notWired("getMe");
}

export async function updateMe() {
  notWired("updateMe");
}
