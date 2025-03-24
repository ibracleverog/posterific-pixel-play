
/**
 * Processes an uploaded image file and returns a data URL.
 */
export const processImageFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to process image'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Checks if an image has transparency.
 */
export const hasTransparency = (ctx: CanvasRenderingContext2D, width: number, height: number): boolean => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Check for any transparent pixel (alpha < 255)
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) {
      return true;
    }
  }
  
  return false;
};

/**
 * Composes a poster by combining a template and user image on a canvas.
 * Uses a layering approach similar to Photoshop where the user image is placed below
 * the template, and template transparency reveals the user image.
 */
export const composePoster = (
  canvas: HTMLCanvasElement,
  templateImage: HTMLImageElement,
  userImage: HTMLImageElement,
  position: { x: number; y: number; scale: number; rotation: number }
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Preserve template's original aspect ratio
  const aspectRatio = templateImage.naturalWidth / templateImage.naturalHeight;
  canvas.width = Math.min(600, templateImage.naturalWidth);
  canvas.height = canvas.width / aspectRatio;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Step 1: Draw user image first (bottom layer)
  if (userImage.src) {
    ctx.save();
    
    // Move to the position where we want to draw the center of the user image
    ctx.translate(position.x, position.y);
    ctx.rotate((position.rotation * Math.PI) / 180);
    ctx.scale(position.scale, position.scale);

    // Calculate dimensions to maintain aspect ratio
    const aspectRatio = userImage.width / userImage.height;
    let width = 300; // Base width
    let height = width / aspectRatio;

    // Draw the user image centered at the origin (transformed position)
    ctx.drawImage(userImage, -width / 2, -height / 2, width, height);
    
    // Restore context state
    ctx.restore();
  }

  // Step 2: Draw template on top (top layer)
  // Because we're drawing the template last, transparent areas will reveal the user image below
  if (templateImage.src) {
    ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
  }
  
  // Add watermark
  addWatermark(ctx, canvas.width, canvas.height);
};

/**
 * Adds a watermark to the canvas.
 */
const addWatermark = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  // Position in bottom right corner
  const watermarkSize = 80;
  const padding = 10;
  const x = width - watermarkSize - padding;
  const y = height - watermarkSize - padding;
  
  // Draw white background for watermark
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillRect(x, y, watermarkSize, watermarkSize / 2);
  
  // Draw text
  ctx.font = 'bold 16px Arial';
  ctx.fillStyle = '#00b300'; // Green text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('MOFATE', x + watermarkSize / 2, y + watermarkSize / 4);
};

/**
 * Downloads the poster as an image.
 */
export const downloadPoster = (canvas: HTMLCanvasElement, title: string): void => {
  // Create a temporary link element
  const link = document.createElement('a');
  
  // Convert canvas to data URL
  const dataUrl = canvas.toDataURL('image/png');
  
  // Set link attributes
  link.href = dataUrl;
  link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-poster.png`;
  
  // Append to document, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Shares the poster using Web Share API if available.
 */
export const sharePoster = async (canvas: HTMLCanvasElement, title: string): Promise<void> => {
  // Check if Web Share API is available
  if (!navigator.share) {
    // If not, fallback to download
    downloadPoster(canvas, title);
    throw new Error('Web Share API not supported');
  }
  
  // Convert canvas to blob
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        throw new Error('Failed to convert canvas to blob');
      }
    }, 'image/png');
  });
  
  // Create file from blob
  const file = new File([blob], `${title.replace(/\s+/g, '-').toLowerCase()}-poster.png`, {
    type: 'image/png',
  });
  
  // Share file
  await navigator.share({
    title: `${title} Poster`,
    text: 'Check out my custom poster!',
    files: [file],
  });
};
