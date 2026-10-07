import { Link } from "react-router-dom";
import Finish from "../components/Finish.jsx";
import Products from "../components/Products.jsx";

export default function MaterialsPage() {
  return (
    <div className="page">
      <header className="pagehead">
        <h1>Materials</h1>
        <p>Two finishes. Both models.</p>
      </header>
      <Finish />
      <Products />
      <p className="pagenext"><Link to="/models">Discover the two models <span>→</span></Link></p>
    </div>
  );
}
