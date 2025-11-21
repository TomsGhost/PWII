import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./perfil.css";
import ProfileEmbedCard from '../Componentes/ProfileEmbedCard';
import SpotifyPlayer from '../Componentes/SpotifyPlayer';
import Navbar from '../Componentes/Navbar';

export default function Perfil() {
  const { id } = useParams();
  
  const [perfilData, setPerfilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [embeds, setEmbeds] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  
  const [lastLikes, setLastLikes] = useState([]);

  const [isFollowing, setIsFollowing] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

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

  useEffect(() => {
    const fetchLastLikes = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/lastLikes/${id}`);
        if (response.data) {
          setLastLikes(response.data);
        }
      } catch (error) {
        console.error("Error fetching last likes:", error);
      }
    };
    if (id) fetchLastLikes();
  }, [id]);

  // --- FETCH: Estado de seguimiento ---
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

  // --- HANDLERS ---
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

  // --- RENDER ---
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
               src={`https://ui-avatars.com/api/?name=${perfilData.nombre_usuario}&background=random&color=fff`}
                alt={`Avatar de ${perfilData.nombre_usuario}`}
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
            <h3>Recientemente le gustó:</h3>
            <ul>
              {lastLikes.length > 0 ? (
                lastLikes.map((like) => (
                  <li key={like.id}>
                    <Link to={`/post/${like.id}`}>
                      {like.titulo}
                    </Link>
                  </li>
                ))
              ) : (
                <li style={{ color: "#888", fontStyle: "italic" }}>
                  Sin actividad reciente
                </li>
              )}
            </ul>
          </div>

          <div className="pf-mini">
            {favoritos.length > 0 ? (
              favoritos.map((fav) => (
                <div key={fav.favorito_id} className="pf-mini-item">
                  <SpotifyPlayer embedUrl={fav.embed_code} height="80" />
                  <div className="pf-mini-content">
                    <p className="pf-fav-note">{fav.nota_favorito}</p>
                  </div>
                </div>
              ))
            ) : (
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