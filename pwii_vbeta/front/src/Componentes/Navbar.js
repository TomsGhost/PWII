import React from 'react';
import { Link } from 'react-router-dom'; 
import '../Paginas/styleNavbar.css';

function Navbar() {
  return (
        <header style={{width: '100vw'}}>
      <Link to="/ranking" className="logo">Embed</Link>
      <ul>
        {/* Usamos Link en lugar de <a> para no recargar la página */}
        <li><Link to="/HomePage">Inicio</Link></li>
        <li><Link to="/Searchpage">Buscar</Link></li>
        <li><Link to="/perfil">Perfil</Link></li>
        <li><Link to="/create-embed">Subir</Link></li>
        <li><Link to="/">Cerrar sesión</Link></li>
      </ul>
    </header>
  );
}

export default Navbar;
