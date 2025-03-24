
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface PosterPreviewProps {
  templateUrl: string;
  className?: string;
}

const PosterPreview = ({ templateUrl, className }: PosterPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoading(false);
    }
  }, []);
  
  return (
    <div className={cn("relative rounded-xl overflow-hidden", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-secondary animate-pulse" />
      )}
      
      <img
        ref={imgRef}
        src={templateUrl}
        alt="Poster template"
        className="w-full h-full object-cover"
        crossOrigin="anonymous"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default PosterPreview;
