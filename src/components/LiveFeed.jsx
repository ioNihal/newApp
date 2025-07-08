
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import useDpadNavigation from '../hooks/useDpadNavigation';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const CHANNELS = [
    { id: 'UCf8w5m0YsRa8MHQ5bwSGmbw', name: 'Asianet News' },
    { id: 'UC-f7r46JhYv78q5pGrO6ivA', name: 'MediaOne News' },
    { id: 'UCP0uG-mcMImgKnJz-VjJZmQ', name: 'Manorama News' },
    { id: 'UCwXrBBZnIh2ER4lal6WbAHw', name: 'Mathrubhoomi News' },
    { id: 'UCup3etEdjyF1L3sRbU-rKLw', name: '24 News' },
];

export default function LiveFeed({ onSelect }) {
    const [entries, setEntries] = useState(
        CHANNELS.map(ch => ({
            channelId: ch.id,
            channelName: ch.name,
            video: undefined,
            error: false,
            loading: true
        }))
    );

    const focusIndex = useDpadNavigation(entries.length);
    const containerRef = useRef(null);

    useEffect(() => {
        (async () => {
            const updated = await Promise.all(entries.map(async entry => {
                try {
                    const res = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                        params: {
                            part: 'snippet',
                            channelId: entry.channelId,
                            eventType: 'live',
                            type: 'video',
                            key: API_KEY,
                        }
                    });
                    const item = res.data.items[0] || null;
                    return { ...entry, video: item, error: false, loading: false };
                } catch {
                    return { ...entry, video: null, error: true, loading: false };
                }
            }));
            setEntries(updated);
        })();
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const items = container.querySelectorAll('.live-item');
        const focused = items[focusIndex];
        if (!focused) return;

        focused.focus({ preventScroll: true });

        const itemRect = focused.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        if (itemRect.left < containerRect.left) {
            container.scrollBy({ left: itemRect.left - containerRect.left - 32, behavior: 'smooth' });
        } else if (itemRect.right > containerRect.right) {
            const scrollAmount = itemRect.right - containerRect.right + 32;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }, [focusIndex]);

    return (
        <div className="live-feed-container" ref={containerRef}>
            <div className="feed-header">
                <h2>Live News Channels</h2>
                <p>Select a channel to start watching</p>
            </div>

            <div className="cards-container">
                {entries.map((e, idx) => {
                    const isFocused = idx === focusIndex;
                    const baseClass = 'live-item';
                    const cls = e.video ? baseClass : `${baseClass} fallback-item`;

                    return (
                        <div
                            key={e.channelId}
                            className={cls}
                            tabIndex={-1}
                            style={{
                                transform: isFocused ? 'scale(1.05)' : 'scale(1)',
                                zIndex: isFocused ? 10 : 1
                            }}
                            ref={el => isFocused && el?.focus()}
                            onClick={() => e.video && onSelect(e.video.id.videoId)}
                        >
                            {e.loading ? (
                                <div className="loading-container">
                                    <div className="loading-spinner"></div>
                                    <p>Loading broadcast</p>
                                </div>
                            ) : e.error ? (
                                <div className="placeholder error">
                                    <span className="material-icons">Limit Reached</span>
                                    <p>Stream unavailable</p>
                                </div>
                            ) : e.video ? (
                                <>
                                    <div className="thumbnail-container">
                                        <img
                                            src={e.video.snippet.thumbnails.high.url}
                                            alt={e.video.snippet.title}
                                        />
                                        <div className="live-badge">
                                            <span className="live-pulse"></span>
                                            LIVE
                                        </div>
                                        <div className="channel-tag">{e.channelName}</div>
                                    </div>

                                    <div className="card-content">
                                        <h3 className="video-title">{e.video.snippet.title}</h3>
                                        <div className="meta-info">
                                            <span className="channel-name">{e.video.snippet.channelTitle}</span>
                                            <span className="viewers">● 24.5K watching</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="placeholder offline">
                                    <span className="material-icons">schedule</span>
                                    <p>Currently offline</p>
                                    <div className="channel-name">{e.channelName}</div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}