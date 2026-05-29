import { apiFetch } from "./api";

export const getCategories = async (signal) => {
  try {
    const data = await apiFetch("/categories/", { signal });

    return data; // 
  } catch (err) {
  
    if (err.name === "AbortError") return;

    console.error("Category fetch failed:", err);
    throw err;
  }
};