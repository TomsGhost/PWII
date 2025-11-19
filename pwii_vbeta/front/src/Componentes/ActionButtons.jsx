import React from 'react';

import star1 from '../assets/Star 1.png'; 
import star2 from '../assets/Star 2(1).png';

const ActionButtons = ({ isFavorite, onToggleFavorite, isLiked, onToggleLike }) => {
    
    
    const favoriteIcon = isFavorite ? star1 : star2; //star1 para lleno, star2 para vacío
    const likeIcon = isLiked ? star1 : star2; 

    return (
        <div className="icons">
            <button 
                className={`like-btn ${isFavorite ? 'active-favorite' : ''}`} 
                onClick={onToggleFavorite}
            >
                <i><img src={star2} alt="Favorite icon" /></i> 
                Favorite
            </button>
            
            <button 
                className={`dislike-btn ${isLiked ? 'active-like' : ''}`}
                onClick={onToggleLike}
            >
                <i><img src={star1} alt="Like icon" /></i> 
                Like
            </button>
        </div>
    );
}

export default ActionButtons;