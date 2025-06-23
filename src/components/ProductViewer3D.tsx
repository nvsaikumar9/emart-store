
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCw, ZoomIn, ZoomOut, Play, Pause, RotateCcw } from 'lucide-react';

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
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for reverse
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPlaying && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => {
          const nextFrame = prev + direction;
          if (nextFrame >= images.length) return 0;
          if (nextFrame < 0) return images.length - 1;
          return nextFrame;
        });
      }, 120); // Slower for better viewing
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
  }, [isPlaying, images.length, direction]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (images.length <= 1) return;
    setIsDragging(true);
    setStartX(e.clientX);
    setIsPlaying(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || images.length <= 1) return;

    const deltaX = e.clientX - startX;
    const sensitivity = 3;
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
    if (images.length > 1) {
      setIsPlaying(!isPlaying);
    }
  };

  const toggleDirection = () => {
    setDirection(prev => prev * -1);
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

  const nextFrame = () => {
    if (images.length <= 1) return;
    setCurrentFrame((prev) => (prev + 1) % images.length);
  };

  const prevFrame = () => {
    if (images.length <= 1) return;
    setCurrentFrame((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return (
      <Card className={`p-8 text-center gradient-card border-0 shadow-lg ${className}`}>
        <div className="text-gray-400 space-y-4">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <RotateCw className="h-12 w-12" />
          </div>
          <p>Upload images to see 360° view</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`relative overflow-hidden gradient-card border-0 shadow-lg ${className}`}>
      <div 
        ref={containerRef}
        className="relative bg-white h-96 flex items-center justify-center cursor-grab active:cursor-grabbing"
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
        
        {/* Enhanced frame indicator */}
        <div className="absolute top-4 left-4 gradient-primary text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          {currentFrame + 1} / {images.length}
          {images.length > 1 && (
            <span className="ml-2 text-xs opacity-80">
              {isPlaying ? (direction === 1 ? '▶' : '◀') : '⏸'}
            </span>
          )}
        </div>

        {/* Enhanced controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-white bg-opacity-95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
          {images.length > 1 && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={prevFrame}
                className="text-blue-600 hover:bg-blue-50"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleAutoplay}
                className="text-blue-600 hover:bg-blue-50"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={nextFrame}
                className="text-blue-600 hover:bg-blue-50"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <div className="w-px h-6 bg-gray-300"></div>
            </>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={zoomOut}
            className="text-gray-600 hover:bg-gray-50"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={zoomIn}
            className="text-gray-600 hover:bg-gray-50"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={resetView}
            className="text-gray-600 hover:bg-gray-50"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Enhanced progress bar */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-100">
          <div 
            className="h-full gradient-primary transition-all duration-300 rounded-r"
            style={{ width: `${((currentFrame + 1) / images.length) * 100}%` }}
          />
        </div>
      )}
    </Card>
  );
};
