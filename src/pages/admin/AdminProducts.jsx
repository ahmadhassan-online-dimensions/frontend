import { useEffect, useState } from "react";
import { api, formatAED } from "../../api.js";

const BLANK = { name: "", description: "", price: "", stock: "0", category: "", checkoutCode: "" };

export default function AdminProducts() {
  const [list, setList] = useState(null);
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(null);          // null | { _id?, ...fields }
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");

  const load = () =>
    api("/products?limit=100")
      .then((d) => setList(d.products))
      .catch((e) => setError(e.message));

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true); setFormError("");
    const body = {
      name: edit.name, description: edit.description,
      price: Number(edit.price), stock: Number(edit.stock),
      category: edit.category, checkoutCode: edit.checkoutCode
    };
    try {
      if (edit._id) await api(`/products/${edit._id}`, { method: "PUT", body });
      else await api("/products", { method: "POST", body });
      setEdit(null);
      await load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try { await api(`/products/${p._id}`, { method: "DELETE" }); await load(); }
    catch (err) { setError(err.message); }
  };

  const set = (k) => (e) => setEdit({ ...edit, [k]: e.target.value });

  return (
    <>
      <div className="adm-head">
        <h1 className="adm-h">Products</h1>
        <button className="adm-btn adm-btn--dark" onClick={() => { setFormError(""); setEdit({ ...BLANK }); }}>+ Add product</button>
      </div>
      {error && <p className="form-error">{error}</p>}
      {!list ? <p className="status status--left">Loading…</p> : (
        <div className="adm-card adm-scroll">
          <table className="adm-table">
            <thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th>2Checkout code</th><th /></tr></thead>
            <tbody>
              {list.map((p) => (
                <tr key={p._id}>
                  <td><b>{p.name}</b></td>
                  <td>{formatAED(p.price)}</td>
                  <td>{p.stock <= 5 ? <span className="pill pill--cancelled">{p.stock}</span> : p.stock}</td>
                  <td>{p.category || "—"}</td>
                  <td>{p.checkoutCode ? <code>{p.checkoutCode}</code> : <span className="adm-muted">not set</span>}</td>
                  <td className="adm-actions">
                    <button className="adm-btn" onClick={() => { setFormError(""); setEdit({ ...BLANK, ...p, price: String(p.price), stock: String(p.stock), checkoutCode: p.checkoutCode || "", category: p.category || "" }); }}>Edit</button>
                    <button className="adm-btn adm-btn--danger" onClick={() => remove(p)}>Delete</button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan="6" className="adm-muted">No products yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {edit && (
        <div className="overlay" onClick={() => setEdit(null)}>
          <form className="modal adm-modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h3>{edit._id ? "Edit product" : "New product"}</h3>
            <label>Name<input required value={edit.name} onChange={set("name")} /></label>
            <label>Description<input required value={edit.description} onChange={set("description")} /></label>
            <div className="adm-row">
              <label>Price (AED)<input required type="number" min="0" step="0.01" value={edit.price} onChange={set("price")} /></label>
              <label>Stock<input required type="number" min="0" step="1" value={edit.stock} onChange={set("stock")} /></label>
            </div>
            <label>Category<input value={edit.category} onChange={set("category")} /></label>
            <label>2Checkout product code<input value={edit.checkoutCode} onChange={set("checkoutCode")} placeholder="from 2Checkout → Setup → Products" /></label>
            {formError && <p className="form-error">{formError}</p>}
            <button className="btn-dark" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
            <button type="button" className="link" onClick={() => setEdit(null)}>Cancel</button>
          </form>
        </div>
      )}
    </>
  );
}
