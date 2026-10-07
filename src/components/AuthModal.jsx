import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthModal() {
  const { authOpen, setAuthOpen, login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!authOpen) return null;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      mode === "login" ? await login(f.email, f.password) : await register(f.name, f.email, f.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="overlay" onClick={() => setAuthOpen(false)}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h3>{mode === "login" ? "Sign in" : "Create account"}</h3>
        {mode === "register" && (
          <label>Name<input required value={f.name} onChange={set("name")} autoComplete="name" /></label>
        )}
        <label>Email<input required type="email" value={f.email} onChange={set("email")} autoComplete="email" /></label>
        <label>Password<input required type="password" minLength={6} value={f.password} onChange={set("password")}
          autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>
        {error && <p className="form-error">{error}</p>}
        <button className="btn-dark" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Register"}</button>
        <button type="button" className="link" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
          {mode === "login" ? "New here? Create an account" : "Have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}
