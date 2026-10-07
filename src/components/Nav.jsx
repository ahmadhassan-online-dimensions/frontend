import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export const Logo = () => (
  <span className="logo">VUE <i>&amp;</i> OR</span>
);

export default function Nav() {
  const { user, logout, setAuthOpen } = useAuth();
  const { cart, setOpen } = useCart();
  const { pathname } = useLocation();
  const [menu, setMenu] = useState(false);

  useEffect(() => setMenu(false), [pathname]);

  return (
    <header className={`nav ${menu ? "nav--open" : ""}`}>
      <Link to="/" className="nav__logo"><Logo /></Link>

      <nav className="nav__links" id="site-menu">
        <Link to="/#necklace" className={pathname === "/" ? "active" : ""}>The Necklace</Link>
        <NavLink to="/models" className={({ isActive }) => (isActive ? "active" : "")}>The Two Models</NavLink>
        <NavLink to="/materials" className={({ isActive }) => (isActive ? "active" : "")}>Materials</NavLink>
        <div className="nav__account nav__account--menu">
          {user ? (
            <>
              <span>{user.name}</span>
              <button onClick={logout}>Sign out</button>
            </>
          ) : (
            <button onClick={() => setAuthOpen(true)}>Sign in</button>
          )}
        </div>
      </nav>

      <div className="nav__account">
        <span className="nav__desk">
          {user ? (
            <>
              <span>{user.name}</span>
              <button onClick={logout}>Sign out</button>
            </>
          ) : (
            <button onClick={() => setAuthOpen(true)}>Sign in</button>
          )}
        </span>
        <button onClick={() => setOpen(true)}>Bag ({cart.totalItems})</button>
        <button
          className="nav__burger"
          aria-label={menu ? "Close menu" : "Open menu"}
          aria-expanded={menu}
          aria-controls="site-menu"
          onClick={() => setMenu((m) => !m)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
