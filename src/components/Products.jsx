import { useState } from "react";
import Img from "./Img.jsx";
import { formatAED } from "../api.js";
import { useProducts } from "../useProducts.js";
import { useCart } from "../context/CartContext.jsx";

const IMAGES = [
  { main: "piece1.jpg", inset: "piece1-inset.jpg" },
  { main: "piece2.jpg", inset: "piece2-inset.jpg" }
];

function Card({ product, index }) {
  const { add, busy } = useCart();
  const [finish, setFinish] = useState("Solid Gold");
  const imgs = IMAGES[index % IMAGES.length];

  return (
    <article className="piece">
      <Img name={imgs.main} alt={product.name} className="piece__img">
        <Img name={imgs.inset} className="piece__inset" />
      </Img>
      <div className="piece__row">
        <h3>{product.name}</h3>
        <span>From {formatAED(product.price)}</span>
      </div>
      <div className="chips">
        {["Solid Gold", "Gold Plated"].map((f) => (
          <button
            key={f}
            className={`chip ${finish === f ? "is-on" : ""}`}
            onClick={() => setFinish(f)}
            aria-pressed={finish === f}
          >
            <i className={f === "Solid Gold" ? "dot" : "dot dot--light"} />{f}
          </button>
        ))}
      </div>
      <button className="btn-shop" disabled={busy || product.stock < 1} onClick={() => add(product._id, 1)}>
        {product.stock < 1 ? "Sold out" : "Shop now"}
      </button>
    </article>
  );
}

export default function Products() {
  // public endpoint, no login needed
  const { products, error } = useProducts(2);

  return (
    <section className="products" id="products">
      <h2>Find your piece.</h2>
      {error && <p className="status">{error}</p>}
      {products && products.length === 0 && (
        <p className="status">No pieces available yet. Run <code>npm run seed</code> in the backend.</p>
      )}
      <div className="products__grid">
        {(products || []).map((p, i) => <Card key={p._id} product={p} index={i} />)}
      </div>
    </section>
  );
}
