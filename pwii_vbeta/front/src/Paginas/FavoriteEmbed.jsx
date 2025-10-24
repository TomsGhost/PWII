import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from '../Componentes/Navbar';
import "./favoriteEmbed.css";

export default function FavoriteEmbed() {
  const [note, setNote] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: Conecta a tu API para guardar el “favorito”
    console.log("Nuevo favorito:", { note });
  };

  return (
       <div className="page-container">
      <div className="color"></div>
      <div className="color"></div>
      <div className="color"></div>
        <Navbar />
    <section className="fv-section">

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
    </div>
  );
}
