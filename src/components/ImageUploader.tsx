
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { processImageFile } from "@/utils/imageUtils";

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
}

const ImageUploader = ({ onImageUpload, currentImage }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast.error("Please upload an image file");
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 5MB");
      return;
    }
    
    try {
      const imageUrl = await processImageFile(file);
      setPreviewUrl(imageUrl);
      onImageUpload(imageUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
    }
  };

  const clearImage = () => {
    setPreviewUrl(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageUpload("");
  };

  return (
    <div className="w-full">
      <input
        type="file"
        className="hidden"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      {previewUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-border animate-fade-in">
          <img 
            src={previewUrl} 
            alt="Uploaded image" 
            className="w-full h-64 object-contain bg-secondary/50 p-2"
          />
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow-sm transition-colors"
            aria-label="Remove image"
          >
            <X className="h-5 w-5 text-destructive" />
          </button>
          <div className="py-3 px-4 bg-white border-t border-border">
            <p className="text-sm text-muted-foreground">
              Image uploaded successfully. You can adjust its position on the poster.
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors p-6 ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-muted-foreground/50 bg-secondary/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-secondary p-3">
              {isDragging ? (
                <ImageIcon className="h-8 w-8 text-primary animate-pulse" />
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <h3 className="text-lg font-medium mb-1">
              {isDragging ? "Drop your image here" : "Upload your image"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              Drag and drop your image here, or click to browse
            </p>
            <Button size="sm" type="button" variant="secondary">
              Select Image
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Supports: JPG, PNG, GIF (Max size: 5MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
