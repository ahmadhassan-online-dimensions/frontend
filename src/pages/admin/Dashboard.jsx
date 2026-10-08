import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatAED } from "../../api.js";

const money = (n, cur) => (cur === "AED" ? formatAED(n) : `${cur} ${Number(n).toLocaleString("en-US")}`);

export default function Dashboard() {
  const [s, setS] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/admin/stats").then((d) => setS(d.stats)).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="form-error">{error}</p>;
  if (!s) return <p className="status status--left">Loading…</p>;

  const cards = [
    ["Revenue (paid)", s.revenue.length ? s.revenue.map((r) => money(r.total, r.currency)).join(" · ") : "0"],
    ["Orders", s.orders],
    ["Paid", s.paidOrders],
    ["Awaiting payment", s.pendingOrders],
    ["Products", s.products],
    ["Customers", s.users],
    ["Subscribers", s.subscribers]
  ];

  return (
    <>
      <h1 className="adm-h">Dashboard</h1>
      <div className="adm-cards">
        {cards.map(([label, value]) => (
          <div className="adm-card adm-stat" key={label}><span>{label}</span><b>{value}</b></div>
        ))}
      </div>

      <div className="adm-two">
        <section className="adm-card">
          <h2>Latest orders</h2>
          {s.recent.length === 0 ? <p className="adm-muted">No orders yet.</p> : (
            <div className="adm-scroll">
              <table className="adm-table">
                <tbody>
                  {s.recent.map((o) => (
                    <tr key={o._id}>
                      <td>#{o._id.slice(-6).toUpperCase()}</td>
                      <td>{o.user?.name || "—"}</td>
                      <td>{money(o.totalAmount, o.currency)}</td>
                      <td><span className={`pill pill--${o.status}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Link className="adm-link" to="/admin/orders">All orders →</Link>
        </section>

        <section className="adm-card">
          <h2>Low stock (5 or fewer)</h2>
          {s.lowStock.length === 0 ? <p className="adm-muted">All products are well stocked.</p> : (
            <ul className="adm-list">
              {s.lowStock.map((p) => <li key={p._id}><span>{p.name}</span><b>{p.stock} left</b></li>)}
            </ul>
          )}
          <Link className="adm-link" to="/admin/products">Manage products →</Link>
        </section>
      </div>
    </>
  );
}
