import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./createEmbed.css";
import Swal from "sweetalert2";

export default function CreateEmbed() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    const titleRegex = /^[^"]*$/; // sin caracteres que puedan romper el código
    const UrlRegex1 = /^https?:\/\/\S*embed\S*$/i; // url solamente + palabra 'embed'
    const UrlRegex2 = /<(iframe|script)[\s\S]*src=["']https?:\/\/\S*embed\S*["'][\s\S]*>[\s\S]*<\/\1>/i; // etiquetas posibles + url + palabra 'embed'

    if (!title.trim()) {
      newErrors.title = "El título es obligatorio.";
    } else if (title.length > 149) {
      newErrors.title = "No debe superar los 149 caracteres.";
    } else if (!titleRegex.test(title)) {
      newErrors.title = "El titulo no puede contener comillas dobles";
    }

    if (!desc.trim()) {
      newErrors.desc = "La descripción es obligatoria.";
    } else if (desc.length > 254) {
      newErrors.desc = "No debe superar los 254 caracteres.";
    }

    if (!url.trim()) {
      newErrors.url = "La URL del embed es obligatoria.";
    } else if (url.length > 64000) {
      newErrors.url = "El embed es demasiado largo para ser guardado.";
    } else if (!UrlRegex1.test(url) && !UrlRegex2.test(url)) {
      newErrors.url =
        "El embed ingresado no es válido. Intenta con otro formato.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        title: "Error",
        text: "No es posible crear el embed, revise los datos",
        icon: "error",
      });
      return;
    }

    console.log("Crear embed:", { title, desc, url });
    navigate("/HomePage");
  };

  return (
    <section className="ce-section">
      {/* Topbar */}
      <header className="ce-topbar">
        <div className="ce-brand">Embed</div>
        <nav className="ce-nav">
          <Link className="ce-pill ce-active" to="#">
            Inicio
          </Link>
          <Link className="ce-pill" to="#">
            Buscar
          </Link>
          <Link className="ce-pill" to="#">
            Perfil
          </Link>
          <Link className="ce-pill" to="#">
            Subir
          </Link>
        </nav>
      </header>

      {/* Contenido */}
      <main className="ce-container">
        <form className="ce-card" onSubmit={onSubmit}>
          <h1 className="ce-title">¿Qué quieres subir?</h1>

          <div className="ce-inputBox">
            <input
              type="text"
              placeholder="Título"
              value={title}
              aria-label="Título"
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: null });
              }}
            />
            {errors.title && <p className="error-text">{errors.title}</p>}
          </div>

          <div className="ce-inputBox">
            <input
              type="text"
              placeholder="Descripción"
              value={desc}
              aria-label="Descripción"
              onChange={(e) => {
                setDesc(e.target.value);
                if (errors.desc) setErrors({ ...errors, desc: null });
              }}
            />
            {errors.desc && <p className="error-text">{errors.desc}</p>}
          </div>

          <div className="ce-inputBox">
            <input
              type="text"
              placeholder="embed"
              value={url}
              aria-label="URL del embed"
              onChange={(e) => {
                setUrl(e.target.value);
                if (errors.url) setErrors({ ...errors, url: null });
              }}
            />
            {errors.url && <p className="error-text">{errors.url}</p>}
          </div>

          <div className="ce-actions">
            <button type="submit" className="ce-btn ce-btn-primary">
              Publicar
            </button>
          </div>
        </form>
      </main>
    </section>
  );
}
