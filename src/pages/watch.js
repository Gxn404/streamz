"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import ChannelThumbnail from "@/components/ChannelThumbnail";
import { Button } from "@/components/Button";
import  NumberFormatter  from "@/components/NumberFormatter";
import Navbar from "@/components/Navbar/Navbar";
import { ThumbsUp, ThumbsDown, Share2, Flag, Play, ChevronDown } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";

export default function WatchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoId = searchParams.get("v");
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCount, setShowCount] = useState(5);

  const handlePlayerReady = useCallback(
        (player) => {
          // e.g. auto‑play if you want
          try {
            player.play();
          } catch {
            console.warn("Autoplay blocked, user interaction required");
          }
          // you could also hook up events:
          // player.on('ended', () => console.log('video ended'));
        },
        [] // no external deps (or add state/props you reference)
      );

  useEffect(() => {
    const fetchVideoData = async () => {
      if (!videoId) return;
      setLoading(true);
      try {
        const [videoResponse, relatedResponse] = await Promise.all([
          fetch(`https://streamz-roan.vercel.app/api/videoDetails?type=videoDetails&videoId=${videoId}`),
          fetch(`https://streamz-roan.vercel.app/api/relatedVideos?type=relatedVideos&videoId=${videoId}`)
        ]);

        const [videoData, relatedData] = await Promise.all([
          videoResponse.json(),
          relatedResponse.json()
        ]);

        if (!videoData.response) {
          throw new Error('Video data not found');
        }
        
        setVideo({
          ...videoData.response,
          videoUrl: videoData.response.videoUrl || `https://streamz-roan.vercel.app/api/videoDetails?type=videoDetails&videoId=${videoData.response.id}`
        });
        const relatedVideosData = relatedData.response?.data || relatedData.response || [];
        setRelatedVideos(Array.isArray(relatedVideosData) ? relatedVideosData : [relatedVideosData].filter(Boolean));
      } catch (err) {
        setError("Failed to fetch video data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId]);
  console.log(video);
  if (!videoId) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center p-8 rounded-xl bg-gray-900/50 backdrop-blur-sm border-2 border-red-500">
        <p className="text-xl font-semibold text-red-500">Invalid video ID</p>
        <p className="mt-2 text-gray-400">Please check the URL and try again</p>
      </div>
    </div>
  );
  
  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center p-8 rounded-xl bg-gray-900/50 backdrop-blur-sm border-2 border-orange-500">
        
        {/* Streaming Wave Spinner with Smooth Color Transition */}
        <div className="flex justify-center items-center relative">
          <div className="w-32 h-8 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-full relative overflow-hidden">
            {/* Inner flowing animation for wave */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 animate-wave"></div>
          </div>
        </div>
  
        {/* Loading text */}
        <p className="text-lg font-semibold text-white mt-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-red-500 to-yellow-400">
          Streaming your content... Please wait
        </p>
  
      </div>
    </div>
  );
  
  
  

  if (error) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center p-8 rounded-xl bg-gray-900/50 backdrop-blur-sm border-2 border-red-500">
        <p className="text-xl font-semibold text-red-500">{error}</p>
        <p className="mt-2 text-gray-400">Please try again later</p>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-6 md:px-6">
        <div className="grid 2xl:grid-cols-2 gap-6">
          <div className="2xl:col-span-1">
            <section className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-900 p-[2px] group hover:p-[3px] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-400 rounded-xl animate-gradient-xy"></div>
              <div className="relative w-full h-full bg-gray-900 rounded-xl overflow-hidden z-10">
                {video?.id ? (
                    <VideoPlayer
                      videoId={video.id}
                      onReady={handlePlayerReady}    // 3️⃣ pass it here
                    />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p>Video not available</p>
                  </div>
                )}
              </div>
            </section>

            <section className="mt-4">
              <h1 className="text-2xl pb-3 font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-red-500 to-yellow-400 border-b border-gray-700">
                {video?.title || "Untitled Video"}
              </h1>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
                <span><NumberFormatter value={parseInt(video?.viewCount) || 0} type="views" /></span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-wrap">
                  <span><ChannelThumbnail channelId={video?.channelId} /></span>
                  <span className="font-medium">{video?.channelTitle}</span>
                  <Button variant="outline" className="gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    Like
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <ThumbsDown className="h-4 w-4" />
                    Dislike
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Flag className="h-4 w-4" />
                    Report
                  </Button>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-gray-900/50 p-4">
                <p className="text-sm text-gray-300 whitespace-pre-wrap">
                  {video?.description || "No description available."}
                </p>
                {video?.keywords?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {video.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          <section className="lg:col-span-1 pl-5 lr-5 border-l border-gray-700">
            <h2 className="mb-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-red-500 to-yellow-400">Related Videos</h2>
            <div className="grid gap-4 mb-4">
              {relatedVideos.slice(0, showCount).map((relatedVideo) => (
                <div
                  key={relatedVideo.id}
                  className="relative cursor-pointer transition-all duration-300 hover:scale-105 rounded-lg overflow-hidden p-[2px] group hover:p-[3px] hover:shadow-lg hover:shadow-orange-500/20"
                  onClick={() => router.push(`/watch?v=${relatedVideo.id}`)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-400 rounded-lg animate-gradient-xy opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div 
                    className="relative w-full h-full bg-gray-900/90 rounded-lg overflow-hidden z-10 backdrop-blur-sm"
                  >
                    <div className="relative aspect-video">
                      {relatedVideo.thumbnail?.[0]?.url && (
                        <Image
                          src={relatedVideo.thumbnail[0].url}
                          alt={relatedVideo.title}
                          loading="lazy"
                          fill
                          className="object-cover transition-transform group-hover:scale-110 duration-300"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                          <Play className="w-6 h-6 text-black" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-orange-500 transition-colors">{relatedVideo.title}</h3>
                      <div className="mt-2 text-xs text-gray-400 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          {relatedVideo.viewCount && (
                            <span>{parseInt(relatedVideo.viewCount).toLocaleString()} views</span>
                          )}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                        <span>{relatedVideo.channelTitle}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {relatedVideos.length > showCount && (
              <button
                onClick={() => setShowCount(prev => prev + 5)}
                className="w-full py-3 px-4 rounded-lg bg-gray-900/50 text-sm font-medium text-white hover:bg-gray-900/70 transition-colors border border-orange-500/50 hover:border-orange-500 flex items-center justify-center gap-2"
              >
                Load More
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}