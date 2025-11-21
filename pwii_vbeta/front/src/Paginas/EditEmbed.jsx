import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from '../Componentes/Navbar';
import "./editEmbed.css";
import Swal from "sweetalert2";
import axios from "axios";

export default function EditEmbed() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/getPostById/${id}`);
        const postData = response.data[0][0];
        if (postData) {
          setTitle(postData.titulo);
          setDesc(postData.descripcion);
          setUrl(postData.embed || "");
        } else {
          Swal.fire("Error", "No se pudo encontrar la publicación.", "error");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
        Swal.fire("Error", "No se pudieron cargar los datos de la publicación.", "error");
        navigate("/");
      }
    };

    fetchPost();
  }, [id, navigate]);

  const iframeSrc = useMemo(() => {
    const u = (url || "").trim();

    if (/spotify\.com/.test(u)) {
      if (/\/embed\//.test(u)) return u;

      const idMatch = u.match(
        /spotify\.com\/(track|album|playlist)\/([A-Za-z0-9]+)/
      );
      if (idMatch)
        return `https://open.spotify.com/embed/${idMatch[1]}/${idMatch[2]}`;
      return u;
    }

    // YouTube
    if (/youtu\.be\/|youtube\.com/.test(u)) {
  
      const short = u.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
      if (short) return `https://www.youtube.com/embed/${short[1]}`;


      const v = new URL(u, "https://youtube.com");
      const id = v.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;


      if (/\/embed\//.test(u)) return u;
    }


    if (/soundcloud\.com/.test(u)) {
      const enc = encodeURIComponent(u);
      return `https://w.soundcloud.com/player/?url=${enc}&color=%23ff5500&inverse=false&auto_play=false&show_user=true`;
    }

    return "";
  }, [url]);

  const onSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    const titleRegex = /^[^"]*$/;
    const UrlRegex1 = /^https?:\/\/\S*embed\S*$/i;
    const UrlRegex2 = /<iframe[\s\S]*src=["']https?:\/\/\S*embed\S*["'][\s\S]*>[\s\S]*<\/iframe>/i;

    if (!title.trim()) newErrors.title = "El título es obligatorio.";
    else if (title.length > 149) newErrors.title = "No debe superar los 149 caracteres.";
    else if (!titleRegex.test(title)) newErrors.title = "El titulo no puede contener comillas dobles";

    if (!desc.trim()) newErrors.desc = "La descripción es obligatoria.";
    else if (desc.length > 254) newErrors.desc = "No debe superar los 254 caracteres.";

    if (!url.trim()) newErrors.url = "La URL del embed es obligatoria.";
    else if (url.length > 64000) newErrors.url = "El embed es demasiado largo para ser guardado.";
    else if (!UrlRegex1.test(url) && !UrlRegex2.test(url)) newErrors.url = "El embed ingresado no es válido. Intenta con otro formato.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Swal.fire("Error", "No es posible actualizar el embed, revise los datos", "error");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3001/updatePost/${id}`, {
        title: title,
        desc: desc,
        embed: url,
      });

      if (response.status === 200) {
        Swal.fire("¡Éxito!", "Publicación actualizada correctamente.", "success");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      Swal.fire("Error", "No se pudo actualizar la publicación.", "error");
    }
  };

  return (
    <div className="page-container">
      <div className="color"></div>
      <div className="color"></div>
      <div className="color"></div>
        <Navbar />
    <section className="eb-section">
   

      <main className="eb-container">
        <form className="eb-card" onSubmit={onSubmit}>
          <h1 className="eb-title">Una manita de gato</h1>

          <div className="eb-inputBox">
            <input
              type="text"
              placeholder="Girls like girls"
              value={title}
              aria-label="Título"
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: null });
              }}
            />
            {errors.title && <p className="error-text">{errors.title}</p>}
          </div>

          <div className="eb-inputBox">
            <input
              type="text"
              placeholder="love this song &lt;3"
              value={desc}
              aria-label="Descripción"
              onChange={(e) => {
                setDesc(e.target.value);
                if (errors.desc) setErrors({ ...errors, desc: null });
              }}
            />
            {errors.desc && <p className="error-text">{errors.desc}</p>}
          </div>

          <div className="eb-inputBox">
            <textarea
              rows={3}
              placeholder="https://open.spotify.com/embed/track/..."
              value={url}
              aria-label="URL del embed"
              onChange={(e) => {
                setUrl(e.target.value);
                if (errors.url) setErrors({ ...errors, url: null });
              }}
            />
            {errors.url && <p className="error-text">{errors.url}</p>}
          </div>

          <div className="eb-actions">
            <button type="submit" className="eb-btn eb-btn-primary">
              Listo
            </button>
          </div>

          {/* Preview del embed si se detecta proveedor */}
          {!!iframeSrc && (
            <div className="eb-preview">
              <div className="eb-previewLabel">Preview</div>
              <div className="eb-iframeWrap">
                <iframe
                  title="embed-preview"
                  src={iframeSrc}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </form>
      </main>
    </section>
    </div>
  );
}
