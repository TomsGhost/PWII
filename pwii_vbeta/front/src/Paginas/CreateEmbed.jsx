import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from '../Componentes/Navbar';
import "./createEmbed.css";

export default function CreateEmbed() {
  const [title, setTitle] = useState("");
  const [desc,  setDesc]  = useState("");
  const [url,   setUrl]   = useState("");

  const onSubmit = (e) => {
    e.preventDefault();

    console.log("Crear embed:", { title, desc, url });
  };

  return (
    <div className="page-container">
      <div className="color"></div>
      <div className="color"></div>
      <div className="color"></div>
        <Navbar />
    <section className="ce-section">
     
      {/* Contenido */}
      <main className="ce-container">
        <form className="ce-card" onSubmit={onSubmit}>
          <h1 className="ce-title">¿Qué quieres subir?</h1>

          <div className="ce-inputBox">
            <input
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-label="Título"
              required
            />
          </div>

          <div className="ce-inputBox">
            <input
              type="text"
              placeholder="Descripción"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              aria-label="Descripción"
              required
            />
          </div>

          <div className="ce-inputBox">
            <input
              type="url"
              placeholder="embed"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-label="URL del embed"
              required
            />
          </div>

          <div className="ce-actions">
            <button type="submit" className="ce-btn ce-btn-primary">
              Publicar
            </button>
          </div>
        </form>
      </main>
    </section>
    </div>
  );
}

