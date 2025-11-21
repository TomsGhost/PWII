import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from '../Componentes/Navbar';
import "./favoriteEmbed.css";
import Swal from "sweetalert2";

export default function FavoriteEmbed() {
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();




  useEffect(() => {

    console.log("Datos recibidos -> PostID:", postId, "| UserID:", userId);

    if (!postId || !userId) {
      Swal.fire({
        title: "Faltan datos",
        text: `No se recibió el ID. Post: ${postId}, User: ${userId}`,
        icon: "warning",
        confirmButtonText: "Volver"
      }).then(() => {

      });
    }
  }, [postId, userId, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!note.trim()) newErrors.note = "La nota es obligatoria.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch("http://localhost:3001/addFavorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: userId,
          id_publicacion: postId,
          descripcion: note.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await Swal.fire("¡Guardado!", "Añadido a favoritos.", "success");

      } else {
        Swal.fire("Error", data.msg || "No se pudo guardar.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Fallo de conexión.", "error");
    }
  };

  return (
    <div className="page-container">
      <div className="color"></div>
      <div className="color"></div>
      <div className="color"></div>
      <Navbar />
      <section className="fv-section">
        <main className="fv-container">
          <form className="fv-card" onSubmit={onSubmit}>
            <h1 className="fv-title">Mi nuevo favorito...</h1>
            <div className="fv-inputBox">
              <input
                type="text"
                placeholder="Esta canción me encanta!"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              {errors.note && <p style={{ color: 'red' }}>{errors.note}</p>}
            </div>
            <div className="fv-actions">
              <button type="submit" className="fv-btn fv-btn-primary">Publicar</button>
              <button type="button" className="fv-btn" style={{marginLeft:'10px', background:'#888'}} onClick={() => navigate(-1)}>Cancelar</button>
            </div>
          </form>
        </main>
      </section>
    </div>
  );
}