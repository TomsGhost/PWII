import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Navbar from "../Componentes/Navbar";
import Swal from 'sweetalert2';
import axios from 'axios';
import "./styleHome.css";
import star1 from "../assets/Star 1.png";
import star2 from "../assets/Star 2(1).png";

// Recientes (Este componente es visual, lo dejamos igual)
const RecienteCard = ({ title, author }) => (
  <Link to="/ranking" className="reciente-card-link">
    <div className="reciente-card">
      <div className="reciente-card-image"></div>
      <div className="reciente-card-info">
        <h4>{title}</h4>
        <p>{author}</p>
        <div className="reciente-card-stats">
          <span>+ 20</span>
          <span>♥ 20</span>
        </div>
      </div>
    </div>
  </Link>
);

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estado para datos del usuario logueado
  const [datos, setDatos] = useState(location.state?.datos);
  
  // NUEVO: Estado para la lista de seguidos y embeds
  const [followingList, setFollowingList] = useState([]); 
  const [embeds, setEmbeds] = useState([]);

  // 1. Fetch Datos del Usuario Logueado
  useEffect(() => {
    const fetchUserData = async () => {
      const id = localStorage.getItem("id");
      console.log("ID Usuario:", id);
      
      if (!datos && id) {
        try {
          const userDataPayload = { id };
          const response = await axios.post(
            "http://localhost:3001/getUserData",
            userDataPayload
          );
          if (response.data?.msg?.[0]?.[0]) {
            setDatos(response.data.msg[0][0]);
          }
        } catch (error) {
          console.error("Error en la petición:", error);
          Swal.fire({
            title: "Error",
            text: "Error al buscar los datos del usuario.",
            icon: "error",
          });
        }
      } else if (id === null) {
        navigate("/"); // Si no hay ID, regresa al login (ajusté -1 a / por seguridad)
      }
    };
    fetchUserData();
  }, [datos, navigate]);

  // 2. NUEVO: Fetch de la lista "Siguiendo"
  useEffect(() => {
    const fetchFollowing = async () => {
      const id = localStorage.getItem("id");
      if (id) {
        try {
          const response = await axios.get(`http://localhost:3001/getFollowing/${id}`);
          if (response.data) {
            setFollowingList(response.data);
          }
        } catch (error) {
          console.error("Error obteniendo seguidos:", error);
        }
      }
    };
    fetchFollowing();
  }, []);

  // 3. Fetch de Publicaciones (Feed/Recientes)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/getPosts");
        if (response.data) {
          setEmbeds(response.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar las publicaciones.",
          icon: "error",
        });
      }
    };

    fetchPosts();
  }, []);

  // Modal de eliminación (Lógica existente)
  const [toDeleteId, setToDeleteId] = useState(null);
  const openDeleteModal = (id) => setToDeleteId(id);
  const closeDeleteModal = () => setToDeleteId(null);
  const confirmDelete = () => {
    setEmbeds((prev) => prev.filter((e) => e.id !== toDeleteId));
    closeDeleteModal();
  };

  // Datos de ejemplo (Solo dejamos el Top, ya no necesitamos 'siguiendo' falso)
  const top = [
    { title: "Top", artist: "prettynightmare", album: "phunk rocker" },
    { title: "Stylus", artist: "stylus", album: "" },
  ];

  return (
    <div className="page-container">
      <div className="color"></div>
      <div className="color"></div>
      <div className="color"></div>
      <Navbar />
      <main className="content-wrapper home-content-wrapper">
        <div className="home-left-column">
          
          {/* SECCIÓN TOP (Estática por ahora) */}
          <div className="box2 top-list">
            {top.map((item, index) => (
              <Link to={`/Ranking/`} key={index}>
                <div className="top-item">
                  <div className="top-item-icon">M</div>
                  <div className="top-item-info">
                    <h4>{item.title}</h4>
                    <p>{item.artist}</p>
                    <span>{item.album}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* SECCIÓN SIGUIENDO (DINÁMICA) */}
          <div className="box2 siguiendo-list">
            <h3>Siguiendo</h3>
            {followingList.length > 0 ? (
              followingList.map((user) => (
                // Enlazamos al perfil usando el ID real del usuario
                <Link to={`/perfil/${user.id}`} key={user.id}>
                  <div className="siguiendo-item">
                    <img
                      // Usamos la foto de la BD o una por defecto si es null
                      src={user.fotografia || "https://dummyimage.com/40x40/2C264C/FFFFFF?text=" + user.nombre_usuario.charAt(0)}
                      alt={`Foto de ${user.nombre_usuario}`}
                      className="siguiendo-pic"
                    />
                    {/* Mostramos el nombre de usuario real */}
                    <p>{user.nombre_usuario}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p style={{ padding: "10px", fontSize: "0.9rem", color: "#aaa" }}>
                Aún no sigues a nadie.
              </p>
            )}
          </div>
        </div>

        <div className="home-right-column">
          <h1 className="home-title">Más de lo que ves...</h1>
          <div className="box2 recientes-container">
            <h3>Recientes</h3>
            <div className="recientes-grid">
              {embeds.map((it) => (
                <Link
                  key={it.id}
                  to={`/Ranking/${it.id}`}
                  className="pf-card-link"
                >
                  <article className="pf-card">
                    <header className="pf-card-title">{it.titulo}</header>
                    <div className="pf-metrics">
                      <span>
                        <img src={star2} alt="Estrella vacía" /> {it.likes}
                      </span>
                      <span>💬 {it.comments}</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;