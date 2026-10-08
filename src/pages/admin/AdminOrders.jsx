import { Fragment, useEffect, useState } from "react";
import { api, formatAED } from "../../api.js";

const money = (n, cur) => (cur === "AED" ? formatAED(n) : `${cur} ${Number(n).toLocaleString("en-US")}`);
const FILTERS = [["", "All"], ["paid", "Paid"], ["pending", "Awaiting payment"], ["cancelled", "Cancelled"]];

export default function AdminOrders() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(null);

  const load = () =>
    api(`/admin/orders?page=${page}&limit=15${status ? `&status=${status}` : ""}`)
      .then(setData)
      .catch((e) => setError(e.message));

  useEffect(() => { setData(null); load(); }, [status, page]); // eslint-disable-line

  const setFulfillment = async (o, fulfillment) => {
    try { await api(`/admin/orders/${o._id}`, { method: "PUT", body: { fulfillment } }); await load(); }
    catch (err) { setError(err.message); }
  };

  return (
    <>
      <h1 className="adm-h">Orders</h1>
      <div className="adm-tabs">
        {FILTERS.map(([v, label]) => (
          <button key={v} className={status === v ? "on" : ""} onClick={() => { setStatus(v); setPage(1); }}>{label}</button>
        ))}
      </div>
      {error && <p className="form-error">{error}</p>}
      {!data ? <p className="status status--left">Loading…</p> : (
        <div className="adm-card adm-scroll">
          <table className="adm-table">
            <thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Total</th><th>Payment</th><th>Fulfilment</th><th /></tr></thead>
            <tbody>
              {data.orders.map((o) => (
                <Fragment key={o._id}>
                  <tr>
                    <td><b>#{o._id.slice(-6).toUpperCase()}</b></td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>{o.user?.name || "—"}<br /><span className="adm-muted">{o.user?.email}</span></td>
                    <td>{money(o.totalAmount, o.currency)}</td>
                    <td><span className={`pill pill--${o.status}`}>{o.status}</span></td>
                    <td>
                      <select
                        value={o.fulfillment || "processing"}
                        disabled={o.status !== "paid"}
                        onChange={(e) => setFulfillment(o, e.target.value)}
                        aria-label="Fulfilment status"
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                    <td><button className="adm-btn" onClick={() => setOpen(open === o._id ? null : o._id)}>{open === o._id ? "Hide" : "Details"}</button></td>
                  </tr>
                  {open === o._id && (
                    <tr className="adm-detail">
                      <td colSpan="7">
                        <div className="adm-two">
                          <div>
                            <h4>Items</h4>
                            <ul className="adm-list">
                              {o.items.map((i, k) => <li key={k}><span>{i.name} × {i.quantity}</span><b>{money(i.price * i.quantity, o.currency)}</b></li>)}
                            </ul>
                          </div>
                          <div>
                            <h4>Ship to</h4>
                            <p>
                              {o.shippingAddress.fullName}<br />
                              {o.shippingAddress.address}<br />
                              {o.shippingAddress.city}{o.shippingAddress.state ? `, ${o.shippingAddress.state}` : ""} {o.shippingAddress.postalCode || ""}<br />
                              {o.shippingAddress.country}
                              {o.shippingAddress.phone && <><br />{o.shippingAddress.phone}</>}
                            </p>
                            {o.paymentRef && <p className="adm-muted">2Checkout ref: {o.paymentRef}</p>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {data.orders.length === 0 && <tr><td colSpan="7" className="adm-muted">No orders here yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {data && data.totalPages > 1 && (
        <div className="adm-pager">
          <button className="adm-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Previous</button>
          <span>Page {data.page} of {data.totalPages}</span>
          <button className="adm-btn" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}>Next →</button>
        </div>
      )}
    </>
  );
}
