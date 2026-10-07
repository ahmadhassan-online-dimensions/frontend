import { useState } from "react";
import { Link } from "react-router-dom";
import Img from "../components/Img.jsx";
import { formatAED } from "../api.js";
import { useCart } from "../context/CartContext.jsx";
import { useProducts } from "../useProducts.js";

const MODELS = [
  {
    id: "model-01", name: "Model 01", title: "Wearable Eyewear",
    text: "Opens into eyewear with slender temples that rest on the ears. The signature piece.",
    hero: "model01-lifestyle.jpg", a: "m1-closed.jpg", b: "m1-open.jpg"
  },
  {
    id: "model-02", name: "Model 02", title: "Handheld Eyewear",
    text: "Opens into a lens held gracefully to the eyes — then closes, and becomes jewelry again.",
    hero: "model02-lifestyle.jpg", a: "m2-closed.jpg", b: "m2-open.jpg"
  }
];

function Detail({ model, product, flip }) {
  const { add, busy } = useCart();
  const [finish, setFinish] = useState("Solid Gold");
  const [qty, setQty] = useState(1);
  const max = product ? Math.max(1, Math.min(product.stock, 10)) : 1;

  return (
    <article className={`detail ${flip ? "detail--flip" : ""}`} id={model.id}>
      <div className="detail__media">
        <Img name={model.hero} alt={model.title} className="detail__hero" />
        <div className="model__pair">
          <Img name={model.a} className="model__thumb"><span className="tag">Closed</span></Img>
          <Img name={model.b} className="model__thumb"><span className="tag">Open</span></Img>
        </div>
      </div>

      <div className="detail__copy">
        <div className="model__n">{model.name}</div>
        <h2>{model.title}</h2>
        <p>{model.text}</p>

        {product ? (
          <>
            <div className="detail__price">From {formatAED(product.price)}</div>
            <div className="chips">
              {["Solid Gold", "Gold Plated"].map((f) => (
                <button key={f} className={`chip ${finish === f ? "is-on" : ""}`} onClick={() => setFinish(f)} aria-pressed={finish === f}>
                  <i className={f === "Solid Gold" ? "dot" : "dot dot--light"} />{f}
                </button>
              ))}
            </div>
            <div className="buyrow">
              <div className="qty qty--lg">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Less" disabled={qty <= 1}>−</button>
                <b>{qty}</b>
                <button onClick={() => setQty((q) => Math.min(max, q + 1))} aria-label="More" disabled={qty >= max}>+</button>
              </div>
              <button className="btn-dark btn-grow" disabled={busy || product.stock < 1} onClick={() => add(product._id, qty)}>
                {product.stock < 1 ? "Sold out" : "Add to bag"}
              </button>
            </div>
            <small className="detail__note">{product.stock > 0 ? `${product.stock} available` : "Currently unavailable"}</small>
          </>
        ) : (
          <p className="status status--left">Pricing will appear when the product is available.</p>
        )}
      </div>
    </article>
  );
}

export default function ModelsPage() {
  const { products, error } = useProducts();
  const find = (name) => products?.find((p) => p.name === name);

  return (
    <div className="page">
      <header className="pagehead">
        <h1>The Two Models</h1>
        <p>One gesture. Two characters.</p>
      </header>
      {error && <p className="status">{error}</p>}
      <div className="detail-list">
        {MODELS.map((m, i) => <Detail key={m.id} model={m} product={find(m.name)} flip={i === 1} />)}
      </div>
      <p className="pagenext"><Link to="/materials">Explore the materials <span>→</span></Link></p>
    </div>
  );
}
