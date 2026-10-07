import { Link } from "react-router-dom";
import Img from "./Img.jsx";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <Img name="hero.jpg" alt="" className="hero__bg" />
      <div className="hero__shade" />
      <div className="hero__copy">
        <h1>Jewelry, with another<br />point of view.</h1>
        <p>An elegant necklace designed to transform into<br />eyewear whenever you need it.</p>
        <div className="hero__cta">
          <Link className="btn-dark" to="/#necklace">Discover the Design</Link>
          <Link className="btn-ghost" to="/models">See how it transforms</Link>
        </div>
      </div>
    </section>
  );
}
