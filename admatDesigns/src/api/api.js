import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/authKeys';
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        toast.error(data?.detail || "Something went wrong");

        // Handle expired token
        if (data.code === "token_not_valid") {
            const lastPath =
                window.location.pathname +
                window.location.search +
                window.location.hash;

            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);

            localStorage.setItem("lastPath", lastPath);

            window.location.href = "/signin";
        }

        throw data;
    }

    return data;
};