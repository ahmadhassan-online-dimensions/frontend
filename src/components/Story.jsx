import Img from "./Img.jsx";

export function Beautiful() {
  return (
    <section className="beautiful">
      <div className="beautiful__copy">
        <h2>Beautiful, even before you know what it does.</h2>
        <p>Jewelry-inspired design · Functional eyewear · Effortless everyday elegance</p>
      </div>
      <Img name="beautiful.jpg" alt="Gold pendant" className="beautiful__img" />
    </section>
  );
}

export function Uae() {
  return (
    <section className="uae">
      <Img name="uae.jpg" className="uae__bg" />
      <div className="uae__shade" />
      <div className="uae__copy">
        <h2>Made for moments when you<br />want to see a little closer.</h2>
      </div>
    </section>
  );
}

export function Closing() {
  return (
    <section className="closing">
      <Img name="closing.jpg" className="closing__bg" />
      <div className="closing__shade" />
      <h2>Wear the jewelry.<br />Discover what it can do.</h2>
    </section>
  );
}
