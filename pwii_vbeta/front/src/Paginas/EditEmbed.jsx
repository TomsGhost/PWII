import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from '../Componentes/Navbar';
import "./editEmbed.css";

export default function EditEmbed() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [url,  setUrl]  = useState("");

  const iframeSrc = useMemo(() => {
    const u = url.trim();

    if (/spotify\.com/.test(u)) {
      if (/\/embed\//.test(u)) return u;
      // convierte /track/ID a /embed/track/ID
      const idMatch = u.match(/spotify\.com\/(track|album|playlist)\/([A-Za-z0-9]+)/);
      if (idMatch) return `https://open.spotify.com/embed/${idMatch[1]}/${idMatch[2]}`;
      return u;
    }

    // YouTube
    if (/youtu\.be\/|youtube\.com/.test(u)) {
      // youtu.be/ID
      const short = u.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
      if (short) return `https://www.youtube.com/embed/${short[1]}`;

      // watch?v=ID
      const v = new URL(u, "https://youtube.com");
      const id = v.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;

      // ya es /embed/ID
      if (/\/embed\//.test(u)) return u;
    }

    // SoundCloud (usamos el player con URL codificada)
    if (/soundcloud\.com/.test(u)) {
      const enc = encodeURIComponent(u);
      return `https://w.soundcloud.com/player/?url=${enc}&color=%23ff5500&inverse=false&auto_play=false&show_user=true`;
    }

    return "";
  }, [url]);

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: aquí conectas a tu API para actualizar el embed
    console.log("Publicar embed", { title, desc, url });
  };

  return (
    <div className="page-container">
      <div className="color"></div>
      <div className="color"></div>
      <div className="color"></div>
        <Navbar />
    <section className="eb-section">
   
      {/* Contenido */}
      <main className="eb-container">
        <form className="eb-card" onSubmit={onSubmit}>
          <h1 className="eb-title">Una manita de gato</h1>

          <div className="eb-inputBox">
            <input
              type="text"
              placeholder="Girls like girls"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-label="Título"
            />
          </div>

          <div className="eb-inputBox">
            <input
              type="text"
              placeholder="love this song &lt;3"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              aria-label="Descripción"
            />
          </div>

          <div className="eb-inputBox">
            <textarea
              rows={3}
              placeholder="https://open.spotify.com/embed/track/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-label="URL del embed"
            />
          </div>

          <div className="eb-actions">
            <button type="submit" className="eb-btn eb-btn-primary">Listo</button>
          </div>

          {/* Preview del embed si se detecta proveedor */}
          {!!iframeSrc && (
            <div className="eb-preview">
              <div className="eb-previewLabel">Preview</div>
              <div className="eb-iframeWrap">
                <iframe
                  title="embed-preview"
                  src={iframeSrc}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </form>
      </main>
    </section>
    </div>
  );
}
