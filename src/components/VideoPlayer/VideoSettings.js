import { useState } from 'react';
import { Settings, Sun, Moon } from 'lucide-react';

export default function VideoSettings({ playerRef, theme, setTheme, toggleTheme, isLooping, setIsLooping, availableQualities, quality, setQuality }) {
  const [showSettings, setShowSettings] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const handleQualityChange = (e) => {
    setQuality(e.target.value);
    playerRef.current?.setPlaybackQuality(e.target.value);
  };

  const handleCaptionsToggle = () => {
    setShowCaptions(!showCaptions);
    if (showCaptions) {
      playerRef.current?.unloadModule('captions');
    } else {
      playerRef.current?.loadModule('captions');
    }
  };

  const handleLoopToggle = () => {
    setIsLooping(!isLooping);
    playerRef.current?.setLoop(isLooping);
  };

  const handlePlaybackSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    setPlaybackSpeed(newSpeed);
    playerRef.current?.setPlaybackRate(newSpeed);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="text-white hover:text-orange-500 transition-colors"
      >
        <Settings className="w-6 h-6" />
      </button>
      {showSettings && (
        <div className="absolute bottom-full right-0 mb-2 w-48 bg-black/90 rounded-lg p-2 backdrop-blur-sm">
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-gray-300">Loop</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  checked={isLooping}
                  onChange={handleLoopToggle}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                  style={{
                    transform: isLooping ? 'translateX(100%)' : 'translateX(0)',
                    borderColor: isLooping ? '#f97316' : '#4b5563'
                  }}
                />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer"></label>
              </div>
            </div>
          </div>
          <div className="mb-2">
            <label className="text-sm text-gray-300 block mb-1">Quality</label>
            <select
              value={quality}
              onChange={handleQualityChange}
              className="w-full bg-gray-800 text-white text-sm rounded p-1"
            >
              {availableQualities.map((q) => {
                let label = '';
                switch(q) {
                  case 'highres': label = '4320p (8K)'; break;
                  case 'hd2880': label = '2880p (5K)'; break;
                  case 'hd2160': label = '2160p (4K)'; break;
                  case 'hd1440': label = '1440p'; break;
                  case 'hd1080': label = '1080p'; break;
                  case 'hd720': label = '720p'; break;
                  case 'large': label = '480p'; break;
                  case 'medium': label = '360p'; break;
                  case 'small': label = '240p'; break;
                  case 'tiny': label = '144p'; break;
                  case 'auto': label = 'Auto'; break;
                  default: label = q.toUpperCase();
                }
                return <option key={q} value={q}>{label}</option>;
              })}
            </select>
          </div>
          <div className="mb-2">
            <label className="text-sm text-gray-300 block mb-1">Playback Speed</label>
            <select
              value={playbackSpeed}
              onChange={handlePlaybackSpeedChange}
              className="w-full bg-gray-800 text-white text-sm rounded p-1"
            >
              {[0.25, 0.5, 1, 1.5, 2].map((speed) => (
                <option key={speed} value={speed}>{speed}x</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-gray-300">Captions</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  checked={showCaptions}
                  onChange={handleCaptionsToggle}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                  style={{
                    transform: showCaptions ? 'translateX(100%)' : 'translateX(0)',
                    borderColor: showCaptions ? '#f97316' : '#4b5563'
                  }}
                />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer"></label>
              </div>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={toggleTheme}
        className="text-white hover:text-orange-500 transition-colors"
      >
        {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>
    </div>
  );
}
