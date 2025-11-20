import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../Componentes/Navbar';
import './styleInicio.css'; 
import astronautImg from '../assets/Astronaut.png';

const Inicio = () => {
  const squares = [0, 1, 2, 3, 4]; 
  const location = useLocation();
  const [datos, setDatos] = useState(location.state?.datos);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const id = localStorage.getItem("id");
      console.log(id);
      if (!datos && id) {
        try {
          const userDataPayload = { id };
          const response = await axios.post("http://localhost:3001/getUserData", userDataPayload);
          if (response.data?.msg?.[0]?.[0]) {
            setDatos(response.data.msg[0][0]);
          }
        } catch (error) {
          console.error("Error en la petición:", error);
          Swal.fire({ title: 'Error', text: 'Error al buscar los datos del usuario.', icon: 'error' });
        }
      } else if(id===null) {
        navigate(-1);
      }
    };
    fetchUserData();
  }, [datos]);

  return (
    <div className="page-container">
        <div className="color"></div>
        <div className="color"></div>
        <div className="color"></div>
        <Navbar />
        <main className="content-wrapper combined-layout">
            
            
            <div className="landing-content">
              <h2>Embed</h2>
              <p>
                Tu música, tu voto, tu ranking. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <Link to="/HomePage" className="landing-button">Rankear</Link>
            </div>

            
            <div className="landing-imgBx">
              <img src={astronautImg} alt="Astronauta" />
            </div>
            
            
            <div className="box-inicio">
                {squares.map((i) => (
                    <div key={i} className="square" style={{ "--i": i }}></div>
                ))}
                <div className="form-inicio">
                    <h2>¡Bienvenid@!</h2>
                    <h1>Página de Inicio</h1>
                    
                </div>
            </div>

        </main>
    </div>
  );
};
/*
                    {datos ? (
                        <div>
                            <h3>Tus datos:</h3>
                            {datos.fotografia && <img src={`data:image/png;base64,${datos.fotografia}`} className="card-img-top" alt="Foto de perfil" style={{width: "100px", height: "100px", borderRadius: "50%"}}/>}
                            <pre>{JSON.stringify(datos, null, 2)}</pre>
                        </div>
                    ) : (
                        <p>Cargando datos o no se encontraron datos de usuario.</p>
                    )}
                    */

export default Inicio;