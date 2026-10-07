import { Link } from "react-router-dom";
import Img from "./Img.jsx";

const Tag = ({ children }) => <span className="tag">{children}</span>;

function Model({ n, title, text, hero, a, b, offset }) {
  return (
    <article className={`model ${offset ? "model--offset" : ""}`}>
      <Img name={hero} className="model__hero" />
      <div className="model__pair">
        <Img name={a} className="model__thumb"><Tag>Closed</Tag></Img>
        <Img name={b} className="model__thumb"><Tag>Open</Tag></Img>
      </div>
      <div className="model__n">Model {n}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <Link to={`/models#model-${n}`} className="model__link">Explore Model {n} <span>→</span></Link>
    </article>
  );
}

export default function TwoWays() {
  return (
    <section className="two" id="models">
      <h2>One gesture. Two characters.</h2>
      <div className="two__grid">
        <Model
          n="01" title="Wearable Eyewear" offset={false}
          text="Opens into eyewear with slender temples that rest on the ears. The signature piece."
          hero="model01-lifestyle.jpg" a="m1-closed.jpg" b="m1-open.jpg"
        />
        <Model
          n="02" title="Handheld Eyewear" offset
          text="Opens into a lens held gracefully to the eyes — then closes, and becomes jewelry again."
          hero="model02-lifestyle.jpg" a="m2-closed.jpg" b="m2-open.jpg"
        />
      </div>
    </section>
  );
}
