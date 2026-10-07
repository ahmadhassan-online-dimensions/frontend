import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Nav.jsx";
import { api } from "../api.js";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const d = await api("/newsletter", { method: "POST", body: { email } });
      setMsg(d.message);
      setEmail("");
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <Logo />
          <h4>Jewelry, with<br />another point<br />of view.</h4>
          <p>An elegant collection of jewelry that transforms into functional eyewear, designed for the discerning aesthetic.</p>
        </div>
        <div className="footer__col">
          <h5>Explore</h5>
          <Link to="/#necklace">The Necklace</Link>
          <Link to="/models#model-01">Model 01</Link>
          <Link to="/models#model-02">Model 02</Link>
          <Link to="/materials">Materials</Link>
        </div>
        <div className="footer__col">
          <h5>Client Care</h5>
          <a href="mailto:hello@vueandor.com">Contact Us</a>
          <a href="#top">Shipping &amp; Delivery</a>
        </div>
        <form className="footer__news" onSubmit={submit}>
          <h5>Stay connected</h5>
          <h4>A closer look.</h4>
          <p>Discover new pieces, stones and private updates.</p>
          <label className="news__field">
            <input
              type="email" required placeholder="Email address" aria-label="Email address"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <button aria-label="Subscribe">→</button>
          </label>
          {msg && <small className="news__msg">{msg}</small>}
          <div className="footer__social">
            <a href="#top" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg>
            </a>
            <a href="#top" aria-label="WhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 21l1.6-5A9 9 0 1 1 8 19.4L3 21z" /></svg>
            </a>
          </div>
        </form>
      </div>
      <div className="footer__bar">
        <span>© 2026 VUE &amp; OR. ALL RIGHTS RESERVED</span>
        <span>
          <a href="#top">PRIVACY POLICY</a><a href="#top">TERMS &amp; CONDITIONS</a><b>UAE · AED</b>
        </span>
      </div>
    </footer>
  );
}
