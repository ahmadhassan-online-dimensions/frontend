import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { formatAED } from "../api.js";

const BLANK = { fullName: "", phone: "", address: "", city: "", country: "" };

export default function CartDrawer() {
  const { cart, open, setOpen, busy, error, setError, setQty, remove, checkout } = useCart();
  const [step, setStep] = useState("cart");
  const [addr, setAddr] = useState(BLANK);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  if (!open) return null;
  const set = (k) => (e) => setAddr({ ...addr, [k]: e.target.value });

  const close = () => { setOpen(false); setStep("cart"); setError(""); setPayError(""); };

  const pay = async (e) => {
    e.preventDefault();
    setPaying(true); setPayError("");
    try { await checkout(addr); }
    catch (err) { setPayError(err.message); setPaying(false); }
  };

  return (
    <div className="overlay overlay--right" onClick={close}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <header>
          <h3>{step === "cart" ? "Your bag" : "Delivery details"}</h3>
          <button onClick={close} aria-label="Close">✕</button>
        </header>

        {step === "cart" ? (
          <>
            <div className="drawer__items">
              {cart.items.length === 0 && <p className="status">Your bag is empty.</p>}
              {cart.items.map(({ product, quantity, lineTotal }) => (
                <div className="line" key={product._id}>
                  <div>
                    <strong>{product.name}</strong>
                    <span>{formatAED(product.price)}</span>
                    <div className="qty">
                      <button disabled={busy || quantity <= 1} onClick={() => setQty(product._id, quantity - 1)} aria-label="Less">−</button>
                      <b>{quantity}</b>
                      <button disabled={busy} onClick={() => setQty(product._id, quantity + 1)} aria-label="More">+</button>
                    </div>
                  </div>
                  <div className="line__right">
                    <span>{formatAED(lineTotal)}</span>
                    <button className="link" onClick={() => remove(product._id)}>Remove</button>
                  </div>
                </div>
              ))}
              {error && <p className="form-error">{error}</p>}
            </div>
            <footer>
              <div className="total"><span>Total</span><b>{formatAED(cart.totalAmount)}</b></div>
              <button className="btn-dark" disabled={cart.items.length === 0} onClick={() => setStep("address")}>Checkout</button>
            </footer>
          </>
        ) : (
          <form className="drawer__form" onSubmit={pay}>
            <label>Full name<input required value={addr.fullName} onChange={set("fullName")} /></label>
            <label>Phone<input value={addr.phone} onChange={set("phone")} /></label>
            <label>Address<input required value={addr.address} onChange={set("address")} /></label>
            <label>City<input required value={addr.city} onChange={set("city")} /></label>
            <label>Country<input required value={addr.country} onChange={set("country")} /></label>
            {payError && <p className="form-error">{payError}</p>}
            <div className="total"><span>Total</span><b>{formatAED(cart.totalAmount)}</b></div>
            <button className="btn-dark" disabled={paying}>{paying ? "Redirecting…" : "Pay securely"}</button>
            <button type="button" className="link" onClick={() => setStep("cart")}>Back to bag</button>
          </form>
        )}
      </aside>
    </div>
  );
}
