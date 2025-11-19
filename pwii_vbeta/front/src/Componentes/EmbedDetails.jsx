import React from 'react';
import ActionButtons from './ActionButtons';
import SpotifyPlayer from './SpotifyPlayer';

const EmbedDetails = ({ songTitle, authorInfo, isFavorite, onToggleFavorite, isLiked, onToggleLike }) => {
    
    
    const embedUrl = "https://open.spotify.com/embed/track/341PThF0i9Aw4c0p2FZY2K?utm_source=generator";

    return (
        <div className="box2 embed-details-container">
            <h3>{songTitle || "Titulo de Canción"}</h3>
            <div className="list embed-player-wrapper">
               <SpotifyPlayer embedUrl={embedUrl} height="200" />
            </div>
            
            <h3>Autor</h3>
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