import Hero from "../components/Hero.jsx";
import Reveal from "../components/Reveal.jsx";
import TwoWays from "../components/TwoWays.jsx";
import Finish from "../components/Finish.jsx";
import { Beautiful, Uae, Closing } from "../components/Story.jsx";
import Products from "../components/Products.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <Reveal />
      <TwoWays />
      <Finish />
      <Beautiful />
      <Uae />
      <Products />
      <Closing />
    </>
  );
}
