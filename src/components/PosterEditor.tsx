
import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RotateCw, ZoomIn, Move, Download, Share } from "lucide-react";
import { composePoster, downloadPoster, sharePoster } from "@/utils/imageUtils";
import ImageUploader from "./ImageUploader";

interface PosterEditorProps {
  template: {
    id: string;
    title: string;
    imageUrl: string;
  };
}

const PosterEditor = ({ template }: PosterEditorProps) => {
  const [userImage, setUserImage] = useState("");
  const [position, setPosition] = useState({ x: 300, y: 300, scale: 1, rotation: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isGenerating, setIsGenerating] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const templateImageRef = useRef<HTMLImageElement | null>(null);
  const userImageRef = useRef<HTMLImageElement | null>(null);
  
  // Initialize template image
  useEffect(() => {
    if (!template.imageUrl) return;
    
    const img = new Image();
    img.src = template.imageUrl;
    img.onload = () => {
      templateImageRef.current = img;
      renderCanvas();
    };
  }, [template.imageUrl]);
  
  // Handle user image change
  useEffect(() => {
    if (!userImage) {
      userImageRef.current = null;
      renderCanvas();
      return;
    }
    
    const img = new Image();
    img.src = userImage;
    img.onload = () => {
      userImageRef.current = img;
      renderCanvas();
    };
  }, [userImage]);
  
  // Render canvas whenever position changes
  useEffect(() => {
    renderCanvas();
  }, [position]);
  
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw template
    if (templateImageRef.current) {
      ctx.drawImage(templateImageRef.current, 0, 0, canvas.width, canvas.height);
    }
    
    // Draw user image if available
    if (userImageRef.current && userImage) {
      composePoster(canvas, templateImageRef.current!, userImageRef.current, position);
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!userImageRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if click is on the user image
    const distance = Math.sqrt(
      Math.pow(x - position.x, 2) + Math.pow(y - position.y, 2)
    );
    
    // If clicked on or near the image, start dragging
    if (distance < 100 * position.scale) {
      setIsDragging(true);
      setDragStart({ x: x - position.x, y: y - position.y });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPosition((prev) => ({
      ...prev,
      x: x - dragStart.x,
      y: y - dragStart.y,
    }));
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleScaleChange = (value: number[]) => {
    setPosition((prev) => ({ ...prev, scale: value[0] }));
  };
  
  const handleRotationChange = (value: number[]) => {
    setPosition((prev) => ({ ...prev, rotation: value[0] }));
  };
  
  const handleDownload = async () => {
    if (!canvasRef.current || !templateImageRef.current) {
      toast.error("Canvas not ready. Please try again.");
      return;
    }
    
    if (!userImageRef.current) {
      toast.error("Please upload an image first");
      return;
    }
    
    try {
      setIsGenerating(true);
      setTimeout(() => {
        downloadPoster(canvasRef.current!, template.title);
        toast.success("Poster downloaded successfully!");
        setIsGenerating(false);
      }, 500);
    } catch (error) {
      console.error("Error downloading poster:", error);
      toast.error("Failed to download poster");
      setIsGenerating(false);
    }
  };
  
  const handleShare = async () => {
    if (!canvasRef.current || !userImageRef.current) {
      toast.error("Please upload an image first");
      return;
    }
    
    try {
      setIsGenerating(true);
      await sharePoster(canvasRef.current, template.title);
      toast.success("Poster shared successfully!");
    } catch (error) {
      console.error("Error sharing poster:", error);
      toast.error("Failed to share poster. Try downloading instead.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="order-2 lg:order-1">
        <div className="mb-6">
          <h2 className="text-2xl font-medium mb-4">Upload Your Image</h2>
          <ImageUploader onImageUpload={setUserImage} currentImage={userImage} />
        </div>
        
        {userImage && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <div className="flex items-center mb-2">
                <ZoomIn className="h-5 w-5 mr-2 text-muted-foreground" />
                <h3 className="font-medium">Adjust Size</h3>
              </div>
              <Slider
                value={[position.scale]}
                min={0.5}
                max={2}
                step={0.01}
                onValueChange={handleScaleChange}
              />
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <RotateCw className="h-5 w-5 mr-2 text-muted-foreground" />
                <h3 className="font-medium">Rotate Image</h3>
              </div>
              <Slider
                value={[position.rotation]}
                min={0}
                max={360}
                step={1}
                onValueChange={handleRotationChange}
              />
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <Move className="h-5 w-5 mr-2 text-muted-foreground" />
                <h3 className="font-medium">Position Image</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Drag your image on the preview to position it on the poster
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                className="flex-1 gap-2" 
                size="lg" 
                onClick={handleDownload}
                disabled={!userImage || isGenerating}
              >
                <Download className="h-5 w-5" />
                Download Poster
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-1 gap-2" 
                size="lg"
                onClick={handleShare}
                disabled={!userImage || isGenerating}
              >
                <Share className="h-5 w-5" />
                Share
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="order-1 lg:order-2">
        <div className="sticky top-24">
          <h2 className="text-2xl font-medium mb-4">Preview</h2>
          <div className="relative rounded-xl overflow-hidden shadow-xl border border-border bg-secondary/30">
            <canvas
              ref={canvasRef}
              width={600}
              height={600}
              className="w-full h-auto touch-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            ></canvas>
            
            {!userImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                <div className="text-center p-6">
                  <p className="text-lg font-medium mb-2">Upload an image to get started</p>
                  <p className="text-muted-foreground text-sm">
                    Your image will appear here once uploaded
                  </p>
                </div>
              </div>
            )}
            
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm">
                <div className="animate-pulse text-lg font-medium">
                  Processing...
                </div>
              </div>
            )}
          </div>
          
          {userImage && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Tip: Click and drag to position your image on the poster
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PosterEditor;
