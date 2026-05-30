import { createContext, useContext, useState, useEffect } from "react";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./authKeys";
import { apiFetch } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (accessToken, refreshToken = null) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/profile/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      setUser({
        ...data,          // ✅ username, email, imageUrl
        token: accessToken
      });

      setIsAuthenticated(true);

    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    setUser(null);
    setIsAuthenticated(false);

    window.location.href = "/signin";
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);

      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {

        const data = await apiFetch("/profile/");

        setUser({
          ...data,
          token: localStorage.getItem(ACCESS_TOKEN_KEY),
        });

        setIsAuthenticated(true);

      } catch (err) {
        // ✅ If refresh failed → user is logged out
        setIsAuthenticated(false);
        setUser(null);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);