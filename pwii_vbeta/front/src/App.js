
import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './Paginas/LoginForm';
import RegisterForm from './Paginas/RegisterForm';
import Inicio from './Paginas/Inicio';
import HomePage from './Paginas/HomePage';
import SearchPage from './Paginas/SearchPage';
import RankingPage from './Paginas/RankingPage';


function App() {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/SearchPage" element={<SearchPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
