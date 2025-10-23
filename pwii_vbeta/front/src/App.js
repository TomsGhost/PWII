
import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './Paginas/LoginForm';
import RegisterForm from './Paginas/RegisterForm';
import Inicio from './Paginas/Inicio';
import Perfil from './Paginas/Perfil';    




function App() {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/perfil" element={<Perfil />} />  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
