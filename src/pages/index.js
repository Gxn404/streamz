"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Updated to use next/navigation
import { ChevronRight, ChevronLeft, Play } from "lucide-react";
import { Button } from "@/components/Button";
import Navbar from "@/components/Navbar/Navbar";
import VideoCardMatrix from "@/components/VideoCardMatrix/VideoCardMatrix";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCategory, setCurrentCategory] = useState("now");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoSlideEnabled, setAutoSlideEnabled] = useState(true);
  const router = useRouter();

  // Normalize URLs to HTTPS
  const normalizeUrl = (url) => {
    if (!url) return "https://via.placeholder.com/1200x510?text=No+Image";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("//")) return `https:${url}`;
    return `https://${url}`;
  };

  // Auto-slide effect (fixed to use movies instead of videos)
  useEffect(() => {
    if (!autoSlideEnabled || movies.length === 0) return;

    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === movies.slice(0, 5).length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(slideTimer);
  }, [autoSlideEnabled, movies]);

  const handlePrevSlide = () => {
    setAutoSlideEnabled(false);
    setCurrentSlide((prev) =>
      prev === 0 ? movies.slice(0, 5).length - 1 : prev - 1
    );
    setTimeout(() => setAutoSlideEnabled(true), 10000);
  };

  const handleNextSlide = () => {
    setAutoSlideEnabled(false);
    setCurrentSlide((prev) =>
      prev === movies.slice(0, 5).length - 1 ? 0 : prev + 1
    );
    setTimeout(() => setAutoSlideEnabled(true), 10000);
  };

  const loadVideos = async (category = "now") => {
    setLoading(true);
    setError(null);
    setCurrentSlide(0);

    try {
      const trendingUrl = "https://streamz-roan.vercel.app/api/trending?type=now";
      const searchUrl = `https://streamz-roan.vercel.app/api/search?type=videos&query=${encodeURIComponent(
        category.toLowerCase()
      )}`;
      const moviesUrl = "https://streamz-roan.vercel.app/api/trending?type=movies";

      const [trendingResponse, moviesResponse] = await Promise.all([
        fetch(trendingUrl),
        fetch(moviesUrl),
      ]);

      const trendingData = await trendingResponse.json();
      const moviesData = await moviesResponse.json();
      console.log("Movies Data:", moviesData);
      let videoData = Array.isArray(trendingData.response?.data)
        ? trendingData.response.data
        : [];
      if (videoData.length === 0 && category !== "All") {
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();
        videoData = Array.isArray(searchData.response?.data)
          ? searchData.response.data
          : [];
      }

      setVideos(videoData);
      const fetchedMovies = Array.isArray(moviesData.response?.data)
        ? moviesData.response.data
        : [];
      setMovies(fetchedMovies);
      setAutoSlideEnabled(true);

      // Log movie thumbnails
      fetchedMovies.slice(0, 5).forEach((movie, index) => {
        const thumbnailUrl = normalizeUrl(
          movie.richThumbnail?.[0]?.url ||
            movie.thumbnail?.[2]?.url ||
            movie.thumbnail?.[1]?.url ||
            movie.thumbnail?.[0]?.url
        );
        console.log(`Movie ${index + 1} Thumbnail URL:`, thumbnailUrl);
      });
    } catch (err) {
      setError("Failed to fetch content");
      console.error("Error:", err);
      setVideos([]);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video) => {
    router.push(`/watch?v=${video.videoId}`);
  };

  useEffect(() => {
    loadVideos(currentCategory);
  }, [currentCategory]);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <Navbar />

      {/* Categories Filter */}
      <section className="mb-6 mt-6">
        <div className="flex flex-wrap gap-3">
          {["All", "Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Documentary"].map(
            (category) => (
              <Button
                key={category}
                variant={currentCategory === category ? "default" : "outline"}
                onClick={() => setCurrentCategory(category)}
                className="transition-all"
              >
                {category}
              </Button>
            )
          )}
        </div>
      </section>

      <main className="container mx-auto px-4 py-6 md:px-6">
        {/* Hero Section - Movies */}
        <section className="relative mb-12 overflow-hidden rounded-xl">
          <div className="relative w-full">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {movies.slice(0, 5).map((movie, index) => {
                console.log("Movie:", movie.richThumbnail);
                const thumbnailUrl = normalizeUrl(
                  `https://i.ytimg.com/vi/${movie.videoId}/maxresdefault.jpg`||
                    movie.thumbnail?.[2]?.url ||
                    movie.thumbnail?.[1]?.url 
                );

                return (
                  <div
                    key={movie.id || index}
                    className="relative min-w-full aspect-[2.35/1] overflow-hidden rounded-xl bg-cover bg-center"
                  >
                    <Image
                      src={thumbnailUrl}
                      alt={movie.title || "Featured Movie"}
                      fill={true}
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      className="transition-all duration-500"
                      placeholder="blur"
                      blurDataURL="data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/OhPPQAIoQMkIXe9kgAAAABJRU5ErkJggg=="
                      priority={index === 0}
                      onError={(e) => {
                        console.error(`Failed to load thumbnail for Movie ${index + 1}:`, thumbnailUrl);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                    <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full z-20">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-primary/80 text-xs px-2 py-1 rounded">
                          MOVIE
                        </span>
                        {movie.genre && (
                          <span className="text-sm text-gray-300">{movie.genre}</span>
                        )}
                        {movie.duration && (
                          <span className="text-sm text-gray-300">{movie.duration}</span>
                        )}
                      </div>
                      <h1 className="mb-2 text-4xl font-bold md:text-6xl hover:text-primary transition-colors max-w-2xl">
                        {movie.title || "Featured Movie"}
                      </h1>
                      <p className="mb-6 max-w-xl text-sm text-gray-300 md:text-base line-clamp-2">
                        {movie.description ||
                          "Watch this exciting movie now streaming on our platform."}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <Button
                          className="gap-2 hover:scale-105 transition-transform bg-primary hover:bg-primary/90"
                          onClick={() => handleVideoClick(movie)}
                        >
                          <Play className="h-5 w-5" /> Watch Now
                        </Button>
                        <Button
                          variant="outline"
                          className="gap-2 hover:bg-white/10 transition-colors border-2"
                        >
                          + Add to Watchlist
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/80 transition-colors z-30"
              onClick={handlePrevSlide}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/80 transition-colors z-30"
              onClick={handleNextSlide}
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Vertical Navigation */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30">
              {movies.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  className={`h-16 w-1 rounded-full transition-all ${
                    currentSlide === index
                      ? "bg-primary scale-y-125"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Bottom Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
              {movies.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    currentSlide === index
                      ? "bg-primary scale-125"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Trending Videos Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Trending Videos</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <VideoCardMatrix videos={videos} onVideoClick={handleVideoClick} />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-border bg-background px-4 py-8 md:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 text-xl font-bold text-foreground">
              <span className="text-primary">Stream</span>Z
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="/help" className="hover:text-foreground">
                Help Center
              </Link>
              <Link href="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} StreamZ. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}