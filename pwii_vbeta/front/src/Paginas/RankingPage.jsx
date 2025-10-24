import React, { useState, useEffect } from 'react';
import Navbar from '../Componentes/Navbar';
import './styleRanking.css';
import mercyImg from '../assets/Mercy2.png';
import star1 from '../assets/Star 1.png';
import star2 from '../assets/Star 2(1).png';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";

function RankingPage() {

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

  const [comentarios, setComentarios] = useState([
    { id: 1, autor: 'Jordi', texto: '¡Me encanta esta canción!', profilePic: 'https://placehold.co/50x50/E58D00/1E1B3A?text=J' },
    { id: 2, autor: 'Alex', texto: 'Un clásico de Interpol.', profilePic: 'https://placehold.co/50x50/E58D00/1E1B3A?text=A' },
  ]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [errors, setErrors] = useState({});

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

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
    
    const newCommentObject = {
      id: Date.now(),
      autor: 'Usuario',
      texto: nuevoComentario,
      profilePic: 'https://placehold.co/50x50/E58D00/1E1B3A?text=U',
    };
    setComentarios([...comentarios, newCommentObject]);
    setNuevoComentario('');
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
            <Link to={`/Ranking`}>
                <div className="list" key={cancion.rank}>
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
          <div className="box2">
            <h3>Titulo de Canción</h3>
            <div className="list">
              <iframe
                data-testid="embed-iframe"
                style={{ borderRadius: '12px' }}
                src="https://open.spotify.com/embed/track/341PThF0i9Aw4c0p2FZY2K?utm_source=generator"
                width="100%"
                height="200"
                frameBorder="0"
                allowFullScreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy">
              </iframe>
            </div>
            <Link to={`/perfil` }><h3>Autor</h3></Link>
            <h4>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</h4>
            <div className="icons">

              <Link to={`/favorite-embed`}><div class="like-btn"><i><img src={star2} alt="Estrella vacía" /></i> Favorite</div></Link>
              <button class="dislike-btn"><i><img src={star1} alt="Estrella llena" /></i> Like</button>
            
            </div>
          </div>

          <div className="box2 box-comments">
            <h3>Comentarios</h3>
            <div className="comment-section">
              {comentarios.map((comentario) => (
                <Link  to={`/perfil`}>
                  <div className="list comment-item" key={comentario.id}>
                    <div className="imgBx comment-img">
                      <img src={comentario.profilePic} alt={`Foto de ${comentario.autor}`} />
                    </div>
                    <div className="content">
                      <h4 className="comment-author">{comentario.autor}</h4>
                      <p>{comentario.texto}</p>
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