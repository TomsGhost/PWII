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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const frmData = new FormData();
    frmData.append("name", fullname);
    frmData.append("aka", username);
    frmData.append("mail", email);
    frmData.append("pass", password);
    frmData.append("file", archivo);

    //validaciones frontend
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
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
              <div className="inputBox">
                <input
                  type="text"
                  name="fullname"
                  placeholder="Nombre"
                  required
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
              <div className="inputBox">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="inputBox">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="inputBox">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="inputBox">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="inputBox">
                <input
                  type="file"
                  className="form-control"
                  name="imagen"
                  accept="image/*"
                  onChange={(e) => setArchivo(e.target.files[0])}
                />
              </div>
              <div className="inputBox">
                <input type="submit" value="Registrarse" />
              </div>
              <p className="forget">
                Already have an account? <Link to="/"> Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
