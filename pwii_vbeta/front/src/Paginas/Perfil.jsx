import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./perfil.css";
import ProfileEmbedCard from '../Componentes/ProfileEmbedCard';
import SpotifyPlayer from '../Componentes/SpotifyPlayer';
import Navbar from '../Componentes/Navbar';

export default function Perfil() {
  // Embeds en estado para poder eliminar
  const [embeds, setEmbeds] = useState(
    Array.from({ length: 9 }).map((_, i) => ({
      id: i + 1,
      title: "Pokémon",
      likes: 20,
      comments: 20,
    }))
  );

  // Modal de eliminación
  const [isFollowing, setIsFollowing] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  const openDeleteModal = (id) => setToDeleteId(id);
  const closeDeleteModal = () => setToDeleteId(null);
  const confirmDelete = () => {
    // TODO: aquí llamas a tu API (DELETE /embeds/:id)
    setEmbeds((prev) => prev.filter((e) => e.id !== toDeleteId));
    closeDeleteModal();
  };

  return (
    <section className="pf-section">
<Navbar />
      {/* Shell 2 columnas */}
      <div className="pf-shell">
        {/* Izquierda */}
        <aside className="pf-left">
          <div className="pf-avatar-wrap">
            <img
              className="pf-avatar"
              src="https://dummyimage.com/200x200/222/ffffff.jpg&text=Avatar"
              alt="Avatar de usuario"
            />
            <div className="pf-squares pf-squares-left">
              <span className="pf-square" style={{ "--d": "0s" }} />
              <span className="pf-square" style={{ "--d": "-1s" }} />
              <span className="pf-square" style={{ "--d": "-2s" }} />
            </div>
            <div className="pf-squares pf-squares-right">
              <span className="pf-square" style={{ "--d": "-.4s" }} />
              <span className="pf-square" style={{ "--d": "-1.4s" }} />
              <span className="pf-square" style={{ "--d": "-2.4s" }} />
            </div>
          </div>

          <div className="pf-nameRow">
            <h1 className="pf-username">Jordi</h1>
            <div className="pf-profile-actions">
              <Link to="/profileEdit" className="pf-icon-btn" title="Editar perfil">✏️</Link>
              <Link to="/deleteProfile" className="pf-icon-btn pf-icon-danger" title="Eliminar perfil">🗑️</Link>
              <div className="pf-icon-btn" title="Seguir usuario" onClick={() => setIsFollowing(!isFollowing)}>{isFollowing ? '✓' : '+'}</div>
            </div>
          </div>

          <div className="pf-likes">
            <h3>Me gusta</h3>
            <ul>
              <li><Link to="/ranking">Pokémon</Link></li>
              <li><Link to="#">Pokémon</Link></li>
              <li><Link to="#">Pokémon</Link></li>
            </ul>
          </div>

          <div className="pf-mini">
            <SpotifyPlayer />
          </div>
        </aside>

        {/* Derecha */}
        <main className="pf-right">
          <div className="pf-recent-title">Recientes</div>

          <div className="pf-grid">
            {embeds.map((it) => (

             <ProfileEmbedCard
                key={it.id}
                id={it.id}
                title={it.title}
                likes={it.likes}
                comments={it.comments}
                // Pasamos la función del componente padre al hijo
                openDeleteModal={openDeleteModal}
              />
            
            ))}
          </div>
        </main>
      </div>
      

      {/* MODAL: confirmar eliminación de embed */}
      {toDeleteId !== null && (
        <div className="pf-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="pf-modal-title">
          <div className="pf-modal">
            <h2 id="pf-modal-title">¿Seguro que deseas eliminar el embed?</h2>
            <p className="pf-modal-sub">Esta acción no se puede deshacer.</p>
            <div className="pf-modal-actions">
              <button className="pf-btn pf-btn-danger" onClick={confirmDelete}>Sí, eliminar</button>
              <button className="pf-btn pf-btn-ghost" onClick={closeDeleteModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
