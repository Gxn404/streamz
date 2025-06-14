import { useEffect, useState } from "react";
import Image from "next/image";

const ChannelThumbnail = ({ channelId }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!channelId) return;

    const fetchChannelThumbnail = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(
          `https://streamz-roan.vercel.app/api/channel?channelId=${channelId}`
        );

        if (!response.ok) throw new Error("Failed to fetch channel data");

        const data = await response.json();
        console.log("Response:", data); 
        const thumbnail = 
          data?.response?.meta?.thumbnail?.[2]?.url ||
          data?.response?.meta?.thumbnail?.[1]?.url ||
          data?.response?.meta?.thumbnail?.[0]?.url;

        if (thumbnail) {
          setThumbnailUrl(thumbnail);
        } else {
          throw new Error("Thumbnail not found");
        }
      } catch (err) {
        console.error("Error fetching channel thumbnail:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelThumbnail();
  }, [channelId]);

  if (loading) return <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>; // Placeholder spinner while loading

  return (
    <div className="flex items-center">
      {error ? (
        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
          <span className="text-gray-300 text-xs">N/A</span>
        </div>
      ) : (
        <Image
      src={thumbnailUrl}
      alt="Channel Thumbnail"
      width={40}
      height={40}
      loading="lazy"
      unoptimized={false}    // set to true to skip Next.js optimization
      className="rounded-full border-2 border-gray-800 shadow-md"
      />
      )}
    </div>
  );
};

export default ChannelThumbnail;
