"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { source } from "@/lib/data/source";

// ---------- public ----------

export function useStats() {
  return useQuery({ queryKey: ["stats"], queryFn: () => source.getPublicStats() });
}

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: () => source.getCategories() });
}

export function useFeatured() {
  return useQuery({ queryKey: ["featured"], queryFn: () => source.getFeaturedEquipment() });
}

export function useEquipmentList(params = {}) {
  return useQuery({
    queryKey: ["equipment", params],
    queryFn: () => source.listEquipment(params),
  });
}

export function useEquipment(id) {
  return useQuery({
    queryKey: ["equipment", id],
    queryFn: () => source.getEquipment(id),
    enabled: Boolean(id),
  });
}

// ---------- favorites ----------

export function useFavorites() {
  return useQuery({ queryKey: ["favorites"], queryFn: () => source.listFavorites() });
}

export function useFavoriteIds(options = {}) {
  const { enabled = true } = options;
  return useQuery({
    queryKey: ["favorite-ids"],
    queryFn: () => source.getFavoriteIds(),
    enabled,
  });
}

export function useToggleFavorite() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ equipmentId, isFavorite }) =>
      isFavorite ? source.removeFavorite(equipmentId) : source.addFavorite(equipmentId),
    onSettled: () => {
      client.invalidateQueries({ queryKey: ["favorite-ids"] });
      client.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

// ---------- booking + payment ----------

export function useCreateBooking() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input) => source.createBooking(input),
    onSettled: () => {
      client.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useCheckout() {
  return useMutation({
    mutationFn: (input) => source.createCheckout(input),
  });
}

export function useConfirmPayment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input) => source.confirmPayment(input),
    onSettled: () => {
      client.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useMyBookings(params = {}) {
  return useQuery({
    queryKey: ["bookings", "mine", params],
    queryFn: () => source.listMyBookings(params),
  });
}

export function useOwnerBookings(params = {}) {
  return useQuery({
    queryKey: ["bookings", "owner", params],
    queryFn: () => source.listOwnerBookings(params),
  });
}

export function useAdminBookings(params = {}) {
  return useQuery({
    queryKey: ["bookings", "admin", params],
    queryFn: () => source.listAdminBookings(params),
  });
}

export function useUpdateBookingStatus() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => source.updateBookingStatus(id, status),
    onSettled: () => {
      client.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

// ---------- owner equipment ----------

export function useMyEquipment(params = {}) {
  return useQuery({
    queryKey: ["equipment", "mine", params],
    queryFn: () => source.listMyEquipment(params),
  });
}

export function useCreateEquipment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input) => source.createEquipment(input),
    onSettled: () => {
      client.invalidateQueries({ queryKey: ["equipment"] });
    },
  });
}

export function useUpdateEquipment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }) => source.updateEquipment(id, input),
    onSettled: () => {
      client.invalidateQueries({ queryKey: ["equipment"] });
    },
  });
}

export function useDeleteEquipment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id) => source.deleteEquipment(id),
    onSettled: () => {
      client.invalidateQueries({ queryKey: ["equipment"] });
    },
  });
}

// ---------- admin ----------

export function useAdminEquipment(params = {}) {
  return useQuery({
    queryKey: ["equipment", "admin", params],
    queryFn: () => source.listAdminEquipment(params),
  });
}

export function useUpdateEquipmentStatus() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => source.updateEquipmentStatus(id, status),
    onSettled: () => {
      client.invalidateQueries({ queryKey: ["equipment"] });
    },
  });
}

export function useAdminUsers(params = {}) {
  return useQuery({
    queryKey: ["users", "admin", params],
    queryFn: () => source.listAdminUsers(params),
  });
}

export function useUpdateRole() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }) => source.updateUserRole(id, role),
    onSettled: () => {
      client.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id) => source.deleteUser(id),
    onSettled: () => {
      client.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useAdminAnalytics() {
  return useQuery({ queryKey: ["analytics", "admin"], queryFn: () => source.getAdminAnalytics() });
}

export function useOwnerAnalytics() {
  return useQuery({ queryKey: ["analytics", "owner"], queryFn: () => source.getOwnerAnalytics() });
}

// ---------- profile ----------

export function useMe() {
  return useQuery({ queryKey: ["me"], queryFn: () => source.getMe() });
}

export function useUpdateMe() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input) => source.updateMe(input),
    onSettled: () => {
      client.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
