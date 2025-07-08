
import { useEffect } from 'react';


export default function VideoPlayer({ videoId, onBack }) {
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Backspace' || e.key === 'Escape' || e.key === 'Back') {
                onBack();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onBack]);

    return (
        <div className="player-container">
            <button
                className="back-button"
                onClick={onBack}
                aria-label="Back to channel list"
            >
                <span className="material-icons">arrow_back</span>
                All Channels
            </button>

            <iframe
                title="Live News Stream"
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&iv_load_policy=3`}
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
            />
        </div>
    );
}