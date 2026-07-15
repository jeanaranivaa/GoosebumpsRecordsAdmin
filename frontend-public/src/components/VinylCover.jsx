import { useState } from "react";

export default function VinylCover({ src, alt }) {
  // Guardamos la url que falló, no un booleano, para que el estado
  // se reinicie solo cuando el componente se reusa con otro vinilo.
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) {
    return <span className="vinyl-card-placeholder">♪</span>;
  }

  return <img src={src} alt={alt} onError={() => setFailedSrc(src)} />;
}
