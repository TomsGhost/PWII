
import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './Paginas/LoginForm';
import RegisterForm from './Paginas/RegisterForm';
import Inicio from './Paginas/Inicio';
import HomePage from './Paginas/HomePage';
import SearchPage from './Paginas/SearchPage';
import RankingPage from './Paginas/RankingPage';
import Perfil from './Paginas/Perfil';    
import EditProfile from './Paginas/profileEdit';
import DeleteProfile from "./Paginas/DeleteProfile";
import EditEmbed from "./Paginas/EditEmbed";
import CreateEmbed from './Paginas/CreateEmbed';
import FavoriteEmbed from './Paginas/FavoriteEmbed';

function App() {
  return (
    
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/inicio" element={<Inicio />} /> 
        <Route path="/HomePage" element={<HomePage />} /> 
        <Route path="/SearchPage" element={<SearchPage />} /> //ya está validado
        <Route path="/ranking" element={<RankingPage />} /> 
        
        <Route path="/perfil" element={<Perfil />} />  
        <Route path="/profileEdit" element={<EditProfile />} /> //ya está validado
        <Route path="/deleteProfile" element={<DeleteProfile />} />
        <Route path="/edit-embed" element={<EditEmbed />} /> 
        <Route path="/create-embed" element={<CreateEmbed />} /> 
        <Route path="/favorite-embed" element={<FavoriteEmbed />} />

      </Routes>
    </BrowserRouter>
  );
}


export default App;
