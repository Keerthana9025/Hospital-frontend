import { createContext, useContext, useState } from "react";
import { login as loginApi, register as registerApi } from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    return token ? { token, username } : null;
  });

  const login = async (username, password) => {
    const data = await loginApi({ username, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    setUser({ token: data.token, username: data.username });
  };

  const register = (formData) => registerApi(formData);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);