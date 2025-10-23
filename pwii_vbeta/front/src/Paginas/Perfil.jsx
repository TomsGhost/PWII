import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./perfil.css";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [recientes, setRecientes] = useState([]);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
   
    const id = localStorage.getItem("id");
    if (!id) return;

    (async () => {
      try {
        const { data } = await axios.post("http://localhost:3001/getUserData", { id });
        const u = data?.msg?.[0]?.[0] || null;
        setUser(u);

       
        const r1 = await axios.get(`http://localhost:3001/posts/recientes/${id}`);
        const r2 = await axios.get(`http://localhost:3001/posts/likes/${id}`);
        setRecientes(r1.data?.rows || []);
        setLikes(r2.data?.rows || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <section className="perfil-wrap">
      {/* barra superior */}
      <header className="perfil-navbar">
        <nav>
          <Link to="/Inicio" className="pill active">Inicio</Link>
          <Link to="/buscar" className="pill">Buscar</Link>
          <Link to="/perfil" className="pill">Perfil</Link>
          <Link to="/subir" className="pill accent">Subir</Link>
        </nav>
      </header>

      {/* cabecera de perfil */}
      <div className="perfil-hero">
        <div className="perfil-hero-inner">
          <div className="perfil-col-left">
            <h1 className="perfil-nombre">{user?.username || "Usuario"}</h1>

            {/* EMBED (ejemplo con Spotify/YouTube/Twitch) */}
            <div className="perfil-embed">
              {/* Reemplaza src por el tuyo */}
              <iframe
                title="embed"
                src="https://open.spotify.com/embed/track/1HNkqx9Ahdgi1Ixy2xkKkL?utm_source=generator"
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
              <p className="perfil-embed-caption">Me da sueño</p>
            </div>
          </div>

          <div className="perfil-col-right">
            <div className="perfil-avatar">
              {/* Si en tu BD guardas avatar_url, úsalo aquí */}
              <img
                src={user?.avatar_url || "https://i.pravatar.cc/240"}
                alt="avatar"
              />
              <button className="btn-fab" title="Editar foto">✎</button>
            </div>
          </div>
        </div>
      </div>

      {/* recientes */}
      <section className="perfil-section">
        <h2 className="perfil-title">Recientes</h2>
        <div className="cards-grid">
          {recientes.map((card) => (
            <Card key={card.id} data={card} />
          ))}
          {!recientes.length && <Empty text="Sin publicaciones recientes." />}
        </div>
      </section>

      {/* me gusta */}
      <section className="perfil-section">
        <h2 className="perfil-title">Me gusta</h2>
        <div className="cards-grid">
          {likes.map((card) => (
            <Card key={card.id} data={card} />
          ))}
          {!likes.length && <Empty text="Aún no hay likes." />}
        </div>
      </section>
    </section>
  );
}

function Card({ data }) {
  return (
    <article className="card">
      <div className="card-head">
        <span className="card-tag">{data?.categoria || "Pokémon"}</span>
        <div className="card-actions">
          <button aria-label="Editar">✎</button>
          <button aria-label="Eliminar">🗑</button>
        </div>
      </div>
      <div className="card-body">
        <p className="card-title">{data?.titulo || "Título"}</p>
        <ul className="stats">
          <li>★ {data?.puntos || 20}</li>
          <li>💬 {data?.comentarios || 20}</li>
        </ul>
      </div>
    </article>
  );
}

function Empty({ text }) {
  return <p className="empty">{text}</p>;
}
