import React from 'react';
import { Link } from 'react-router-dom'; 
import '../Paginas/styleNavbar.css';

function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("id");
  };

  return (
        <header style={{width: '100vw'}}>
      <Link to="/ranking" className="logo">Embed</Link>
      <ul>
        <li><Link to="/HomePage">Inicio</Link></li>
        <li><Link to="/Searchpage">Buscar</Link></li>
        <li><Link to={`/perfil/${localStorage.getItem("id")}`}>Perfil</Link></li>
        <li><Link to="/create-embed">Subir</Link></li>
        <li><Link to="/" onClick={handleLogout}>Cerrar sesión</Link></li>
      </ul>
    </header>
  );
}

export default Navbar;
