import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../Componentes/Navbar";
import EmbedDetails from "../Componentes/EmbedDetails";
import "./styleRanking.css";
import mercyImg from "../assets/Mercy2.png";
import Swal from "sweetalert2";

function RankingPage() {
  const { id } = useParams(); // Se mantiene 'id' como en tu código original
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recuperamos el ID del usuario con la clave que usas en tu login: "id"
  const userId = localStorage.getItem("id");

  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [errors, setErrors] = useState({});

  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false); // Estado para el botón de favorito
  
  const navigate = useNavigate();

  // Mocks de Prueba
  const [canciones] = useState([
    { rank: 1, titulo: "Evil", artista: "Interpol", imagen: mercyImg },
    { rank: 2, titulo: "Obstacle 1", artista: "Interpol", imagen: mercyImg },
    { rank: 3, titulo: "Rest My Chemistry", artista: "Interpol", imagen: mercyImg },
    { rank: 4, titulo: "Slow Hands", artista: "Interpol", imagen: mercyImg },
    { rank: 5, titulo: "The Rover", artista: "Interpol", imagen: mercyImg },
    { rank: 6, titulo: "Cmere", artista: "Interpol", imagen: mercyImg },
    { rank: 7, titulo: "Untitled", artista: "Interpol", imagen: mercyImg },
  ]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/getCommentsByPostId/${id}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los comentarios");
      }
      const data = await response.json();
      setComentarios(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [id]);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);

        const postResponse = await fetch(
          `http://localhost:3001/getPostById/${id}`
        );
        if (!postResponse.ok) {
          throw new Error("Error al obtener los datos de la publicación");
        }
        const postData = await postResponse.json();
        if (postData && postData[0] && postData[0][0]) {
          setPost(postData[0][0]);
        } else {
          setPost(null);
        }

        await fetchComments();
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: "No se pudo cargar la publicación o los comentarios.",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id, fetchComments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!userId) {
      Swal.fire({
        title: "Error",
        text: "Debe iniciar sesión para comentar.",
        icon: "error",
      });
      return;
    }

    if (!nuevoComentario.trim()) {
      newErrors.comentario = "El comentario no puede estar vacío.";
    } else if (nuevoComentario.length > 254) {
      newErrors.comentario = "El comentario no debe superar los 254 caracteres.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        title: "Error",
        text: "No es posible publicar el comentario, revise los datos",
        icon: "error",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/createComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: userId,
          id_publicacion: id,
          texto_comentario: nuevoComentario,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Éxito",
          text: data.msg,
          icon: "success",
        });
        setNuevoComentario("");
        fetchComments();
      } else {
        Swal.fire({
          title: "Error",
          text: data.msg || "Error al publicar el comentario.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al enviar el comentario:", error);
      Swal.fire({
        title: "Error",
        text: "Error de red o del servidor al publicar el comentario.",
        icon: "error",
      });
    }
  };

  const handleLikeToggle = async () => {
    if (!userId) {
      Swal.fire("Error", "Debe iniciar sesión para dar Me Gusta.", "error");
      return;
    }

    const endpoint = isLiked
      ? "http://localhost:3001/removeLike"
      : "http://localhost:3001/addLike";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: userId,
          id_publicacion: post.id,
        }),
      });

      if (response.ok) {
        setIsLiked((prev) => !prev);
      } else {
        const data = await response.json();
        Swal.fire(
          "Error",
          data.msg || "Error al cambiar el estado de Me Gusta.",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error", "Error de red al procesar el Me Gusta.", "error");
    }
  };

  // --- LÓGICA DE NAVEGACIÓN PARA FAVORITOS (ESTA ES LA QUE FUNCIONA) ---
  const handleFavoriteNavigation = () => {
    if (!userId) {
      Swal.fire("Error", "Debe iniciar sesión para guardar favoritos.", "error");
      return;
    }

    navigate("/favorite-embed", {
      state: {
        postId: id,      // Usamos la variable 'id' del useParams
        userId: userId,  // Usamos la variable 'userId' del localStorage
      }
    });
  };
  // --------------------------------------------------------------------

  return (
    <div className="page-container">
      <div className="navbar-container">
        <Navbar />
      </div>
      <main className="content-wrapper">
        <div className="color"></div>
        <div className="color"></div>
        <div className="color"></div>

        <div className="box column-left">
          <h3>Mas Populares</h3>
          {canciones.map((cancion) => (
            <Link to={`/Ranking`} key={cancion.rank}>
              <div className="list">{/* Contenido de la lista */}</div>
            </Link>
          ))}
        </div>

        <div className="column-right">
          {loading ? (
            <p>Cargando publicación...</p>
          ) : post ? (
            <EmbedDetails
              songTitle={post.titulo}
              authorName={post.nombre_autor}
              
              // 👇 CORREGIDO: Restaurado a id_autor (como devuelve tu SP)
              authorId={post.id_autor} 
              
              authorInfo={post.descripcion}
              likes={post.total_me_gusta}
              commentsCount={comentarios.length}
              embedCode={post.texto}
              
              // Props para Favoritos
              isFavorite={isFavorite} 
              onToggleFavorite={handleFavoriteNavigation} 

              isLiked={isLiked}
              onToggleLike={handleLikeToggle}
            />
          ) : (
            <p>La publicación no fue encontrada.</p>
          )}

          <div className="box2 box-comments">
            <h3>Comentarios</h3>
            <div className="comment-section">
              {comentarios.map((comentario) => (
                <Link
                  to={`/perfil/${comentario.id_usuario}`}
                  key={comentario.id}
                >
                  <div className="list comment-item">
                    <div className="imgBx comment-img">
                      <img
                        src={`https://ui-avatars.com/api/?name=${comentario.nombre_usuario}&background=random&color=fff`}
                        alt={`Foto de ${comentario.nombre_usuario}`}
                      />
                    </div>
                    <div className="content">
                      <h4 className="comment-author">
                        {comentario.nombre_usuario}
                      </h4>
                      <p>{comentario.comentario}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <h3>Agregar Comentario</h3>
              <textarea
                placeholder="Escribe tu comentario aquí..."
                value={nuevoComentario}
                onChange={(e) => {
                  setNuevoComentario(e.target.value);
                  if (errors.comentario)
                    setErrors({ ...errors, comentario: null });
                }}
              />
              {errors.comentario && (
                <p style={{ color: "red" }}>{errors.comentario}</p>
              )}
              <button type="submit">Publicar</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RankingPage;