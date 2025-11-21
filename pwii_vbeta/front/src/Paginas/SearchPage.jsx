import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Componentes/Navbar";
import "./styleSearch.css";
import Swal from "sweetalert2";
import axios from "axios"; // 1. IMPORTANTE: Importar axios
import star2 from "../assets/Star 2(1).png";

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState(""); // Iniciamos vacío
  const [embeds, setEmbeds] = useState([]); // Iniciamos sin resultados
  const [hasSearched, setHasSearched] = useState(false); // Para saber si ya buscó
  const [loading, setLoading] = useState(false); // Estado de carga

  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();

    // --- TUS VALIDACIONES (Excelentes, las mantenemos) ---
    const busquedaRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s]+$/; // Agregué 0-9 por si buscan "Top 10"

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
        text: "La búsqueda contiene caracteres no válidos.",
        icon: "error",
      });
      return;
    }

    // --- LÓGICA DE BÚSQUEDA (CONEXIÓN AL BACKEND) ---
    try {
      setLoading(true); // Activamos loading
      setHasSearched(true); // Marcamos que ya se intentó buscar

      // Llamada al endpoint que creamos
      const response = await axios.get(
        `http://localhost:3001/search?q=${searchTerm}`
      );

      if (response.data) {
        setEmbeds(response.data); // Guardamos los datos reales de la BD
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al conectar con el servidor.",
        icon: "error",
      });
    } finally {
      setLoading(false); // Desactivamos loading sea éxito o error
    }
  };

  return (
    <div className="page-container">
      <div className="color"></div>
      <div className="color"></div>
      <div className="color"></div>
      <Navbar />
      <main className="content-wrapper search-content-wrapper">
        {/* BARRA DE BÚSQUEDA */}
        <form className="search-bar-container" onSubmit={handleSearch}>
          {/* Si tienes foto de usuario en localStorage puedes ponerla aquí, si no, dejamos la M */}
          <div className="search-bar-icon user-icon">M</div>

          <input
            type="text"
            className="search-input"
            placeholder="Busca canciones, artistas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            type="submit"
            className="search-bar-icon search-icon button-fresh"
            disabled={loading} // Deshabilita si está cargando
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

        {/* RESULTADOS */}
        <div className="box2 search-results-panel">
          {/* Título dinámico */}
          <h3>
            {hasSearched
              ? `Resultados para: "${searchTerm}"`
              : "Ingresa un término para buscar 🚀"}
          </h3>

          {loading ? (
            <p style={{ textAlign: "center", color: "#ccc", padding: "20px" }}>
              Buscando...
            </p>
          ) : (
            <div className="search-grid-wrapper">
              {embeds.length > 0 ? (
                <div className="search-grid">
                  {embeds.map((it) => (
                    <Link
                      key={it.id}
                      to={`/Ranking/${it.id}`} // Enlace al detalle real
                      className="pf-card-link"
                    >
                      <article className="pf-card">
                        <header className="pf-card-title">
                          {it.titulo}
                          {/* Agregué el autor aquí abajo pequeño */}
                          <span
                            style={{
                              display: "block",
                              fontSize: "0.8rem",
                              fontWeight: "normal",
                              color: "#ccc",
                              marginTop: "4px",
                            }}
                          >
                            {it.autor}
                          </span>
                        </header>
                        <div className="pf-metrics">
                          {/* Usamos las propiedades que vienen del SP de MySQL */}
                          <span>
                            <img src={star2} alt="Likes" /> {it.total_likes}
                          </span>
                          <span>💬 {it.total_comentarios}</span>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              ) : (
                // Mensaje si buscó pero no encontró nada
                hasSearched && (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#aaa",
                      marginTop: "20px",
                    }}
                  >
                    No se encontraron resultados. Intenta con otra palabra.
                  </p>
                )
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default SearchPage;
