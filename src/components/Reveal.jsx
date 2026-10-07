import { useRef, useState } from "react";
import Img from "./Img.jsx";

// Before/after slider: drag the handle to reveal the open (eyewear) photo.
export default function Reveal() {
  const box = useRef(null);
  const [pos, setPos] = useState(50);

  const move = (clientX) => {
    const r = box.current.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <section className="reveal" id="necklace">
      <h2>From necklace to vision.</h2>
      <p className="lede">Designed to be worn beautifully, and used effortlessly.</p>

      <div
        className="slider"
        ref={box}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); move(e.clientX); }}
        onPointerMove={(e) => e.buttons && move(e.clientX)}
      >
        <Img name="necklace-closed.jpg" alt="Necklace, worn" className="slider__img" />
        <Img
          name="eyewear-open.jpg"
          alt="Eyewear, open"
          className="slider__img slider__img--top"
          style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
        />
        <span className="slider__tag slider__tag--l">01 — WEAR IT</span>
        <span className="slider__tag slider__tag--r">02 — OPEN IT</span>
        <div className="slider__line" style={{ left: `${pos}%` }}>
          <button
            className="slider__handle"
            aria-label="Slide to open"
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
              if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#2a2420" strokeWidth="1.3">
              <path d="M2 10h16M5 7l-3 3 3 3M15 7l3 3-3 3" />
            </svg>
          </button>
        </div>
      </div>
      <div className="slider__hint">Slide to open</div>
    </section>
  );
}
