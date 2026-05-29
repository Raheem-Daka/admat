import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/authKeys';
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// ✅ Prevents multiple refresh calls
let refreshing = false;
let refreshPromise = null;

// ✅ Refresh token helper
const refreshToken = async () => {
  const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);

  console.log("REFRESH TOKEN:", refresh);

  if (!refresh) throw new Error("No refresh token");

  const res = await fetch(`${API_BASE}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  console.log("REFRESH STATUS:", res.status);

  if (!res.ok) {
    const err = await res.text();
    console.log("REFRESH ERROR:", err);
    throw new Error("Refresh failed");
  }

  const data = await res.json();

  localStorage.setItem(ACCESS_TOKEN_KEY, data.access);

  return data.access;
};

// ✅ Shared refresh manager (prevents multiple calls)
const getNewAccessToken = async () => {
  if (!refreshing) {
    refreshing = true;
    refreshPromise = refreshToken().finally(() => {
      refreshing = false;
    });
  }
  return refreshPromise;
};

// ✅ Retry delay helper
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export const apiFetch = async (
  endpoint,
  options = {},
  retry = true,
  retryCount = 2
) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  let res;
  
  const cookieConsent = localStorage.getItem("cookie-consent");

  const isAuthEndpoint =
    endpoint.includes("/signin") ||
    endpoint.includes("/signup") ||
    endpoint.includes("/token");

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),

    ...options.headers,

    // ✅ Only attach token for non-auth endpoints
    ...(!isAuthEndpoint && token && {
      Authorization: `Bearer ${token}`,
    }),

    // ✅ Cookie tracking (optional)
    ...(cookieConsent === "accepted" && {
      "X-Cookie-Consent": "accepted",
    }),
  };

  try {
    res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers,
    });

    console.log("API request:", endpoint, res.status);

  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === "AbortError") {
      throw new Error("Request timeout");
    }

    if (retryCount > 0) {
      await sleep(500 * (3 - retryCount));
      return apiFetch(endpoint, options, retry, retryCount - 1);
    }

    toast.error("Network error");
    throw err;
  }

  clearTimeout(timeoutId);

  if (res.status === 204) return null;

  let data;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { detail: "Invalid server response", raw: text };
  }

  // ✅ Token refresh
  if (res.status === 401 && 
    retry && 
    retryCount > 0 && 
    !isAuthEndpoint
  ) {
    try {
  
      await getNewAccessToken();

      
      return apiFetch(
        endpoint,
        options,
        false,
        retryCount - 1
      );
    } catch (err) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);

      const lastPath =
        window.location.pathname +
        window.location.search +
        window.location.hash;

      localStorage.setItem("lastPath", lastPath);

      toast.error("Session expired. Please sign in again.");
      window.location.href = "/signin";

      throw err;
    }
  }

  if (!res.ok && retryCount > 0 && res.status >= 500) {
    await sleep(500 * (3 - retryCount));
    return apiFetch(endpoint, options, retry, retryCount - 1);
  }

  if (!res.ok) {
    console.error("API error:", res.status, data);

  if (res.status !== 401) {
    const message =
      data?.error || data?.detail || "Something went wrong";

    toast.error(message);
  }
    throw data || new Error("Request failed");
  }

  return data;
};