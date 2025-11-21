import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./perfil.css";
import ProfileEmbedCard from '../Componentes/ProfileEmbedCard';
import SpotifyPlayer from '../Componentes/SpotifyPlayer';
import Navbar from '../Componentes/Navbar';

export default function Perfil() {
  const { id } = useParams();
  const loggedInUserIdFromLocalStorage = localStorage.getItem("id");
  
  const [perfilData, setPerfilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [embeds, setEmbeds] = useState([]);
  
  // 1. ESTADO PARA FAVORITOS
  const [favoritos, setFavoritos] = useState([]);

  const [isFollowing, setIsFollowing] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  // Fetch Datos Usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.post("http://localhost:3001/getUserData", { id });
        if (response.data && response.data.msg && response.data.msg[0]) {
          setPerfilData(response.data.msg[0][0]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUserData();
  }, [id]);

  // Fetch Publicaciones
  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/posts/${id}`);
        if (response.data) {
          setEmbeds(response.data);
        }
      } catch (error) {
        console.error("Error fetching posts data:", error);
      }
    };
    if (id) fetchPostsData();
  }, [id]);

  // 2. FETCH FAVORITOS (Lógica Backend)
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/favorites/${id}`);
        if (response.data) {
          setFavoritos(response.data);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    if (id) fetchFavorites();
  }, [id]);

  // Fetch Seguimiento
  useEffect(() => {
    const checkFollowingStatus = async () => {
      const seguidorId = localStorage.getItem("id");
      const seguidoId = id;
      if (!seguidorId || !seguidoId) return;

      try {
        const response = await axios.get("http://localhost:3001/verificar-seguimiento", {
          params: { seguidorId, seguidoId }
        });
        if (response.data) {
          setIsFollowing(response.data.sigue_actualmente === 1);
        }
      } catch (error) {
        console.error("Error checking following status:", error);
      }
    };
    if (id) checkFollowingStatus();
  }, [id]);

  const handleFollowToggle = async () => {
    const seguidorId = localStorage.getItem("id");
    const seguidoId = id;
    if (!seguidorId || !seguidoId) return;

    const url = isFollowing ? "http://localhost:3001/unfollow" : "http://localhost:3001/follow";

    try {
      await axios.post(url, { seguidorId, seguidoId });
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error al actualizar el estado de seguimiento:", error);
    }
  };

  const openDeleteModal = (id) => setToDeleteId(id);
  const closeDeleteModal = () => setToDeleteId(null);

  const confirmDelete = async () => {
    if (toDeleteId) {
      try {
        const loggedInUserId = localStorage.getItem("id");
        if (!loggedInUserId) return;

        await axios.put(`http://localhost:3001/deletePost/${toDeleteId}`, {
          id_usuario_autor: loggedInUserId,
        });

        setEmbeds((prevEmbeds) =>
          prevEmbeds.filter((embed) => embed.id !== toDeleteId)
        );
      } catch (error) {
        console.error("Error al eliminar:", error);
      } finally {
        closeDeleteModal();
      }
    }
  };

  if (loading) return <div>Cargando perfil...</div>;
  if (!perfilData) return <div>No se encontraron datos del perfil.</div>;

  const loggedInUserId = localStorage.getItem("id");

  return (
    <section className="pf-section">
      <Navbar />
      <div className="pf-shell">
        {/* Izquierda */}
        <aside className="pf-left">
          <div className="pf-avatar-wrap">
            <img
              className="pf-avatar"
              src={perfilData.fotografia || "https://dummyimage.com/200x200/222/ffffff.jpg&text=Avatar"}
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
            <h1 className="pf-username">{perfilData.nombre_usuario}</h1>
            <div className="pf-profile-actions">
              {loggedInUserId === id ? (
                <>
                  <Link 
                    to="/profileEdit" 
                    className="pf-icon-btn" 
                    title="Editar perfil"
                    state={{ username: perfilData.nombre_usuario, avatar: perfilData.fotografia }}
                  >✏️</Link>
                  <Link to="/deleteProfile" className="pf-icon-btn pf-icon-danger" title="Eliminar perfil">🗑️</Link>
                </>
              ) : (
                <div className="pf-icon-btn" title="Seguir usuario" onClick={handleFollowToggle}>{isFollowing ? '✓' : '+'}</div>
              )}
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

          {/* 3. AQUÍ VA LA LÓGICA DE FAVORITOS SIN ROMPER ESTILOS */}
          <div className="pf-mini">
            {favoritos.length > 0 ? (
              favoritos.map((fav) => (
                <div key={fav.favorito_id} className="pf-mini-item">
                  {/* Player del embed */}
                  <SpotifyPlayer embedUrl={fav.embed_code} height="80" />
                  
                  {/* Título y Nota (Renderizado simple) */}
                  <div className="pf-mini-content">
                    <p className="pf-fav-note">{fav.nota_favorito}</p>
                  </div>
                </div>
              ))
            ) : (
              // Si no hay favoritos, mostramos uno vacío o el player por defecto como tenías
              <SpotifyPlayer />
            )}
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
                title={it.titulo}
                likes={it.total_me_gusta}
                comments={it.total_comentarios}
                openDeleteModal={openDeleteModal}
                isOwner={loggedInUserId === id}
              />
            ))}
          </div>
        </main>
      </div>

      {/* MODAL */}
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