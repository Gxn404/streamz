import { useState } from "react";
import Image from "next/image";
import ChannelThumbnail from "./ChannelThumbnail";

export default function VideoCard({ video, onClick, onFavorite }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const thumbnailUrl = `https://i.ytimg.com/vi/${video?.videoId}/maxresdefault.jpg`;

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
    onFavorite && onFavorite(video, !isFavorite);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    onClick?.(video);
  };

  return (
    <div
      className="relative bg-black text-white w-full max-w-[400px] group rounded-xl overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail Area */}
      <div className="relative w-full aspect-video bg-gray-900">
        <Image
          width={400}
          height={225}
          loading="lazy"
          src={thumbnailUrl ||video?.thumbnail?.[0]?.url}
          alt={video?.title}
          className="w-full h-full object-cover"
        />

        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-xl">
            {/* Play Button */}
            <button
              onClick={handlePlayClick}
              className="p-3 bg-black/50 rounded-full hover:bg-black/70 transition-all"
              aria-label="Play video"
            >
              <svg
                className="w-12 h-12 text-orange-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="p-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{video?.title}</h3>
          <ChannelThumbnail channelId={video?.channelId}/>
          <p className="text-sm text-gray-400">{video?.channelTitle}</p>
        </div>
        <button
          onClick={handleFavorite}
          className="ml-4 text-orange-500 hover:text-orange-400 transition-colors"
          aria-label="Toggle favorite"
        >
          {isFavorite ? (
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
           2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 
           C13.09 3.81 14.76 3 16.5 3 
           19.58 3 22 5.42 22 8.5 
           c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 19.071l1.415-1.414M3 8.5A5.5 5.5 0 018.5 3 
                   a5.5 5.5 0 014.5 2.09 
                   A5.5 5.5 0 0117.5 3 
                   A5.5 5.5 0 0123 8.5c0 3.28-2.96 6.32-8.44 10.88L12 21.35"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
