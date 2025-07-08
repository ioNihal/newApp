
import  { useState } from 'react';
import LiveFeed from './components/LiveFeed';
import VideoPlayer from './components/VideoPlayer';

export default function App() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleBack = () => setSelectedVideo(null);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <div className="live-indicator"></div>
            <h1>Live News Network</h1>
          </div>
          <p className="header-subtitle">24/7 coverage from trusted Malayalam News Channels</p>
        </div>
      </header>

      <main className="main-content">
        {selectedVideo
          ? <VideoPlayer videoId={selectedVideo} onBack={handleBack} />
          : <LiveFeed onSelect={setSelectedVideo} />
        }
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} <span><a style={{
          textDecoration: 'none',
          color: 'inherit',
          cursor: 'pointer'
        }} href='https://www.github.com/ioNihal'>ioNihal</a></span> • All streams sourced from YouTube</p>
      </footer>
    </div>
  );
}