import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import star2 from '../assets/Star 2(1).png';

const ProfileEmbedCard = ({ id, title, likes, comments, openDeleteModal, isOwner }) => {
    const navigate = useNavigate();

    return (
        <Link 
            to={`/Ranking/${id}`} 
            className="pf-card-link-profile"
        >
            <article key={id} className="pf-card pf-card-with-actions"> 
                
                <header className="pf-card-title">{title}</header>
                <div className="pf-metrics">
                    <span><img src={star2} alt="Estrella vacía" /> {likes}</span>
                    <span>💬 {comments}</span>
                </div>
                
                {isOwner && (
                    <footer className="pf-actions">
                        
                        <button 
                            type="button"
                            className="pf-act pf-edit" 
                            title="Editar embed"
                            onClick={(e) => {
                                e.preventDefault(); 
                                e.stopPropagation();
                                navigate(`/edit-embed/${id}`);
                            }} 
                        >
                            ✏️
                        </button>
                        
                        <button
                            type="button"
                            className="pf-act pf-del"
                            title="Eliminar embed"
                            onClick={(e) => {
                                e.preventDefault(); 
                                e.stopPropagation(); 
                                openDeleteModal(id);
                            }}
                            aria-haspopup="dialog"
                        >
                            🗑️
                        </button>
                    </footer>
                )}
            </article>
        </Link>
    );
};

export default ProfileEmbedCard;