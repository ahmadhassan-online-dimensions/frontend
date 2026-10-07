import { useState } from "react";

// Photo slot. Drop the real file into /public/images/<name>; until then a warm placeholder shows.
export default function Img({ name, alt = "", className = "", style, children }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`img ${className}`} style={style}>
      {!failed && (
        <img src={`/images/${name}`} alt={alt} onError={() => setFailed(true)} draggable="false" />
      )}
      {children}
    </div>
  );
}
