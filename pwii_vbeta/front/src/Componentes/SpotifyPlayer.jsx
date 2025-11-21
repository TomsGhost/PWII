import React from 'react';

const SpotifyPlayer = ({ embedUrl, height = "200" }) => {
    const url = embedUrl || "https://open.spotify.com/embed/track/341PThF0i9Aw4c0p2FZY2K?utm_source=generator";

    return (
        <iframe
            data-testid="embed-iframe"
            style={{ borderRadius: '12px' }}
            src={url}
            width="100%"
            height={height}
            frameBorder="0"
            allowFullScreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy">
        </iframe>
    );
}

export default SpotifyPlayer;