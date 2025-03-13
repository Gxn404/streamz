import Image from 'next/image';
import { cn } from '@/lib/utils';

export function VideoCard({ title, description, videoUrl, alt, className, ...props }) {
  return (
    <div className={cn("rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300", className)} {...props}>
      {videoUrl && (
        <Image
          src={videoUrl}
          alt={alt || title || "Video Preview"}
          width={500}
          height={300}
          className="rounded-t-lg"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400 mt-2">{description}</p>
      </div>
    </div>
  );
}