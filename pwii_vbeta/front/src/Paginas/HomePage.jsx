import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Componentes/Navbar';
import './styleHome.css';
import star1 from '../assets/Star 1.png';
import star2 from '../assets/Star 2(1).png';


// Recientes
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



 const [embeds, setEmbeds] = useState(
     Array.from({ length: 12 }).map((_, i) => ({
       id: i + 1,
       title: "Pokémon",
       likes: 20,
       comments: 20,
     }))
   );
 
   // Modal de eliminación
   const [toDeleteId, setToDeleteId] = useState(null);
 
   const openDeleteModal = (id) => setToDeleteId(id);
   const closeDeleteModal = () => setToDeleteId(null);
   const confirmDelete = () => {
     // TODO: aquí llamas a tu API (DELETE /embeds/:id)
     setEmbeds((prev) => prev.filter((e) => e.id !== toDeleteId));
     closeDeleteModal();
   };
 


  
  // Datos de ejemplo
  const recientes = Array(10).fill({ title: 'Pokémon', author: 'Jordi' });
  const siguiendo = [
    { name: 'Jordi', pic: 'https://placehold.co/40x40/E58D00/1E1B3A?text=J' },
    { name: 'Maye', pic: 'https://placehold.co/40x40/00B0FF/1E1B3A?text=M' },
    { name: 'Wiskas', pic: 'https://placehold.co/40x40/2C264C/FFFFFF?text=W' }
  ];
  const top = [
      { title: 'Top', artist: 'prettynightmare', album: 'phunk rocker' },
      { title: 'Stylus', artist: 'stylus', album: '' }
  ]

  return (
    <div className="page-container">
      <div className="color"></div>
      <div className="color"></div>
      <div className="color"></div>
      <Navbar />
      <main className="content-wrapper home-content-wrapper">
        
        <div className="home-left-column">
          <div className="box2 top-list">
            {top.map((item, index) => (
              <Link to={`/Ranking/`}> 
                <div className="top-item" key={index}>
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
          <div className="box2 siguiendo-list">
            <h3>Siguiendo</h3>
            {siguiendo.map((user, index) => (
              <Link to={`/perfil/`}>
                <div key={index} className="siguiendo-item">
                  <img src={user.pic} alt={`Foto de ${user.name}`} className="siguiendo-pic" />
                  <p>{user.name}</p>
                </div>
              </Link>
              
            ))}
          </div>
        </div>

        <div className="home-right-column">
          <h1 className="home-title">Más de lo que ves...</h1>
          <div className="box2 recientes-container">
            <h3>Recientes</h3>
            <div className="recientes-grid">
                 {embeds.map((it) => (
                     
                      <Link 
                          //key={it.id} 
                          to={`/Ranking/`}  //${it.id}
                          className="pf-card-link"
                        >
                        <article className="pf-card"> 
                          <header className="pf-card-title">{it.title}</header>
                          <div className="pf-metrics">
                            <span><img src={star2} alt="Estrella vacía" />  {it.likes}</span>
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
