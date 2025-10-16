import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Componentes/Navbar';
import './styleHome.css';

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
              <div className="top-item" key={index}>
                <div className="top-item-icon">M</div>
                <div className="top-item-info">
                  <h4>{item.title}</h4>
                  <p>{item.artist}</p>
                  <span>{item.album}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="box2 siguiendo-list">
            <h3>Siguiendo</h3>
            {siguiendo.map((user, index) => (
              <div key={index} className="siguiendo-item">
                <img src={user.pic} alt={`Foto de ${user.name}`} className="siguiendo-pic" />
                <p>{user.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="home-right-column">
          <h1 className="home-title">Más de lo que ves...</h1>
          <div className="box2 recientes-container">
            <h3>Recientes</h3>
            <div className="recientes-grid-wrapper">
              <div className="recientes-grid">
                {recientes.map((item, index) => (
                  <RecienteCard key={index} title={item.title} author={item.author} />
                ))}
              </div>
            </div>
          </div>
        </div>
        
      </main>
    </div>
  );
}

export default HomePage;
