import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../api.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const EMPTY = { items: [], totalItems: 0, totalAmount: 0 };

export function CartProvider({ children }) {
  const { user, setAuthOpen } = useAuth();
  const [cart, setCart] = useState(EMPTY);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // the cart lives on the server, so reload it whenever the user changes
  useEffect(() => {
    if (!user) { setCart(EMPTY); return; }
    api("/cart").then((d) => setCart(d.cart)).catch(() => {});
  }, [user]);

  const run = async (fn) => {
    setBusy(true); setError("");
    try { setCart((await fn()).cart); return true; }
    catch (e) { setError(e.message); return false; }
    finally { setBusy(false); }
  };

  const add = useCallback(async (productId, quantity = 1) => {
    if (!user) { setAuthOpen(true); return; }
    if (await run(() => api("/cart", { method: "POST", body: { productId, quantity } }))) setOpen(true);
  }, [user, setAuthOpen]);

  const setQty = (productId, quantity) =>
    run(() => api(`/cart/${productId}`, { method: "PUT", body: { quantity } }));
  const remove = (productId) =>
    run(() => api(`/cart/${productId}`, { method: "DELETE" }));

  const checkout = async (shippingAddress) => {
    const d = await api("/orders/checkout", { method: "POST", body: { shippingAddress } });
    window.location.href = d.paymentUrl; // hand over to 2Checkout's hosted page
  };

  return (
    <CartContext.Provider value={{ cart, open, setOpen, busy, error, setError, add, setQty, remove, checkout }}>
      {children}
    </CartContext.Provider>
  );
}
