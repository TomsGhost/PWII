import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import "./styleInicio.css"; 
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import Navbar from '../Componentes/Navbar';
import astronautImg from '../assets/Astronaut.png';

const Inicio = () => {
  const squares = [0, 1, 2, 3, 4]; 
  const location = useLocation();
  
  const [datos, setDatos] = useState(location.state?.datos);

  useEffect(() => {
    const fetchUserData = async () => {
      const id = localStorage.getItem("id");
      if (!datos && id) {
        try {
          const userDataPayload = { id };
          const response = await axios.post(
            "http://localhost:3001/getUserData",
            userDataPayload
          );
          if (response.data && response.data.msg && response.data.msg[0] && response.data.msg[0][0]) {
            setDatos(response.data.msg[0][0]);
          }
        } catch (error) {
          console.error("Error en la petición:", error);
          Swal.fire({
            title: 'Error',
            text: 'Error al buscar los datos del usuario.',
            icon: 'error'
          });
        }
      }
    };

    fetchUserData();
  }, [datos]);

  return (
    <section>
     <div className="page-container landing-page">
      <div className="color"></div>
      <div className="color"></div>
      <div className="color"></div>
      <Navbar />
      <main className="content-wrapper">
        <div className="landing-container">
          <div className="landing-content">
            <h2>Embed</h2>
            <p>
              Tu música, tu voto, tu ranking. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <Link to="/home" className="landing-button">Rankear</Link>
          </div>
          <div className="landing-imgBx">
            <img src={astronautImg} alt="Astronauta" />
          </div>
           <div className="box">
        {squares.map((i) => (
          <div key={i} className="square" style={{ "--i": i }}></div>
        ))}
        <div className="container">
          <div className="form">
            <h2>¡Bienvenid@!</h2>
            <div>
              <h1>Página de Inicio</h1>
              {datos ? (
                <div>
                  <h3>Tus datos:</h3>
                  <pre
                    style={{
                      textAlign: "left",
                      color: "white",
                      background: "rgba(0,0,0,0.2)",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    {JSON.stringify(datos, null, 2)}
                  </pre>
                </div>
              ) : (
                // Mensaje mientras se cargan los datos o si no se encuentran.
                <p>Cargando datos o no se encontraron datos de usuario.</p>
              )}
            </div>
          </div>
        </div>
      </div>
        </div>
      </main>
    </div>
     
    </section>
  );
};




export default Inicio;