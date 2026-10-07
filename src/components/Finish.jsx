import { useState } from "react";
import Img from "./Img.jsx";

const FINISHES = [
  { id: "gold", name: "Solid Gold", text: "18k solid gold. The heirloom expression.", color: "#d9ad58", img: "finish-gold.jpg" },
  { id: "plated", name: "Gold Plated", text: "Gold plated. The everyday expression.", color: "#ebe1cf", img: "finish-plated.jpg" }
];

export default function Finish() {
  const [sel, setSel] = useState(FINISHES[0]);

  return (
    <section className="finish" id="materials">
      <div className="finish__panel">
        <Img name={sel.img} alt={sel.name} className="finish__img" />
        <div className="finish__copy">
          <h2>{sel.name}</h2>
          <p>{sel.text}</p>
          <div className="swatches" role="radiogroup" aria-label="Finish">
            {FINISHES.map((f) => (
              <button
                key={f.id}
                role="radio"
                aria-checked={sel.id === f.id}
                aria-label={f.name}
                className={`swatch ${sel.id === f.id ? "is-on" : ""}`}
                onClick={() => setSel(f)}
              >
                <span style={{ background: f.color }} />
              </button>
            ))}
          </div>
          <small>Available on both models</small>
        </div>
      </div>
    </section>
  );
}
