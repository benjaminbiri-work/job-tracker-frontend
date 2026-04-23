import React, { createContext, useContext, useEffect, useState } from "react";
import { api, clearToken, getToken, setToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  async function loadMe() {
    try {
      const res = await api("/auth/me");
      setUser(res.user);
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setBooting(false);
    }
  }

  useEffect(() => {
    if (getToken()) loadMe();
    else setBooting(false);
  }, []);

  async function login(form) {
    const res = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify(form)
    });
    setToken(res.token);
    await loadMe();
  }

  async function register(form) {
    return api("/auth/register", {
      method: "POST",
      body: JSON.stringify(form)
    });
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, booting, login, register, logout, reload: loadMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
