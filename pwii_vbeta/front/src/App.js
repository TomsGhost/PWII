
import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './Paginas/LoginForm';
import RegisterForm from './Paginas/RegisterForm';
import Inicio from './Paginas/Inicio';


function App() {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/inicio" element={<Inicio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
