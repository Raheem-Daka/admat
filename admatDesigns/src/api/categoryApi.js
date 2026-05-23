import { apiFetch } from "./api";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const getCategories = async (signal) => {
  const res = await apiFetch(`/categories/`, { signal });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
};