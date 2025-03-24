
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
 * Adds a watermark to the canvas
 */
export const addWatermark = (canvas: HTMLCanvasElement): void => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  
  const watermarkText = "MOFATE";
  const padding = 8;
  
  // Set font properties
  ctx.font = "bold 16px Arial";
  
  // Measure text width
  const textMetrics = ctx.measureText(watermarkText);
  const textWidth = textMetrics.width;
  
  // Create background
  const bgWidth = textWidth + (padding * 2);
  const bgHeight = 24;
  
  // Position in bottom right corner with some margin
  const posX = canvas.width - bgWidth - 20;
  const posY = canvas.height - 20;
  
  // Draw white semi-transparent background
  ctx.fillStyle = "#ffffffcc";
  ctx.fillRect(posX, posY - bgHeight + padding, bgWidth, bgHeight);
  
  // Draw green text
  ctx.fillStyle = "#2e7d32";
  ctx.fillText(watermarkText, posX + padding, posY);
};

/**
 * Downloads the poster canvas as an image
 */
export const downloadPoster = (canvas: HTMLCanvasElement, filename: string = "poster"): void => {
  // Add watermark to canvas before downloading
  addWatermark(canvas);
  
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
    // Add watermark to canvas before sharing
    addWatermark(canvas);
    
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
      // Fallback for browsers that don't support the Web Share API
      const url = URL.createObjectURL(blob);
      const win = window.open();
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>Share Your Poster</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: sans-serif; text-align: center; padding: 20px; }
                img { max-width: 100%; max-height: 80vh; margin: 20px auto; display: block; }
                .buttons { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
                .btn { padding: 10px 20px; border-radius: 8px; text-decoration: none; color: white; font-weight: bold; }
                .whatsapp { background-color: #25D366; }
                .download { background-color: #5f6368; }
              </style>
            </head>
            <body>
              <h2>Your Poster</h2>
              <img src="${url}" alt="Your Poster" />
              <div class="buttons">
                <a class="btn whatsapp" href="https://api.whatsapp.com/send?text=${encodeURIComponent('Check out my poster! ' + title)}" target="_blank">Share on WhatsApp</a>
                <a class="btn download" href="${url}" download="poster.png">Download</a>
              </div>
            </body>
          </html>
        `);
      } else {
        throw new Error("Could not open share window");
      }
    }
  } catch (error) {
    console.error("Error sharing poster:", error);
    throw error;
  }
};
