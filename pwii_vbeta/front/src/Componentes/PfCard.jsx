import React from 'react';
import { Link } from 'react-router-dom';
import star2 from '../assets/Star 2(1).png'; 


const PfCard = ({ id, title, likes, comments }) => (
    <Link 
        key={id} 
        to={`/Ranking`} 
        className="pf-card-link"
    >
        <article className="pf-card"> 
            <header className="pf-card-title">{title}</header>
            <div className="pf-metrics">
                <span><img src={star2} alt="Estrella" /> {likes}</span>
                <span>💬 {comments}</span>
            </div>
        </article>
    </Link>
);

export default PfCard;