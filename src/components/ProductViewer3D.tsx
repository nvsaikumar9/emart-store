
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCw, ZoomIn, ZoomOut, Play, Pause, RotateCcw } from 'lucide-react';

interface ProductViewer3DProps {
  images: string[];
  productName: string;
  className?: string;
}

// Enhanced image cache
const imageCache = new Map<string, HTMLImageElement>();

// State persistence
const getStorageKey = (productName: string) => `viewer3d_${productName.replace(/\s+/g, '_')}`;

// Preload images function
const preloadImages = async (urls: string[]): Promise<HTMLImageElement[]> => {
  const validUrls = urls.filter(url => url && url.trim() !== '');
  
  if (validUrls.length === 0) {
    return [];
  }

  const loadPromises = validUrls.map(async (url) => {
    // Check cache first
    if (imageCache.has(url)) {
      return imageCache.get(url)!;
    }

    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        imageCache.set(url, img);
        resolve(img);
      };
      
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${url}`));
      };
      
      img.src = url;
    });
  });

  try {
    const results = await Promise.allSettled(loadPromises);
    return results
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
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const storageKey = getStorageKey(productName);

  // Filter valid images
  const validImages = useMemo(() => {
    return images.filter(img => img && img.trim() !== '');
  }, [images]);

  // Load persisted state
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const state = JSON.parse(saved);
        setCurrentFrame(Math.min(state.currentFrame || 0, validImages.length - 1));
        setScale(state.scale || 1);
        setDirection(state.direction || 1);
      }
    } catch (error) {
      console.warn('Failed to load persisted state:', error);
    }
  }, [storageKey, validImages.length]);

  // Save state changes
  const saveState = useCallback(() => {
    try {
      const state = { currentFrame, scale, direction };
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save state:', error);
    }
  }, [storageKey, currentFrame, scale, direction]);

  // Save state when it changes
  useEffect(() => {
    if (isReady) {
      saveState();
    }
  }, [currentFrame, scale, direction, isReady, saveState]);

  // Preload images
  useEffect(() => {
    if (validImages.length === 0) {
      setIsReady(true);
      setLoadedImages([]);
      return;
    }

    setIsReady(false);
    
    const loadImages = async () => {
      try {
        const loaded = await preloadImages(validImages);
        setLoadedImages(loaded);
        setIsReady(true);
      } catch (error) {
        console.error('Failed to preload images:', error);
        setIsReady(true);
      }
    };

    loadImages();
  }, [validImages]);

  // Auto-play animation
  useEffect(() => {
    if (isPlaying && validImages.length > 1 && isReady) {
      intervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => {
          const nextFrame = prev + direction;
          if (nextFrame >= validImages.length) return 0;
          if (nextFrame < 0) return validImages.length - 1;
          return nextFrame;
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, validImages.length, direction, isReady]);

  // Mouse handlers for 360° interaction
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (validImages.length <= 1) return;
    setIsDragging(true);
    setStartX(e.clientX);
    setIsPlaying(false);
    e.preventDefault();
  }, [validImages.length]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || validImages.length <= 1) return;

    const deltaX = e.clientX - startX;
    const sensitivity = 3;
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

  // Show loading or no images state
  if (!isReady || validImages.length === 0) {
    return (
      <Card className={`p-8 text-center gradient-card border-0 shadow-lg ${className}`}>
        <div className="text-gray-400 space-y-4">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <RotateCw className={`h-12 w-12 ${!isReady ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <p className="font-medium text-lg">
              {!isReady ? 'Loading 360° View...' : 'No Images Available'}
            </p>
            <p className="text-sm mt-2">
              {!isReady 
                ? 'Preparing your 3D product experience' 
                : 'Upload images to enable 360° product view'
              }
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const currentImage = validImages[Math.min(currentFrame, validImages.length - 1)];

  return (
    <Card className={`relative overflow-hidden gradient-card border-0 shadow-lg ${className}`}>
      <div 
        ref={containerRef}
        className="relative bg-white h-96 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Main 3D product image */}
        <img
          src={currentImage}
          alt={`${productName} - 360° View ${currentFrame + 1}`}
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
        <div className="absolute top-4 left-4 gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          <div className="flex items-center space-x-2">
            <span>{currentFrame + 1} / {validImages.length}</span>
            {validImages.length > 1 && (
              <span className="text-xs opacity-80">
                {isPlaying ? (direction === 1 ? '▶️' : '◀️') : '⏸️'}
              </span>
            )}
          </div>
        </div>

        {/* 3D Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-white bg-opacity-95 backdrop-blur-sm rounded-xl p-3 shadow-xl">
          {validImages.length > 1 && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={prevFrame}
                className="text-blue-600 hover:bg-blue-50 transition-colors"
                title="Previous frame"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleAutoplay}
                className="text-blue-600 hover:bg-blue-50 transition-colors"
                title={isPlaying ? 'Pause 360° rotation' : 'Start 360° rotation'}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={nextFrame}
                className="text-blue-600 hover:bg-blue-50 transition-colors"
                title="Next frame"
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
            className="text-gray-600 hover:bg-gray-50 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-gray-500 font-mono min-w-[3rem] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={zoomIn}
            className="text-gray-600 hover:bg-gray-50 transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={resetView}
            className="text-gray-600 hover:bg-gray-50 transition-colors"
            title="Reset 3D view"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Progress bar for 360° view */}
      {validImages.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-200">
          <div 
            className="h-full gradient-primary transition-all duration-300 rounded-r"
            style={{ width: `${((currentFrame + 1) / validImages.length) * 100}%` }}
          />
        </div>
      )}
    </Card>
  );
};
