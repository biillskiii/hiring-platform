"use client";
import { create } from "zustand";

export const useUIStore = create((set) => ({
  loading: false,
  alert: null,

  setLoading: (val) => set({ loading: val }),
  showAlert: (label, variant = "primary") => set({ alert: { label, variant } }),
  clearAlert: () => set({ alert: null }),
}));
