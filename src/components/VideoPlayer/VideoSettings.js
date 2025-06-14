import { useState } from 'react';
import { Settings, Sun, Moon, RotateCcw, RotateCw, Bookmark, Download, Scissors, ListChecks, Subtitles } from 'lucide-react';

export default function VideoSettings({
  playerRef,
  theme,
  toggleTheme,
  isLooping,
  setIsLooping,
  availableQualities,
  quality,
  setQuality,
  playbackSpeed,
  setPlaybackSpeed,
}) {
  // Local UI state
  const [showSettings, setShowSettings] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [captionSize, setCaptionSize] = useState(16);

  const handleQualityChange = (e) => {
    const q = e.target.value;
    setQuality(q);
    if (playerRef.current) {
      playerRef.current?.setPlaybackQuality(q);
    }
  };

  const handleCaptionsToggle = () => {
    setShowCaptions((prev) => !prev);
    if (playerRef.current) {
      if (showCaptions) {
        playerRef.current?.unloadModule('captions');
      } else {
        playerRef.current?.loadModule('captions');
      }
    }
  };

  const handleCaptionSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    setCaptionSize(size);
    if (playerRef.current) {
      playerRef.current?.setOption('captions', 'fontSize', size);
    }
  };

  const handleLoopToggle = () => {
    setIsLooping((prev) => !prev);
    if (playerRef.current) {
      playerRef.current?.setLoop(!isLooping);
    }
  };

  const handlePlaybackSpeedChange = (e) => {
    const speed = parseFloat(e.target.value);
    setPlaybackSpeed(speed);
    if (playerRef.current) {
      playerRef.current?.setPlaybackRate(speed);
    }
  };

  const downloadVideo = () => {
    if (playerRef.current) {
      const url = playerRef.current?.getVideoUrl() || '';
      const a = document.createElement('a');
      a.href = url;
      a.download = `${playerRef.current?.getVideoData()?.title || 'video'}`;
      a.click();
    }
  };

  const takeScreenshot = () => {
    alert('Screenshot feature coming soon');
  };

  const bookmarkTime = () => {
    if (playerRef.current) {
      const t = playerRef.current?.getCurrentTime();
      localStorage.setItem('bookmark', t);
      alert(`Bookmarked at ${Math.floor(t)}s`);
    }
  };

  return (
    <div className="relative flex items-center space-x-2">
      <button
        onClick={() => setShowSettings((prev) => !prev)}
        className="text-white hover:text-orange-500"
      >
        <Settings className="w-6 h-6" />
      </button>

      {showSettings && (
        <div className="absolute bottom-full right-0 mb-2 w-56 bg-black/90 rounded-lg p-3 backdrop-blur-sm space-y-3 border border-neutral-700">
          {/* Loop */}
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-300">Loop</label>
            <button
              onClick={handleLoopToggle}
              className={`p-1 rounded ${isLooping ? 'bg-orange-500' : 'bg-gray-700'}`}
            >
              {isLooping ? (
                <RotateCw className="w-5 h-5 text-white" />
              ) : (
                <RotateCcw className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          {/* Quality */}
          <div>
            <label className="text-sm text-gray-300">Quality</label>
            <select
              value={quality}
              onChange={handleQualityChange}
              className="w-full bg-gray-800 text-white text-sm rounded p-1 mt-1"
            >
              {availableQualities.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          {/* Playback Speed */}
          <div>
            <label className="text-sm text-gray-300">Speed</label>
            <select
              value={playbackSpeed}
              onChange={handlePlaybackSpeedChange}
              className="w-full bg-gray-800 text-white text-sm rounded p-1 mt-1"
            >
              {[0.25, 0.5, 1, 1.25, 1.5, 2].map((s) => (
                <option key={s} value={s}>
                  {s}x
                </option>
              ))}
            </select>
          </div>

          {/* Captions */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-gray-300">Captions</label>
              <button
                onClick={handleCaptionsToggle}
                className="p-1 rounded bg-gray-700"
              >
                <Subtitles className="w-5 h-5 text-white" />
              </button>
            </div>
            {showCaptions && (
              <div>
                <label className="text-sm text-gray-300">Caption Size</label>
                <input
                  type="range"
                  min="12"
                  max="36"
                  value={captionSize}
                  onChange={handleCaptionSizeChange}
                  className="w-full mt-1"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <button onClick={downloadVideo} className="text-white hover:text-orange-500">
              <Download className="w-5 h-5" />
            </button>
            <button onClick={takeScreenshot} className="text-white hover:text-orange-500">
              <Scissors className="w-5 h-5" />
            </button>
            <button onClick={bookmarkTime} className="text-white hover:text-orange-500">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>

          {/* Playlist */}
          <div>
            <label className="text-sm text-gray-300">Playlist</label>
            <button className="w-full text-left text-white text-sm p-1 bg-gray-800 rounded mt-1 flex items-center space-x-2">
              <ListChecks className="w-5 h-5" />
              <span>View Playlist</span>
            </button>
          </div>

          {/* Theme Toggle */}
          <div className="flex justify-end">
            <button
              onClick={toggleTheme}
              className="text-white hover:text-orange-500"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
