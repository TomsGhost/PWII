import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styleRegister.css";
import axios from "axios";

const RegisterForm = () => {
  const squares = [0, 1, 2, 3, 4];
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [errors, setErrors] = useState({}); 

  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};

    const fullnameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/; 
    const emailRegex = /^[a-zA-Z0-9_]{2,}@([a-zA-Z0-9-]+\.)+(com|es)$/;
    const usernameRegex = /^[a-zA-Z0-9\p{P}\p{M}áéíóúÁÉÍÓÚñÑüÜ]+$/u;
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[^\s]{8,16}$/;

    if (!fullname.trim()) {
      newErrors.fullname = "El nombre completo es obligatorio.";
    } else if (fullname.length > 99) {
      newErrors.fullname = "No debe superar los 99 caracteres.";
    } else if (!fullnameRegex.test(fullname)) {
      newErrors.fullname = "Solo se permiten letras, espacios y acentos.";
    } else if (fullname.trim().split(/\s+/).length < 2) {
      newErrors.fullname = "Debe contener al menos 2 palabras (nombre y apellido).";
    }

    if (!email.trim()) {
      newErrors.email = "El email es obligatorio.";
    } else if (email.length > 99) {
      newErrors.email = "No debe superar los 99 caracteres.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Formato de email inválido. Asegúrate de usar letras, números y '_' antes del '@', un proveedor y terminar en '.com' o '.es'.";
    }

    if (!username.trim()) {
      newErrors.username = "El nombre de usuario es obligatorio.";
    } else if (username.length > 49) {
      newErrors.username = "No debe superar los 49 caracteres.";
    } else if (username.includes(" ")) {
      newErrors.username = "El nombre de usuario no puede contener espacios (máx. 1 palabra).";
    } else if (!usernameRegex.test(username)) {
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (password.length < 8 || password.length > 16) {
      newErrors.password = "Debe contener obligatoriamente entre 8 y 16 caracteres.";
    } else if (password.includes(" ")) {
      newErrors.password = "La contraseña no puede contener espacios (máx. 1 palabra).";
    } else if (!passwordRegex.test(password)) {
      newErrors.password = "Debe tener al menos 1 mayúscula, 1 minúscula, 1 signo, 1 número y sin emojis.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "La confirmación de la contraseña es obligatoria.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Errores de validación de texto en el frontend. No se envía la petición.");
      return; 
    }
    
    const MAX_FILE_SIZE_KB = 64;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_KB * 1024;
    
    if (archivo && archivo.size > MAX_FILE_SIZE_BYTES) {
        setErrors({...errors, archivo: `El archivo no debe superar los ${MAX_FILE_SIZE_KB}KB. Tamaño actual: ${(archivo.size / 1024).toFixed(2)} KB`});
        return;
    } else {
        setErrors({...errors, archivo: null});
    }

    const frmData = new FormData();
    frmData.append("name", fullname);
    frmData.append("aka", username);
    frmData.append("mail", email);
    frmData.append("pass", password); 
    
    if (archivo) {
      frmData.append("file", archivo);
    }
    
    try {
      const respuesta = await axios.post(
        "http://localhost:3001/register",
        frmData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const mensaje = respuesta.data.msg[0][0].mensaje_estado;

      if (mensaje === "REGISTRO EXITOSO") {
        alert("Usuario registrado");
        navigate('/'); 
      } else if (mensaje) {
        alert("No es posible registrar al usuario: " + mensaje);
      } else {
        alert("Error al registrar usuario: La respuesta del servidor no es válida.");
      }
      console.log(respuesta.data);
    } catch (error) {
      console.log(error);
      alert("Error en la peticion");
    }
  };

  return (
    <section>
      <div className="color"></div>
      <div className="color"></div>
      <div className="color"></div>
      <div className="box">
        {squares.map((i) => (
          <div key={i} className="square" style={{ "--i": i }}></div>
        ))}

        <div className="container">
          <div className="form">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
              
              {/* Campo Nombre Completo */}
              <div className="inputBox">
                <input
                  type="text"
                  name="fullname"
                  placeholder="Nombre Completo"
                  value={fullname}
                  onChange={(e) => {
                    setFullname(e.target.value);
                    // Opcional: Limpiar el error cuando el usuario comienza a escribir
                    if (errors.fullname) setErrors({...errors, fullname: null});
                  }}
                />
                {/* Mostrar error */}
                {errors.fullname && <p className="error-text">{errors.fullname}</p>}
              </div>

              {/* Campo Email */}
              <div className="inputBox">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({...errors, email: null});
                  }}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>

              {/* Campo Username */}
              <div className="inputBox">
                <input
                  type="text"
                  name="username"
                  placeholder="Nombre de Usuario"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors({...errors, username: null});
                  }}
                />
                {errors.username && <p className="error-text">{errors.username}</p>}
              </div>

              {/* Campo Password */}
              <div className="inputBox">
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({...errors, password: null});
                  }}
                />
                {errors.password && <p className="error-text">{errors.password}</p>}
              </div>

              {/* Campo Confirm Password */}
              <div className="inputBox">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar Contraseña"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({...errors, confirmPassword: null});
                  }}
                />
                {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
              </div>

              {/* Campo Archivo (Imagen) */}
              <div className="inputBox">
                <input
                  type="file"
                  className="form-control"
                  name="imagen"
                  accept="image/*"
                  onChange={(e) => {
                      setArchivo(e.target.files[0]);
                      if (errors.archivo) setErrors({...errors, archivo: null}); 
                  }}
                />
                {errors.archivo && <p className="error-text">{errors.archivo}</p>}
              </div>

              <div className="inputBox">
                <input type="submit" value="Registrarse" />
              </div>
              <p className="forget">
                ¿Ya tienes una cuenta?<Link to="/"> Inicia sesión</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;