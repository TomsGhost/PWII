import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Nav, Footer } from '../Componentes/Navfooter';
import { useState } from 'react';

function Registro(){

    return(
        <div className="d-flex flex-column min-vh-100">
            <Nav />
        <div className="container mt-5 flex-grow-1">
          <h2 className="mb-8 text-center">Registrar usuario</h2>
          <form
            className="p-4 border rounded shadow-sm bg-light"
          >
            <div className="mb-3">
              <label className="form-label">Nombre completo</label>
              <input
                type="text"
                className="form-control"
                name="nombre"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Correo</label>
              <input
                type="email"
                className="form-control"
                name="correo"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                name="contraseña"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Imagen</label>
              <input
                type="file"
                className="form-control"
                name="imagen"
                accept="image/*"
                />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Registrar
            </button>
          </form>
        </div>
        <Footer />
      </div>

    );
}

export default Registro;