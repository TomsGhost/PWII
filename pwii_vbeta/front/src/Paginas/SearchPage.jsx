import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Componentes/Navbar";
import "./styleSearch.css";
import Swal from "sweetalert2";

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
  const [searchTerm, setSearchTerm] = useState("Girls");
  const navigate = useNavigate();
  const [recentSearches] = useState([
    { id: 1, title: "Girls like girls", author: "Mercy" },
    { id: 2, title: "Girls like girls", author: "Mercy" },
    { id: 3, title: "Girls like girls", author: "Mercy" },
    { id: 4, title: "Girls like girls", author: "Mercy" },
    { id: 5, title: "Girls like girls", author: "Mercy" },
    { id: 6, title: "Girls like girls", author: "Mercy" },
    { id: 7, title: "Girls like girls", author: "Mercy" },
    { id: 8, title: "Girls like girls", author: "Mercy" },
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    const busquedaRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

    if (!searchTerm.trim()) {
      Swal.fire({
        title: "Error",
        text: "El campo de búsqueda no puede estar vacío.",
        icon: "error",
      });
      return;
    }

    if (searchTerm.length > 149) {
        Swal.fire({
            title: "Error",
            text: "La búsqueda no debe superar los 149 caracteres.",
            icon: "error",
          });
      return;
    }
    
    if (!busquedaRegex.test(searchTerm)) {
        Swal.fire({
            title: "Error",
            text: "La búsqueda solo puede contener letras y espacios.",
            icon: "error",
          });
      return;
    }

    console.log("Searching for:", searchTerm);
    navigate('/Searchpage');
  };

  return (
    <div className="page-container">
      <div className="color"></div>
      <div className="color"></div>
      <div className="color"></div>
      <Navbar />
      <main className="content-wrapper search-content-wrapper">
        <form
          className="search-bar-container"
          onSubmit={handleSearch}
        >
          <div className="search-bar-icon user-icon">M</div>
          <input
            type="text"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="search-bar-icon search-icon button-fresh"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>

        <div className="box2 search-results-panel">
          <h3>Recientes</h3>
          <div className="search-grid-wrapper">
            <div className="search-grid">
              {recentSearches.map((item) => (
                <SearchResultCard
                  key={item.id}
                  title={item.title}
                  author={item.author}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SearchPage;