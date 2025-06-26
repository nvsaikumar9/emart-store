
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCw, ZoomIn, ZoomOut, Play, Pause, RotateCcw } from 'lucide-react';

interface ProductViewer3DProps {
  images: string[];
  productName: string;
  className?: string;
}

// Image cache to store preloaded images globally
const imageCache = new Map<string, HTMLImageElement>();

// Preload images with high priority and cache them
const preloadImages = async (urls: string[]): Promise<HTMLImageElement[]> => {
  const loadPromises = urls.map((url, index) => {
    // Check if image is already cached
    if (imageCache.has(url)) {
      return Promise.resolve(imageCache.get(url)!);
    }

    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      
      // Set high priority for immediate loading
      img.loading = 'eager';
      img.fetchPriority = 'high';
      
      img.onload = () => {
        imageCache.set(url, img);
        resolve(img);
      };
      
      img.onerror = () => {
        console.error(`Failed to preload image: ${url}`);
        reject(new Error(`Failed to load image: ${url}`));
      };
      
      // Start loading immediately
      img.src = url;
    });
  });

  try {
    const loadedImages = await Promise.allSettled(loadPromises);
    return loadedImages
      .filter((result): result is PromiseFulfilledResult<HTMLImageElement> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
  } catch (error) {
    console.error('Error preloading images:', error);
    return [];
  }
};

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
  const [direction, setDirection] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const preloadedImages = useRef<HTMLImageElement[]>([]);

  // Memoize valid images to prevent unnecessary recalculations
  const validImages = useMemo(() => {
    return images.filter(img => img && img.trim() !== '');
  }, [images]);

  // Preload all images immediately when component mounts or images change
  useEffect(() => {
    if (validImages.length === 0) {
      setIsReady(true);
      return;
    }

    setIsReady(false);
    
    const loadImages = async () => {
      try {
        const loaded = await preloadImages(validImages);
        preloadedImages.current = loaded;
        
        // Images are ready immediately after preloading
        setIsReady(true);
        
        console.log(`✅ All ${loaded.length} images preloaded for ${productName}`);
      } catch (error) {
        console.error('Failed to preload images:', error);
        setIsReady(true); // Still show component even if some images fail
      }
    };

    loadImages();
  }, [validImages, productName]);

  // Auto-play animation effect
  useEffect(() => {
    if (isPlaying && validImages.length > 1 && isReady) {
      intervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => {
          const nextFrame = prev + direction;
          if (nextFrame >= validImages.length) return 0;
          if (nextFrame < 0) return validImages.length - 1;
          return nextFrame;
        });
      }, 100); // Faster animation for smoother experience
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
  }, [isPlaying, validImages.length, direction, isReady]);

  // Optimized mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (validImages.length <= 1) return;
    setIsDragging(true);
    setStartX(e.clientX);
    setIsPlaying(false);
  }, [validImages.length]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || validImages.length <= 1) return;

    const deltaX = e.clientX - startX;
    const sensitivity = 2; // More responsive
    const frameChange = Math.floor(Math.abs(deltaX) / sensitivity);

    if (frameChange > 0) {
      const moveDirection = deltaX > 0 ? 1 : -1;
      setCurrentFrame((prev) => {
        const newFrame = prev + (moveDirection * frameChange);
        return ((newFrame % validImages.length) + validImages.length) % validImages.length;
      });
      setStartX(e.clientX);
    }
  }, [isDragging, validImages.length, startX]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Control functions
  const toggleAutoplay = useCallback(() => {
    if (validImages.length > 1) {
      setIsPlaying(!isPlaying);
    }
  }, [validImages.length, isPlaying]);

  const toggleDirection = useCallback(() => {
    setDirection(prev => prev * -1);
  }, []);

  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.2, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  }, []);

  const resetView = useCallback(() => {
    setScale(1);
    setCurrentFrame(0);
    setIsPlaying(false);
  }, []);

  const nextFrame = useCallback(() => {
    if (validImages.length <= 1) return;
    setCurrentFrame((prev) => (prev + 1) % validImages.length);
  }, [validImages.length]);

  const prevFrame = useCallback(() => {
    if (validImages.length <= 1) return;
    setCurrentFrame((prev) => (prev - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  // Show placeholder if no images
  if (validImages.length === 0) {
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

  const currentImage = validImages[currentFrame];

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
        {/* Always show the current image immediately - no loading states */}
        <img
          src={currentImage}
          alt={`${productName} - Frame ${currentFrame + 1}`}
          className="max-w-full max-h-full object-contain transition-transform duration-100"
          style={{ 
            transform: `scale(${scale})`,
            userSelect: 'none',
            pointerEvents: 'none'
          }}
          draggable={false}
          loading="eager"
          fetchPriority="high"
        />
        
        {/* Frame indicator */}
        <div className="absolute top-4 left-4 gradient-primary text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          {currentFrame + 1} / {validImages.length}
          {validImages.length > 1 && (
            <span className="ml-2 text-xs opacity-80">
              {isPlaying ? (direction === 1 ? '▶' : '◀') : '⏸'}
            </span>
          )}
        </div>

        {/* Enhanced controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-white bg-opacity-95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
          {validImages.length > 1 && (
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
      
      {/* Progress bar */}
      {validImages.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-100">
          <div 
            className="h-full gradient-primary transition-all duration-200 rounded-r"
            style={{ width: `${((currentFrame + 1) / validImages.length) * 100}%` }}
          />
        </div>
      )}
    </Card>
  );
};
