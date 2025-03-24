
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface PosterPreviewProps {
  templateUrl: string;
  className?: string;
  crossOrigin?: "anonymous" | "use-credentials" | "";
}

const PosterPreview = ({ templateUrl, className, crossOrigin = "anonymous" }: PosterPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    setIsLoading(true);
    
    if (imgRef.current) {
      if (imgRef.current.complete) {
        handleImageLoad();
      }
    }
  }, [templateUrl]);
  
  const handleImageLoad = () => {
    if (imgRef.current) {
      // Store the natural aspect ratio of the image
      setAspectRatio(imgRef.current.naturalWidth / imgRef.current.naturalHeight);
      setIsLoading(false);
    }
  };
  
  return (
    <div 
      className={cn("relative rounded-xl overflow-hidden", className)}
      style={{ aspectRatio: aspectRatio }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-secondary animate-pulse" />
      )}
      
      <img
        ref={imgRef}
        src={templateUrl}
        alt="Poster template"
        className="w-full h-full object-cover"
        crossOrigin={crossOrigin}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default PosterPreview;
