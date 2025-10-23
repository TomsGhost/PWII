import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./stylePerfil.css";

/* ====== Iconos SVG (sin librerías) ====== */
const PencilIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z" fill="currentColor"/>
    <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z" fill="currentColor"/>
  </svg>
);
const TrashIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
    <path d="M6 7h12l-1 14H7L6 7Z" fill="currentColor"/>
    <path d="M9 7V5h6v2M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default function Perfil() {
  const navigate = useNavigate();

  /* === CONFIGURABLES (sin localStorage para avatar/nombre) === */
  const username = "Jordi";
  const avatar   = "https://img.jpeg";
  const embedUrl =
    localStorage.getItem("embedUrl") ||
    "https://open.spotify.com/embed/track/1HNkqx9Ahdgi1Ixy2xkKkL?utm_source=generator";
  const embedNote = localStorage.getItem("embedNote") || "Me da sueño";

  /* === Datos mock (embeds) === */
  const mockPosts = [
    { id: 1, titulo: "Midnight Drive", artista: "Jordi Beats", genero: "Lo-fi",     likes: 28, comments: 12 },
    { id: 2, titulo: "Crimson Lights", artista: "Mar & Co.",   genero: "Synthwave", likes: 42, comments: 7  },
    { id: 3, titulo: "Reflejo",        artista: "Isay CG",     genero: "Indie",     likes: 13, comments: 3  },
    { id: 4, titulo: "Bloom",          artista: "Neon Valley", genero: "Pop",       likes: 36, comments: 19 },
    { id: 5, titulo: "Laguna",         artista: "Eira",        genero: "Lo-fi",     likes: 11, comments: 4  },
    { id: 6, titulo: "Nova",           artista: "Nover",       genero: "Chillhop",  likes: 23, comments: 6  },
    { id: 7, titulo: "Skylight",       artista: "Mar & Co.",   genero: "Synthwave", likes: 18, comments: 5  },
    { id: 8, titulo: "Neon Run",       artista: "Jordi Beats", genero: "Electro",   likes: 20, comments: 8  },
  ];
  const mockLikes = [
    { id: "L1", titulo: "Night Bloom", artista: "Eira",   likes: 9,  comments: 2  },
    { id: "L2", titulo: "Vapor Waves", artista: "Nover",  likes: 29, comments: 11 },
    { id: "L3", titulo: "Cielo Azul",  artista: "Isay CG",likes: 17, comments: 5  },
  ];

  /* === Acciones UI === */
  const handleEditProfile = () => {
    window.alert("Editar perfil (solo front por ahora)");
  };
  const handleDeleteAccount = () => {
    if (!window.confirm("¿Eliminar tu cuenta? (solo borra datos locales)")) return;
    localStorage.clear();
    window.alert("Cuenta eliminada localmente.");
    navigate("/register");
  };

  return (
    <section className="perfil-wrap">
      <div className="perfil-inner">

        {/* ===== Panel redondo principal con título y menú ===== */}
        <div className="panel">
          <div className="panel-top">
            <div className="panel-title">Embed</div>
            <nav className="panel-menu">
              <Link to="/inicio" className="pill active">Inicio</Link>
              <Link to="/buscar" className="pill">Buscar</Link>
              <Link to="/perfil" className="pill">Perfil</Link>
              <Link to="/subir" className="pill accent">Subir</Link>
            </nav>
          </div>

          {/* ===== Hero: 2 columnas */}
          <div className="hero-row">

            {/* Izquierda */}
            <div className="hero-left">
              {/* Embed más pequeño y sin scroll */}
              <div className="perfil-embed compact">
                <iframe
                  title="embed"
                  src={embedUrl}
                  width="100%"
                  height="64"
                  frameBorder="0"
                  scrolling="no"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
                <p className="perfil-embed-caption">{embedNote}</p>
              </div>

              {/* Me gusta*/}
              <section className="likes-box">
                <h3 className="box-title">Me gusta</h3>
                <div className="likes-list">
                  {mockLikes.map(item => (
                    <div key={item.id} className="like-row">
                      <div className="like-info">
                        <span className="like-title">{item.titulo}</span>
                        <span className="like-artist">· {item.artista}</span>
                      </div>
                      <div className="like-stats">
                        <span title="Likes">★ {item.likes}</span>
                        <span title="Comentarios">💬 {item.comments}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Derecha*/}
            <div className="hero-right">

              <div className="name-with-avatar">
                <h1 className="perfil-nombre">{username}</h1>
                <div className="name-actions">
                  <button type="button" className="icon-btn" onClick={handleEditProfile} aria-label="Editar perfil"><PencilIcon/></button>
                  <button type="button" className="icon-btn danger" onClick={handleDeleteAccount} aria-label="Eliminar cuenta"><TrashIcon/></button>
                </div>
                <div className="perfil-avatar big">
                  <img src={avatar} alt="avatar" />
                </div>
              </div>

              <h3 className="perfil-title right">Recientes</h3>
              <div className="cards-grid four-by-two">
                {mockPosts.map((c) => (
                  <SimpleCard key={c.id} data={c} />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* ===== Fin panel ===== */}
      </div>
    </section>
  );
}

/* ------ Tarjeta ------ */
function SimpleCard({ data }) {
  return (
    <article className="card simple-card">
      <div>
        <span className="card-tag">{data.genero}</span>
        <p className="card-title">{data.titulo}</p>
        <p className="card-artist">{data.artista}</p>
      </div>

      <div className="card-bottom">
        <ul className="stats">
          <li title="Likes">★ {data.likes}</li>
          <li title="Comentarios">💬 {data.comments}</li>
        </ul>
        <div className="card-actions">
          <button type="button" className="tiny-btn" aria-label="Editar"><PencilIcon/></button>
          <button type="button" className="tiny-btn danger" aria-label="Eliminar"><TrashIcon/></button>
        </div>
      </div>
    </article>
  );
}
