import React from 'react';
import { Link } from 'react-router-dom'; 


function Navbar() {
  return (
    <header>
      <Link to="/ranking" className="logo">Embed</Link>
      <ul>
        {/* Usamos Link en lugar de <a> para no recargar la página */}
        <li><Link to="/HomePage">Inicio</Link></li>
        <li><Link to="/Searchpage">Buscar</Link></li>
        <li><Link to="/lista">Lista</Link></li>
        <li><Link to="/perfil">Perfil</Link></li>
        <li><Link to="/subir">Subir</Link></li>
      </ul>
    </header>
  );
}

export default Navbar;
