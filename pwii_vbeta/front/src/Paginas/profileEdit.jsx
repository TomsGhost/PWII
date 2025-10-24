import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from '../Componentes/Navbar';
import "./profileEdit.css"; 

export default function EditProfile() {
  const [username, setUsername] = useState("");
  const [avatar,    setAvatar]    = useState(null);
  const fileInputRef = useRef(null);

  const handlePickFile = () => fileInputRef.current?.click();

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setAvatar(url);
  };

  const handleSave = (e) => {
    e.preventDefault();
 
    console.log("Guardar perfil:", { username });
  };

  return (
           
          <div className="page-container">
      <div className="color"></div>
      <div className="color"></div>
      <div className="color"></div>
        <Navbar />

        
    <section className="pe-section">
      {/* blobs de color del fondo */}
      <div className="pe-color" />
      <div className="pe-color" />
      <div className="pe-color" />

      {/* cuadrados flotantes */}
      <div className="pe-box">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="pe-square" style={{ "--i": i }} />
        ))}
      </div>

      {/* tarjeta central */}
      <main className="pe-container">
        <form className="pe-card" onSubmit={handleSave}>
          <div className="pe-avatar-wrap">
            <img
              className="pe-avatar"
              src={
                avatar ??
                "https://dummyimage.com/240x240/222/ffffff.jpg&text=Avatar"
              }
              alt="Avatar de usuario"
            />
            <button type="button" className="pe-btn pe-btn-secondary" onClick={handlePickFile}>
              Cambiar
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              hidden
            />
          </div>

          <h1 className="pe-title">Editando perfil :D</h1>

          <div className="pe-inputBox">
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-label="Nombre de usuario"
            />
          </div>

          <div className="pe-actions">
            <button className="pe-btn pe-btn-primary" type="submit">
              Guardar
            </button>
          </div>
        </form>
      </main>
    </section>
    </div>
  );
}
