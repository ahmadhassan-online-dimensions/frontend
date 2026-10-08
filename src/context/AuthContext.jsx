import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, getToken, setToken } from "../api.js";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  // on load: if a token is saved, ask the backend who it belongs to
  useEffect(() => {
    if (!getToken()) { setReady(true); return; }
    api("/users/profile")
      .then((d) => setUser(d.user))
      .catch(() => setToken(null))
      .finally(() => setReady(true));
  }, []);

  const finish = (d) => { setToken(d.token); setUser(d.user); setAuthOpen(false); };

  const login = useCallback(async (email, password) =>
    finish(await api("/users/login", { method: "POST", body: { email, password } })), []);

  const register = useCallback(async (name, email, password) =>
    finish(await api("/users/register", { method: "POST", body: { name, email, password } })), []);

  // Google: body = { credential }, Apple: body = { idToken, name? } (the provider's ID token)
  const social = useCallback(async (provider, body) =>
    finish(await api(`/users/${provider}`, { method: "POST", body })), []);

  const logout = useCallback(() => { setToken(null); setUser(null); }, []);

  return (
    <AuthContext.Provider value={{ user, ready, login, register, social, logout, authOpen, setAuthOpen }}>
      {children}
    </AuthContext.Provider>
  );
}
