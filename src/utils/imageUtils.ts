
/**
 * Processes an uploaded image file and returns a data URL
 */
export const processImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Composes a poster with the user image and template
 */
export const composePoster = (
  canvas: HTMLCanvasElement,
  templateImage: HTMLImageElement,
  userImage: HTMLImageElement,
  position: { x: number; y: number; scale: number; rotation: number }
): void => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  
  // Reset canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw template background
  ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
  
  // Save current state
  ctx.save();
  
  // Move to the position where we want to draw the user image
  ctx.translate(position.x, position.y);
  ctx.rotate((position.rotation * Math.PI) / 180);
  ctx.scale(position.scale, position.scale);
  
  // Calculate dimensions to maintain aspect ratio
  const aspectRatio = userImage.width / userImage.height;
  let drawWidth, drawHeight;
  
  if (aspectRatio > 1) {
    // Landscape image
    drawWidth = 200;
    drawHeight = drawWidth / aspectRatio;
  } else {
    // Portrait or square image
    drawHeight = 200;
    drawWidth = drawHeight * aspectRatio;
  }
  
  // Draw user image centered at the translation point
  ctx.drawImage(userImage, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
  
  // Restore context to its original state
  ctx.restore();
};

/**
 * Downloads the poster canvas as an image
 */
export const downloadPoster = (canvas: HTMLCanvasElement, filename: string = "poster"): void => {
  const link = document.createElement("a");
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Shares the poster - creates a blob and returns the sharing object
 */
export const sharePoster = async (canvas: HTMLCanvasElement, title: string): Promise<void> => {
  try {
    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, "image/png");
    });
    
    // Check if Web Share API is available
    if (navigator.share) {
      await navigator.share({
        title: title,
        files: [new File([blob], 'poster.png', { type: 'image/png' })],
      });
    } else {
      throw new Error("Web Share API not available");
    }
  } catch (error) {
    console.error("Error sharing poster:", error);
    throw error;
  }
};
