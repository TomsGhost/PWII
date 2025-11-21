import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from '../Componentes/Navbar';
import "./profileEdit.css"; 
import Swal from "sweetalert2";

export default function EditProfile() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null); 
    
    const location = useLocation();
    const { username: initialUsername, avatar: initialAvatar } = location.state || {};

    const [username, setUsername] = useState(initialUsername || "");
    const [avatar, setAvatar] = useState(initialAvatar || null);
    
    const [errors, setErrors] = useState({}); 

    const handlePickFile = () => fileInputRef.current?.click();

    const handleFile = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const url = URL.createObjectURL(f);
        setAvatar(url);
    };

    const handleSave = (e) => {
        e.preventDefault();
        let newErrors = {};

        const usernameRegex = /^[a-zA-Z0-9\p{P}\p{M}áéíóúÁÉÍÓÚñÑüÜ]+$/u;

        if (!username.trim()) {
            newErrors.username = "El nombre de usuario es obligatorio.";
        } else if (username.length > 49) {
            newErrors.username = "No debe superar los 49 caracteres.";
        } else if (username.includes(" ")) {
            newErrors.username =
                "El nombre de usuario no puede contener espacios (máx. 1 palabra).";
        } else if (!usernameRegex.test(username)) {
            newErrors.username = "El nombre de usuario contiene caracteres no válidos.";
        }

        setErrors(newErrors); 
        if (Object.keys(newErrors).length > 0) {
            Swal.fire({
                title: "Error",
                text: "No es posible registrar los cambios, revise los datos",
                icon: "error",
            });
            return;
        }

        console.log("Guardar perfil:", { username });
        navigate(-1); 
    };

    return (
        <div className="page-container">
            <div className="color"></div>
            <div className="color"></div>
            <div className="color"></div>
            <Navbar />

            <section className="pe-section">
                
                <main className="pe-container">
                    <form className="pe-card" onSubmit={handleSave}>
                        <div className="pe-avatar-wrap">
                            <img
                                className="pe-avatar"
                                src={`https://ui-avatars.com/api/?name=${username}&background=random&color=fff`}
                                alt={`Avatar de ${username}`}
                            />

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
                                name="username"
                                value={username}
                                aria-label="Nombre de usuario"
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    if (errors.username) setErrors({ ...errors, username: null }); 
                                }}
                            />
                            {errors.username && <p className="error-text">{errors.username}</p>}
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