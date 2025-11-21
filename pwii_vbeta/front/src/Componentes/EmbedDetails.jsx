import React from 'react';
import { Link } from 'react-router-dom';
import ActionButtons from './ActionButtons';
import SpotifyPlayer from './SpotifyPlayer';

const EmbedDetails = ({ 
    songTitle, 
    authorName, 
    authorId, 
    authorInfo, 
    embedCode, 
    isFavorite, 
    onToggleFavorite, 
    isLiked, 
    onToggleLike 
}) => {
    
    const embedUrl = "https://open.spotify.com/embed/track/341PThF0i9Aw4c0p2FZY2K?utm_source=generator";

    return (
        <div className="box2 embed-details-container">
            <h3>{songTitle || "Titulo de Canción"}</h3>
            <div className="list embed-player-wrapper">
               <SpotifyPlayer embedUrl={embedCode || embedUrl} height="200" />
            </div>
            
            <h3>
                {authorId ? (
                    <Link to={`/perfil/${authorId}`}>{authorName || "Autor"}</Link>
                ) : (
                    authorName || "Autor"
                )}
            </h3>
            <h4>{authorInfo || "Lorem ipsum, dolor sit amet consectetur adipisicing elit."}</h4>
            
            <ActionButtons
                isFavorite={isFavorite}
                onToggleFavorite={onToggleFavorite}
                isLiked={isLiked}
                onToggleLike={onToggleLike}
            />

        </div>
    );
}

export default EmbedDetails;