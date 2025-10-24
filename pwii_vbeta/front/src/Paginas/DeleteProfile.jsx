import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from '../Componentes/Navbar';
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
    
      <div className="page-container">
      <div className="color"></div>
      <div className="color"></div>
      <div className="color"></div>
        <Navbar />
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
      </div>
  
  );
}
