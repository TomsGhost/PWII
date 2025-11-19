import React from 'react';
import { Link } from 'react-router-dom';
import PfCard from './PfCard'; 
import star2 from '../assets/Star 2(1).png'

const ProfileEmbedCard = ({ id, title, likes, comments, openDeleteModal }) => {
    return (

        <Link 
            to={`/Ranking`} 
            className="pf-card-link-profile"
        >
            <article key={id} className="pf-card pf-card-with-actions"> 
                
                <header className="pf-card-title">{title}</header>
                <div className="pf-metrics">
                    <span><img src={star2} alt="Estrella vacía" /> {likes}</span>
                    <span>💬 {comments}</span>
                </div>
                
                <footer className="pf-actions">
                    {/* Botón de Editar */}
                    <Link 
                        to={`/edit-embed/${id}`} 
                        className="pf-act pf-edit" 
                        title="Editar embed"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        ✏️
                    </Link>
                    
                    {/* Botón de Eliminar */}
                    <button
                        type="button"
                        className="pf-act pf-del"
                        title="Eliminar embed"
                        onClick={(e) => {
                            e.stopPropagation(); 
                            openDeleteModal(id);
                        }}
                        aria-haspopup="dialog"
                    >
                        🗑️
                    </button>
                </footer>
            </article>
        </Link>
    );
};

export default ProfileEmbedCard;