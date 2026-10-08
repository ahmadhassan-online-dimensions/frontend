import { useEffect, useState } from "react";
import { api } from "../../api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");

  const load = () => api("/users").then((d) => setUsers(d.users)).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const toggle = async (u) => {
    const next = !u.isAdmin;
    if (!window.confirm(`${next ? "Give" : "Remove"} admin access ${next ? "to" : "from"} ${u.email}?`)) return;
    try { await api(`/admin/users/${u._id}/admin`, { method: "PUT", body: { isAdmin: next } }); await load(); }
    catch (err) { setError(err.message); }
  };

  return (
    <>
      <h1 className="adm-h">Users</h1>
      {error && <p className="form-error">{error}</p>}
      {!users ? <p className="status status--left">Loading…</p> : (
        <div className="adm-card adm-scroll">
          <table className="adm-table">
            <thead><tr><th>Name</th><th>Email</th><th>Joined</th><th>Role</th><th /></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td><b>{u.name}</b></td>
                  <td>{u.email}</td>
                  <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td>
                  <td>{u.isAdmin ? <span className="pill pill--paid">admin</span> : "customer"}</td>
                  <td>{u._id !== me._id && <button className="adm-btn" onClick={() => toggle(u)}>{u.isAdmin ? "Remove admin" : "Make admin"}</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export function AdminSubscribers() {
  const [subs, setSubs] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/admin/subscribers").then((d) => setSubs(d.subscribers)).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <h1 className="adm-h">Newsletter subscribers</h1>
      {error && <p className="form-error">{error}</p>}
      {!subs ? <p className="status status--left">Loading…</p> : (
        <div className="adm-card adm-scroll">
          <table className="adm-table">
            <thead><tr><th>Email</th><th>Subscribed</th></tr></thead>
            <tbody>
              {subs.map((s) => <tr key={s._id}><td>{s.email}</td><td>{new Date(s.createdAt).toLocaleDateString()}</td></tr>)}
              {subs.length === 0 && <tr><td colSpan="2" className="adm-muted">No subscribers yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
