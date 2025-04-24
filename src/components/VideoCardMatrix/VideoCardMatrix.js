import React from "react";
import VideoCard from "@/components/VideoCard";

const VideoCardMatrix = ({ videos = [], onVideoClick, onFavorite }) => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
        {videos.map((video, index) => (
          <VideoCard
            key={index}
            video={{ ...video, index: index + 1 }}
            onClick={onVideoClick}
            onFavorite={onFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoCardMatrix;
