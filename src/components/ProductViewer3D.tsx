
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCw, ZoomIn, ZoomOut, Play, Pause } from 'lucide-react';

interface ProductViewer3DProps {
  images: string[];
  productName: string;
  className?: string;
}

export const ProductViewer3D: React.FC<ProductViewer3DProps> = ({ 
  images, 
  productName, 
  className = '' 
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scale, setScale] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % images.length);
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, images.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setIsPlaying(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const sensitivity = 2;
    const frameChange = Math.floor(Math.abs(deltaX) / sensitivity);

    if (frameChange > 0) {
      const direction = deltaX > 0 ? 1 : -1;
      setCurrentFrame((prev) => {
        const newFrame = prev + (direction * frameChange);
        return ((newFrame % images.length) + images.length) % images.length;
      });
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleAutoplay = () => {
    setIsPlaying(!isPlaying);
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const resetView = () => {
    setScale(1);
    setCurrentFrame(0);
    setIsPlaying(false);
  };

  if (images.length === 0) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <p className="text-gray-500">No images available for 3D view</p>
      </Card>
    );
  }

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div 
        ref={containerRef}
        className="relative bg-gray-50 h-96 flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={images[currentFrame] || '/placeholder.svg'}
          alt={`${productName} - Frame ${currentFrame + 1}`}
          className="max-w-full max-h-full object-contain transition-transform duration-200"
          style={{ 
            transform: `scale(${scale})`,
            userSelect: 'none',
            pointerEvents: 'none'
          }}
          draggable={false}
        />
        
        {/* Frame indicator */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
          {currentFrame + 1} / {images.length}
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black bg-opacity-60 rounded-lg p-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleAutoplay}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={zoomOut}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={zoomIn}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={resetView}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
        <div 
          className="h-full bg-blue-600 transition-all duration-100"
          style={{ width: `${((currentFrame + 1) / images.length) * 100}%` }}
        />
      </div>
    </Card>
  );
};
