import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./favoriteEmbed.css";

export default function FavoriteEmbed() {
  const [note, setNote] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: Conecta a tu API para guardar el “favorito”
    console.log("Nuevo favorito:", { note });
  };

  return (
    <section className="fv-section">
      {/* Topbar */}
      <header className="fv-topbar">
        <div className="fv-brand">Embed</div>
        <nav className="fv-nav">
          <Link className="fv-pill fv-active" to="#">Inicio</Link>
          <Link className="fv-pill" to="#">Buscar</Link>
          <Link className="fv-pill" to="#">Perfil</Link>
          <Link className="fv-pill" to="#">Subir</Link>
        </nav>
      </header>

      {/* Contenido */}
      <main className="fv-container">
        <form className="fv-card" onSubmit={onSubmit}>
          <h1 className="fv-title">Mi nuevo favorito...</h1>

          <div className="fv-inputBox">
            <input
              type="text"
              placeholder="Esta canción me encanta!"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              aria-label="Nota del favorito"
              required
            />
          </div>

          <div className="fv-actions">
            <button type="submit" className="fv-btn fv-btn-primary">
              Publicar
            </button>
          </div>
        </form>
      </main>
    </section>
  );
}
