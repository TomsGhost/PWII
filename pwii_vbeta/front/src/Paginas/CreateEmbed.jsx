import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Navbar from "../Componentes/Navbar";
import "./createEmbed.css";
import axios from "axios";
import Swal from "sweetalert2";

export default function CreateEmbed() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const [datos, setDatos] = useState(location.state?.datos);

  useEffect(() => {
    const fetchUserData = async () => {
      const id = localStorage.getItem("id");
      console.log(id);
      if (!datos && id) {
        try {
          const userDataPayload = { id };
          const response = await axios.post("http://localhost:3001/getUserData", userDataPayload);
          if (response.data?.msg?.[0]?.[0]) {
            setDatos(response.data.msg[0][0]);
          }
        } catch (error) {
          console.error("Error en la petición:", error);
          Swal.fire({ title: 'Error', text: 'Error al buscar los datos del usuario.', icon: 'error' });
        }
      } else if(id===null) {
        navigate(-1);
      }
    };
    fetchUserData();
  }, [datos]);

  const onSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};



    const UrlRegex2 =


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


    const data = {
      id: localStorage.getItem("id"),
      title: title,
      desc: desc,
      embed: url,
    };

    try {
      const respuesta = await axios.post(
        "http://localhost:3001/createEmbed",
        data
      );

      const mensaje = respuesta.data.msg[0][0].estado;

      if (mensaje === "PUBLICACION_CREADA") {
        navigate(-1);
      } else if (mensaje) {
        Swal.fire({
          title: "Error",
          text: "No es posible crear la publicación: " + mensaje,
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Error al crear publicación: La respuesta del servidor no es válida.",
          icon: "error",
        });
      }
      console.log(respuesta.data);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Error en la petición.",
        icon: "error",
      });
    }


  };

  return (
    <div className="page-container">
      <div className="color"></div>
      <div className="color"></div>
      <div className="color"></div>
      <Navbar />
      <section className="ce-section">

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
    </div>
  );
}
