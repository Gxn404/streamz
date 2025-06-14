"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, Sun, Moon, ChevronLeft, ChevronRight, Film, PictureInPicture } from 'lucide-react';
import Script from 'next/script';
import VideoSettings from './VideoSettings';

export default function VideoPlayer({ videoUrl, videoId, onError, onLoaded }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [playerReady, setPlayerReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [availableQualities, setAvailableQualities] = useState([]);
  const [quality, setQuality] = useState('auto');
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isPipMode, setIsPipMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hoverTime, setHoverTime] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [speedOptions, setSpeedOptions] = useState([0.5, 1, 1.5, 2]); // Playback speed options
  const [volumeIcon, setVolumeIcon] = useState(<Volume2 size={24} />); // To dynamically switch volume icon

  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const youtubeApiLoaded = useRef(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheaterMode = useCallback(() => {
    setIsTheaterMode(prevState => !prevState);
  }, []);

  const togglePipMode = useCallback(() => {
    if (!document.pictureInPictureElement) {
      const videoElement = document.querySelector('#youtube-player iframe');
      if (videoElement) {
        videoElement.requestPictureInPicture().then(() => {
          setIsPipMode(true);
        }).catch((err) => {
          console.error('Failed to enter PiP mode:', err);
        });
      }
    } else {
      document.exitPictureInPicture();
      setIsPipMode(false);
    }
  }, []);

  const initYouTubePlayer = useCallback(() => {
    if (playerRef.current && typeof playerRef.current.destroy === 'function') {
      playerRef.current.destroy();
    }

    try {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId,
        playerVars: {
          playsinline: 1,
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          origin: window.location.origin,
          enablejsapi: 1,
          cc_load_policy: 1,
          disablekb: 1,
          fs: 1,
          hl: 'en',
          cc_lang_pref: 'en',
          widget_referrer: window.location.href,
          loop: isLooping ? 1 : 0,
          playlist: isLooping ? videoId : undefined,
        },
        events: {
          onReady: (event) => {
            handlePlayerReady(event);
          },
          onStateChange: (event) => {
            const state = event.data;
            setIsPlaying(state === window.YT.PlayerState.PLAYING);
            if (state === window.YT.PlayerState.ENDED && isLooping) {
              event.target.playVideo();
            }
          },
          onError: (error) => {
            console.error('YouTube Player Error:', error);
            onError?.("Failed to load video");
          }
        }
      });
    } catch (error) {
      console.error('Error initializing YouTube player:', error);
      onError?.("Failed to initialize video player");
    }
  }, [videoId, onError, isLooping]);

  useEffect(() => {
    if (!youtubeApiLoaded.current && window.YT && window.YT.Player) {
      initYouTubePlayer();
      youtubeApiLoaded.current = true;
    }
  }, [initYouTubePlayer]);

  useEffect(() => {
    if (!isPlaying) return;

    const updateTime = () => {
      if (playerRef.current) {
        setCurrentTime(playerRef.current.getCurrentTime());
        setProgress((playerRef.current.getCurrentTime() / duration) * 100);
      }
    };

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const handlePlayPause = useCallback(() => {
    if (!playerRef.current || !playerReady) return;
    isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
  }, [isPlaying, playerReady]);

  const handleVolumeChange = (e) => {
    if (!playerRef.current || !playerReady) return;
    const newVolume = parseFloat(e.target.value);
    playerRef.current.setVolume(newVolume * 100);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    setVolumeIcon(newVolume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />);
  };

  const handleMuteToggle = useCallback(() => {
    if (!playerRef.current || !playerReady) return;
    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume * 100);
      setIsMuted(false);
      setVolumeIcon(<Volume2 size={24} />);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
      setVolumeIcon(<VolumeX size={24} />);
    }
  }, [isMuted, volume, playerReady]);

  const handleProgressChange = (e) => {
    if (!playerRef.current || !playerReady) return;
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    playerRef.current.seekTo(newTime, true);
    setProgress(parseFloat(e.target.value));
    setCurrentTime(newTime);
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleKeyDown = useCallback((event) => {
    switch (event.key) {
      case ' ':
        handlePlayPause();
        break;
      case 'ArrowLeft':
        playerRef.current?.seekTo(playerRef.current.getCurrentTime() - 5, true);
        break;
      case 'ArrowRight':
        playerRef.current?.seekTo(playerRef.current.getCurrentTime() + 5, true);
        break;
      case 'm':
        handleMuteToggle();
        break;
      case 'f':
        toggleFullscreen();
        break;
      case 't':
        toggleTheaterMode();
        break;
      case 'p':
        togglePipMode();
        break;
      default:
        break;
    }
  }, [handlePlayPause, handleMuteToggle, toggleFullscreen, toggleTheaterMode, togglePipMode]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const hoverPosition = (e.clientX - rect.left) / rect.width;
    const newHoverTime = hoverPosition * duration;
    setHoverTime(newHoverTime);
    setThumbnailUrl(getThumbnailUrl(newHoverTime));
  };

  const getThumbnailUrl = (time) => {
    return `https://img.youtube.com/vi/${videoId}/${Math.floor(time / 10)}.jpg`;
  };

  const handlePlayerReady = (event) => {
    setPlayerReady(true);
    setIsLoading(false);
    event.target.setVolume(volume * 100);
    event.target.setPlaybackRate(playbackSpeed);
    setDuration(event.target.getDuration());
    setAvailableQualities(event.target.getAvailableQualityLevels());
    onLoaded?.();
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full group ${theme} ${isTheaterMode ? 'theater-mode' : ''}`}
      onMouseMove={() => {
        setShowControls(true);
        clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => isPlaying && setShowControls(false), 3000);
      }}
    >
      <Script
        src="https://www.youtube.com/iframe_api"
        onLoad={() => youtubeApiLoaded.current = true}
      />
      <div 
        id="youtube-player" 
        className="w-full h-full cursor-pointer" 
        onClick={handlePlayPause} 
      />

      {isLoading && <div className="loading-spinner">Loading...</div>}

      {/* Video Controls */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-white text-sm">{formatTime(currentTime)}</span>
          <input
            type="range"
            value={progress}
            onChange={handleProgressChange}
            onMouseMove={handleMouseMove}
            className="flex-1 cursor-pointer"
          />
          <span className="text-white text-sm">{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <button className="text-white" onClick={handlePlayPause}>
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button className="text-white" onClick={handleMuteToggle}>
              {volumeIcon}
            </button>
            <input
              type="range"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24"
            />
            <button className="text-white" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </button>
          </div>
          <div className="flex gap-4 items-center">
            <button className="text-white" onClick={toggleTheaterMode}>
              <Film size={24} />
            </button>
            <button className="text-white" onClick={togglePipMode}>
              <PictureInPicture size={24} />
            </button>
            <button className="text-white" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            {/* Settings */}
          <VideoSettings
            quality={quality}
            availableQualities={availableQualities}
            setQuality={setQuality}
            setPlaybackSpeed={setPlaybackSpeed}
            playbackSpeed={playbackSpeed}
            isLooping={isLooping}
            setIsLooping={setIsLooping}
            speedOptions={speedOptions} // Added playback speed options
          />
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}
