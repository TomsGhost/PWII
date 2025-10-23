import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./deleteProfile.css";

export default function DeleteProfile({ onConfirm, onCancel }) {
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (onConfirm) return onConfirm();
    console.log("Eliminar perfil: confirmado");
   
  };

  const handleCancel = () => {
    if (onCancel) return onCancel();
    console.log("Eliminar perfil: cancelado");
    navigate(-1); // volver
  };

  return (
    <section className="dp-section">
      {/* Topbar */}
      <header className="dp-topbar">
        <div className="dp-brand">Embed</div>
        <nav className="dp-nav">
          <Link className="dp-pill dp-active" to="#">Inicio</Link>
          <Link className="dp-pill" to="#">Buscar</Link>
          <Link className="dp-pill" to="#">Perfil</Link>
          <Link className="dp-pill" to="#">Subir</Link>
        </nav>
      </header>

      {/* Contenido central */}
      <main className="dp-container">
        <div className="dp-card">
          <h1 className="dp-title">¿Seguro que quieres decir adiós...?</h1>
          <p className="dp-sub">...¿para siempre?!</p>

          <div className="dp-actions">
            <button className="dp-btn dp-btn-primary" onClick={handleConfirm}>
              Sí, muajaja
            </button>
            <button className="dp-btn dp-btn-secondary" onClick={handleCancel}>
              Siempre no
            </button>
          </div>
        </div>
      </main>
    </section>
  );
}
