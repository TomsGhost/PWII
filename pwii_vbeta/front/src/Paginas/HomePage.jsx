import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Navbar from "../Componentes/Navbar";
import Swal from "sweetalert2";
import axios from "axios";
import "./styleHome.css";
import star2 from "../assets/Star 2(1).png";

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [datos, setDatos] = useState(location.state?.datos);
  const [followingList, setFollowingList] = useState([]);
  const [embeds, setEmbeds] = useState([]);
  const [topPosts, setTopPosts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const id = localStorage.getItem("id");

      if (!datos && id) {
        try {
          const response = await axios.post(
            "http://localhost:3001/getUserData",
            { id }
          );
          if (response.data?.msg?.[0]?.[0]) {
            setDatos(response.data.msg[0][0]);
          }
        } catch (error) {
          console.error("Error datos usuario:", error);
          navigate("/"); // Si falla, volver al login
        }
      } else if (id === null) {
        navigate("/");
      }
    };
    fetchUserData();
  }, [datos, navigate]);

  useEffect(() => {
    const fetchFollowing = async () => {
      const id = localStorage.getItem("id");
      if (id) {
        try {
          const response = await axios.get(
            `http://localhost:3001/getFollowing/${id}`
          );
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

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/getTopPosts");
        if (response.data) {
          setTopPosts(response.data);
        }
      } catch (error) {
        console.error("Error fetching top posts:", error);
      }
    };
    fetchTopPosts();
  }, []);

  return (
    <div className="page-container">
      <div className="color"></div>
      <div className="color"></div>
      <div className="color"></div>
      <Navbar />

      <main className="content-wrapper home-content-wrapper">
        <div className="home-left-column">
          <div className="box2 top-list">
            <h3>Top Popular</h3>
            {topPosts.length > 0 ? (
              topPosts.map((item, index) => (
                <Link to={`/Ranking/${item.id}`} key={item.id}>
                  <div className="top-item">
                    <div className="top-item-icon">{index + 1}</div>
                    <div className="top-item-info">
                      <h4>{item.titulo}</h4>
                      <p>{item.autor}</p>
                      <span>♥ {item.total_likes} Likes</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p style={{ padding: "10px", color: "#ccc" }}>Cargando Top...</p>
            )}
          </div>

          <div className="box2 siguiendo-list">
            <h3>Siguiendo</h3>
            {followingList.length > 0 ? (
              followingList.map((user) => (
                <Link to={`/perfil/${user.id}`} key={user.id}>
                  <div className="siguiendo-item">
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.nombre_usuario}&background=random&color=fff`}
                      alt={`Avatar de ${user.nombre_usuario}`}
                      className="siguiendo-pic"
                    />
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
                        <img src={star2} alt="Estrella" /> {it.likes}
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
