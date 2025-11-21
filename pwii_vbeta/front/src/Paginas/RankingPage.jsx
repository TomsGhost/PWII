import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Componentes/Navbar';
import EmbedDetails from '../Componentes/EmbedDetails';
import './styleRanking.css';
import mercyImg from '../assets/Mercy2.png';
import star1 from '../assets/Star 1.png';
import star2 from '../assets/Star 2(1).png';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";

function RankingPage() {
  const { id } = useParams(); // Obtener el ID de la URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  //Mocks de Prueba
  const [canciones] = useState([
    { rank: 1, titulo: 'Evil', artista: 'Interpol', imagen: mercyImg },
    { rank: 2, titulo: 'Obstacle 1', artista: 'Interpol', imagen: mercyImg },
    { rank: 3, titulo: 'Rest My Chemistry', artista: 'Interpol', imagen: mercyImg },
    { rank: 4, titulo: 'Slow Hands', artista: 'Interpol', imagen: mercyImg },
    { rank: 5, titulo: 'The Rover', artista: 'Interpol', imagen: mercyImg },
    { rank: 6, titulo: 'Cmere', artista: 'Interpol', imagen: mercyImg },
    { rank: 7, titulo: 'Untitled', artista: 'Interpol', imagen: mercyImg },
  ]);

  const [comentarios, setComentarios] = useState([]); // Initialize as empty array
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [errors, setErrors] = useState({});

  const [isFavorite, setIsFavorite] = useState(false); 
  const [isLiked, setIsLiked] = useState(false);

  // Function to fetch comments
  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/getCommentsByPostId/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener los comentarios');
      }
      const data = await response.json();
      setComentarios(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los comentarios.",
        icon: "error",
      });
    }
  }, [id]);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);
        const postResponse = await fetch(`http://localhost:3001/getPostById/${id}`);
        if (!postResponse.ok) {
          throw new Error('Error al obtener los datos de la publicación');
        }
        const postData = await postResponse.json();
        if (postData && postData[0] && postData[0][0]) {
          setPost(postData[0][0]);
        } else {
          setPost(null);
        }
        
        await fetchComments(); // Fetch comments after post is loaded
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

    const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage

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

    console.log("Datos del comentario a enviar:", {
      id_usuario: userId,
      id_publicacion: id,
      texto_comentario: nuevoComentario,
    });
    
    try {
      const response = await fetch("http://localhost:3001/createComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_usuario: userId,
          id_publicacion: id,
          texto_comentario: nuevoComentario,
        }),
      });

      console.log("Respuesta del servidor (status):", response.status);
      const data = await response.json();
      console.log("Respuesta del servidor (data):", data);

      if (response.ok) {
        Swal.fire({
          title: "Éxito",
          text: data.msg,
          icon: "success",
        });
        setNuevoComentario('');
        fetchComments(); // Refresh comments after successful submission
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
                <div className="list">
                  <div className="imgBx">
                  <img src={cancion.imagen} alt={`Portada de ${cancion.titulo}`} />
                </div>
                <div className="content">
                  <h2 className="rank"><small>#</small>{cancion.rank}</h2>
                  <h4>{cancion.titulo}</h4>
                  <p>{cancion.artista}</p>
                </div>
              </div>
            </Link>
            
          ))}
        </div>

        <div className="column-right">
          {loading ? (
            <p>Cargando publicación...</p>
          ) : post ? (
            <EmbedDetails 
              songTitle={post.titulo} 
              authorName={post.nombre_usuario}
              authorId={post.id_usuario}
              authorInfo={post.descripcion}
              likes={post.total_me_gusta}
              commentsCount={comentarios.length}
              embedCode={post.texto}
              isFavorite={isFavorite}
              onToggleFavorite={() => setIsFavorite(prev => !prev)}
              isLiked={isLiked}
              onToggleLike={() => setIsLiked(prev => !prev)}
            />
          ) : (
            <p>La publicación no fue encontrada.</p>
          )}

          <div className="box2 box-comments">
            <h3>Comentarios</h3>
            <div className="comment-section">
              {comentarios.map((comentario) => (
                <Link  to={`/perfil/${comentario.id_usuario}`} key={comentario.id}> // Link to user profile
                  <div className="list comment-item">
                    <div className="imgBx comment-img">
                      {/* Placeholder for profile pic, as it's not returned by SP_ObtenerComentariosPorPublicacion */}
                      <img src={`https://ui-avatars.com/api/?name=${comentario.nombre_usuario}&background=random&color=fff`} alt={`Foto de ${comentario.nombre_usuario}`} />
                    </div>
                    <div className="content">
                      <h4 className="comment-author">{comentario.nombre_usuario}</h4>
                      <p>{comentario.comentario}</p>
                      <small>{new Date(comentario.fecha_creacion).toLocaleString()}</small>
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
                  setNuevoComentario(e.target.value)
                  if(errors.comentario) setErrors({...errors, comentario: null})
                }}
              />
              {errors.comentario && <p style={{ color: 'red' }}>{errors.comentario}</p>}
              <button type="submit">Publicar</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RankingPage;