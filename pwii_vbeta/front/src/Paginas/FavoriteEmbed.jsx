import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from '../Componentes/Navbar';
import "./favoriteEmbed.css";
import Swal from "sweetalert2";

export default function FavoriteEmbed() {
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});

  const onSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!note.trim()) {
      newErrors.note = "La nota es obligatoria.";
    } else if (note.length > 254) {
      newErrors.note = "No debe superar los 254 caracteres.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        title: "Error",
        text: "No es posible guardar el favorito, revise los datos",
        icon: "error",
      });
      return;
    }
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
              onChange={(e) => {
                setNote(e.target.value);
                if (errors.note) setErrors({ ...errors, note: null });
              }}
              aria-label="Nota del favorito"
            />
            {errors.note && <p style={{ color: 'red' }}>{errors.note}</p>}
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
