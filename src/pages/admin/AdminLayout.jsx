import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { Logo } from "../../components/Nav.jsx";

function AdminLogin() {
  const { login } = useAuth();
  const [f, setF] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError("");
    try { await login(f.email, f.password); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="adm-center">
      <form className="adm-card adm-login" onSubmit={submit}>
        <Logo />
        <h1>Admin sign in</h1>
        <label>Email<input type="email" required autoComplete="username" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
        <label>Password<input type="password" required autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
        {error && <p className="form-error">{error}</p>}
        <button className="btn-dark" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </div>
  );
}

export default function AdminLayout() {
  const { user, ready, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!ready) return <div className="adm-center"><p className="status">Loading…</p></div>;
  if (!user) return <AdminLogin />;

  if (!user.isAdmin) {
    return (
      <div className="adm-center">
        <div className="adm-card adm-login">
          <Logo />
          <h1>No access</h1>
          <p>{user.email} is not an administrator.</p>
          <button className="btn-dark" onClick={logout}>Sign out</button>
        </div>
      </div>
    );
  }

  const links = [
    ["/admin", "Dashboard", true],
    ["/admin/products", "Products"],
    ["/admin/orders", "Orders"],
    ["/admin/users", "Users"],
    ["/admin/subscribers", "Subscribers"]
  ];

  return (
    <div className="adm">
      <header className="adm-top">
        <button className="adm-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /><span /></button>
        <Logo />
        <span className="adm-tag">Admin</span>
        <div className="adm-top__right">
          <span className="adm-who">{user.email}</span>
          <button className="adm-btn" onClick={logout}>Sign out</button>
        </div>
      </header>

      <div className="adm-body">
        <nav className={`adm-side ${open ? "is-open" : ""}`} onClick={() => setOpen(false)}>
          {links.map(([to, label, end]) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? "on" : "")}>{label}</NavLink>
          ))}
          <a href="/" target="_blank" rel="noreferrer">View website ↗</a>
        </nav>
        <main className="adm-main"><Outlet /></main>
      </div>
    </div>
  );
}
