import { useEffect, useState } from "react";
import { api } from "./api.js";

// public product list from the backend, ordered Model 01, Model 02
export function useProducts(limit = 20) {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/products?limit=${limit}`)
      .then((d) => setProducts([...d.products].sort((a, b) => a.name.localeCompare(b.name))))
      .catch((e) => setError(e.message));
  }, [limit]);

  return { products, error };
}
