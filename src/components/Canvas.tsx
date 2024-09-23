'use client';
import { useEffect, useRef, useState } from 'react';

interface Pixel {
  x: number;
  y: number;
  color: string;
}

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pixels, setPixels] = useState<Pixel[]>([]);
  
  const pixelSize = 1; // Size of each pixel (can be adjusted)

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    drawPixel(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const drawPixel = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pixelSize);
    const y = Math.floor((e.clientY - rect.top) / pixelSize);

    const color = 'black';
    ctx.fillStyle = color;
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);

    // Store the pixel in the state to persist the drawing
    setPixels((prevPixels) => [...prevPixels, { x, y, color }]);
  };

  const redrawCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Redraw all saved pixels
    pixels.forEach((pixel) => {
      ctx.fillStyle = pixel.color;
      ctx.fillRect(pixel.x * pixelSize, pixel.y * pixelSize, pixelSize, pixelSize);
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set initial canvas size to window size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.imageSmoothingEnabled = false;

        // Redraw the canvas with saved pixels
        redrawCanvas(ctx, canvas.width, canvas.height);
      }
    }

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Resize the canvas
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Redraw the canvas with the saved pixels
      redrawCanvas(ctx, canvas.width, canvas.height);

      ctx.imageSmoothingEnabled = false; // Maintain pixelated look
    };

    // Add window resize listener
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [pixels]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-crosshair"
      onMouseDown={startDrawing}
      onMouseUp={stopDrawing}
      onMouseMove={drawPixel}
      onMouseLeave={stopDrawing}
    />
  );
};

export default Canvas;
