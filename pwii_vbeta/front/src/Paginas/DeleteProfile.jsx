import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../Componentes/Navbar';
import "./deleteProfile.css";
import Swal from "sweetalert2";
import axios from "axios";

export default function DeleteProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    const id = localStorage.getItem("id");

    if (!id) {
      Swal.fire("Error", "No hay sesión activa.", "error");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:3001/deleteUser/${id}`);

      if (response.status === 200) {
        localStorage.clear();
        await Swal.fire("¡Hasta luego!", "Tu cuenta ha sido eliminada correctamente.", "success");
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      Swal.fire("Error", "Ocurrió un error al intentar eliminar tu cuenta.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="page-container">
      <div className="color"></div>
      <div className="color"></div>
      <div className="color"></div>
      <Navbar />
      <main className="dp-container">
        <div className="dp-card">
          <h1 className="dp-title">¿Seguro que quieres decir adiós...?</h1>
          <p className="dp-sub">...¿para siempre?!</p>

          <div className="dp-actions">
            <button 
              className="dp-btn dp-btn-primary" 
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "Procesando..." : "Sí, muajaja"}
            </button>
            <button 
              className="dp-btn dp-btn-secondary" 
              onClick={handleCancel}
              disabled={loading}
            >
              Siempre no
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}