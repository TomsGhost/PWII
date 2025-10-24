import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./profileEdit.css";
import Swal from "sweetalert2";

export default function EditProfile() {
  const [username, setUsername] = useState("Jordi");
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handlePickFile = () => fileInputRef.current?.click();

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setAvatar(url);
  };

  const handleSave = (e) => {
    e.preventDefault();
    let newErrors = {};

    const usernameRegex = /^[a-zA-Z0-9\p{P}\p{M}áéíóúÁÉÍÓÚñÑüÜ]+$/u;

    if (!username.trim()) {
      newErrors.username = "El nombre de usuario es obligatorio.";
    } else if (username.length > 49) {
      newErrors.username = "No debe superar los 49 caracteres.";
    } else if (username.includes(" ")) {
      newErrors.username =
        "El nombre de usuario no puede contener espacios (máx. 1 palabra).";
    } else if (!usernameRegex.test(username)) {
        newErrors.username = "El nombre de usuario contiene caracteres no válidos.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        title: "Error",
        text: "No es posible registrar los cambios, revise los datos",
        icon: "error",
      });
      return;
    }

    console.log("Guardar perfil:", { username });
    navigate("/Perfil");
  };

  return (
    <section className="pe-section">
      {/* blobs de color del fondo */}
      <div className="pe-color" />
      <div className="pe-color" />
      <div className="pe-color" />

      {/* cuadrados flotantes */}
      <div className="pe-box">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="pe-square" style={{ "--i": i }} />
        ))}
      </div>

      {/* topbar */}
      <header className="pe-topbar">
        <div className="pe-brand">Embed</div>
        <nav className="pe-nav">
          <Link className="pe-pill pe-active" to="#">
            Inicio
          </Link>
          <Link className="pe-pill" to="#">
            Buscar
          </Link>
          <Link className="pe-pill" to="#">
            Perfil
          </Link>
          <Link className="pe-pill" to="#">
            Subir
          </Link>
        </nav>
      </header>

      {/* tarjeta central */}
      <main className="pe-container">
        <form className="pe-card" onSubmit={handleSave}>
          <div className="pe-avatar-wrap">
            <img
              className="pe-avatar"
              src={
                avatar ??
                "https://dummyimage.com/240x240/222/ffffff.jpg&text=Avatar"
              }
              alt="Avatar de usuario"
            />
            <button
              type="button"
              className="pe-btn pe-btn-secondary"
              onClick={handlePickFile}
            >
              Cambiar
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              hidden
            />
          </div>

          <h1 className="pe-title">Editando perfil :D</h1>

          <div className="pe-inputBox">
            <input
              type="text"
              placeholder="Nombre de usuario"
              name="username"
              value={username}
              aria-label="Nombre de usuario"
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors({ ...errors, username: null });
              }}
            />
            {errors.username && <p className="error-text">{errors.username}</p>}
          </div>

          <div className="pe-actions">
            <button className="pe-btn pe-btn-primary" type="submit">
              Guardar
            </button>
          </div>
        </form>
      </main>
    </section>
  );
}