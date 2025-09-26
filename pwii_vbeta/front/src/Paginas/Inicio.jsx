import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styleLogin.css";
import axios from "axios";

const LoginForm = () => {
  const squares = [0, 1, 2, 3, 4];
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const frmData = new FormData();
    frmData.append("username", username);
    frmData.append("password", password);

    //validaciones frontend

    try {
      const respuesta = await axios.post(
        "http://localhost:3001/login",
        frmData,
        { headers: { "Content-Type": "application/json" } }
      );

      const mensaje = respuesta.data.msg[0][0].estado_sesion;

      if (mensaje === "LOGIN_EXITOSO") {
        alert("Bienvenido!");
      } else if (mensaje) {
        alert("No es posible iniciar sesión: " + mensaje);
      } else {
        alert(
          "Error al inicar sesión: La respuesta del servidor no es válida."
        );
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
            <h2>Inicio de sesión</h2>
            <form onSubmit={handleSubmit}>
              <div className="inputBox">
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="inputBox">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="inputBox">
                <input type="submit" value="Ingresar" />
              </div>
              <p className="forget">
                ¿No tienes cuenta?
                <Link to="/register"> Registrate</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
