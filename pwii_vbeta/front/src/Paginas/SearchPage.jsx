import React, { useState } from 'react';
import Navbar from '../Componentes/Navbar';
import './styleSearch.css'; 
import { Link } from 'react-router-dom';
import star1 from '../assets/Star 1.png';
import star2 from '../assets/Star 2(1).png';

const SearchResultCard = ({ title, author }) => (
  <div className="search-card">
    <h4>{title}</h4>
    <p>{author}</p>
    <div className="search-card-stats">
      <span>+ 20</span>
      <span>♥ 20</span>
    </div>
  </div>
);

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('Pókemon');
  const [recentSearches] = useState([
    { id: 1, title: 'Girls like girls', author: 'Mercy' },
    { id: 2, title: 'Girls like girls', author: 'Mercy' },
    { id: 3, title: 'Girls like girls', author: 'Mercy' },
    { id: 4, title: 'Girls like girls', author: 'Mercy' },
    { id: 5, title: 'Girls like girls', author: 'Mercy' },
    { id: 6, title: 'Girls like girls', author: 'Mercy' },
    { id: 7, title: 'Girls like girls', author: 'Mercy' },
    { id: 8, title: 'Girls like girls', author: 'Mercy' },
  ]);


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



  return (
    <div className="page-container">
      <div className="color"></div>
      <div className="color"></div>
      <div className="color"></div>
      <Navbar />
      <main className="content-wrapper search-content-wrapper">
        
        
        <div className="search-bar-container">
            <div className="search-bar-icon user-icon">M</div>
            <input 
                type="text" 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="search-bar-icon search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
        </div>

        
        <div className="box2 search-results-panel">
            <h3>Recientes</h3>
            <div className="search-grid-wrapper">
                <div className="search-grid">
                    {embeds.map((it) => (
                     
                      <Link 
                          //key={it.id} 
                          to={`/Ranking`}  //${it.id}
                          className="pf-card-link"
                        >
                        <article className="pf-card"> 
                          <header className="pf-card-title">{it.title}</header>
                          <div className="pf-metrics">
                            <span><img src={star2} alt="Estrella vacía" /> {it.likes}</span>
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

export default SearchPage;