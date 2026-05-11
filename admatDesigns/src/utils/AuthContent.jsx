import { createContext, useContext, useState } from "react";
import { ACCESS_TOKEN_KEY } from "./authKeys";

const AuthContext = createContext(null);

const AuthContent = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem(ACCESS_TOKEN_KEY)
  );

  const login = (token) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContent;
export const useAuth = () => useContext(AuthContext);