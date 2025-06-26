
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCw, ZoomIn, ZoomOut, Play, Pause, RotateCcw } from 'lucide-react';

interface ProductViewer3DProps {
  images: string[];
  productName: string;
  className?: string;
}

// Enhanced image cache with error tracking
const imageCache = new Map<string, { img: HTMLImageElement; status: 'loaded' | 'error' }>();

// State persistence key
const getStorageKey = (productName: string) => `viewer3d_${productName.replace(/\s+/g, '_')}`;

// Robust image preloader with fallback handling
const preloadImages = async (urls: string[]): Promise<HTMLImageElement[]> => {
  const validUrls = urls.filter(url => url && url.trim() !== '' && !url.includes('blob:'));
  
  if (validUrls.length === 0) {
    console.warn('No valid image URLs provided for preloading');
    return [];
  }

  const loadPromises = validUrls.map(async (url, index) => {
    // Check cache first
    const cached = imageCache.get(url);
    if (cached?.status === 'loaded') {
      return cached.img;
    }

    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      
      // Set loading attributes
      img.loading = 'eager';
      img.fetchPriority = 'high';
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        imageCache.set(url, { img, status: 'loaded' });
        console.log(`✅ Successfully loaded image ${index + 1}/${validUrls.length}`);
        resolve(img);
      };
      
      img.onerror = () => {
        console.error(`❌ Failed to load image: ${url}`);
        imageCache.set(url, { img, status: 'error' });
        reject(new Error(`Failed to load image: ${url}`));
      };
      
      // Add timeout for better error handling
      setTimeout(() => {
        if (!imageCache.has(url)) {
          console.error(`⏰ Timeout loading image: ${url}`);
          reject(new Error(`Timeout loading image: ${url}`));
        }
      }, 10000);
      
      img.src = url;
    });
  });

  try {
    const results = await Promise.allSettled(loadPromises);
    const loadedImages = results
      .filter((result): result is PromiseFulfilledResult<HTMLImageElement> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
    
    console.log(`📊 Loaded ${loadedImages.length}/${validUrls.length} images successfully`);
    return loadedImages;
  } catch (error) {
    console.error('Error in preloadImages:', error);
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

  // Filter valid images and remove blob URLs
  const validImages = useMemo(() => {
    const filtered = images.filter(img => 
      img && 
      img.trim() !== '' && 
      !img.includes('blob:') &&
      (img.startsWith('http') || img.startsWith('/') || img.startsWith('data:'))
    );
    console.log(`🔍 Filtered ${filtered.length} valid images from ${images.length} total`);
    return filtered;
  }, [images]);

  // Load persisted state on component mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const state = JSON.parse(saved);
        setCurrentFrame(Math.min(state.currentFrame || 0, validImages.length - 1));
        setScale(state.scale || 1);
        setDirection(state.direction || 1);
        console.log(`💾 Restored state for ${productName}`);
      }
    } catch (error) {
      console.warn('Failed to load persisted state:', error);
    }
  }, [storageKey, productName, validImages.length]);

  // Save state changes to localStorage
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

  // Enhanced image preloading with better error handling
  useEffect(() => {
    if (validImages.length === 0) {
      setIsReady(true);
      setLoadedImages([]);
      console.warn('⚠️ No valid images to load for 360° view');
      return;
    }

    setIsReady(false);
    setLoadedImages([]);
    
    const loadImages = async () => {
      try {
        console.log(`🚀 Starting to preload ${validImages.length} images for ${productName}`);
        const loaded = await preloadImages(validImages);
        
        if (loaded.length > 0) {
          setLoadedImages(loaded);
          setIsReady(true);
          console.log(`✅ Successfully loaded ${loaded.length} images for 360° view`);
        } else {
          console.error('❌ No images could be loaded for 360° view');
          setIsReady(true); // Still show component with fallback
        }
      } catch (error) {
        console.error('Failed to preload images:', error);
        setIsReady(true);
      }
    };

    loadImages();
  }, [validImages, productName]);

  // Auto-play animation with better cleanup
  useEffect(() => {
    if (isPlaying && validImages.length > 1 && isReady && loadedImages.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => {
          const nextFrame = prev + direction;
          if (nextFrame >= validImages.length) return 0;
          if (nextFrame < 0) return validImages.length - 1;
          return nextFrame;
        });
      }, 120); // Slightly slower for smoother experience
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
  }, [isPlaying, validImages.length, direction, isReady, loadedImages.length]);

  // Enhanced mouse handlers with better touch support
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (validImages.length <= 1 || loadedImages.length === 0) return;
    setIsDragging(true);
    setStartX(e.clientX);
    setIsPlaying(false);
    e.preventDefault();
  }, [validImages.length, loadedImages.length]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || validImages.length <= 1 || loadedImages.length === 0) return;

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
  }, [isDragging, validImages.length, startX, loadedImages.length]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Control functions
  const toggleAutoplay = useCallback(() => {
    if (validImages.length > 1 && loadedImages.length > 0) {
      setIsPlaying(!isPlaying);
    }
  }, [validImages.length, isPlaying, loadedImages.length]);

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
    if (validImages.length <= 1 || loadedImages.length === 0) return;
    setCurrentFrame((prev) => (prev + 1) % validImages.length);
  }, [validImages.length, loadedImages.length]);

  const prevFrame = useCallback(() => {
    if (validImages.length <= 1 || loadedImages.length === 0) return;
    setCurrentFrame((prev) => (prev - 1 + validImages.length) % validImages.length);
  }, [validImages.length, loadedImages.length]);

  // Show enhanced placeholder for no images or loading state
  if (validImages.length === 0 || loadedImages.length === 0) {
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
                ? 'Preparing immersive product experience' 
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
        {/* Main product image - always visible */}
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
          onError={(e) => {
            console.error(`Failed to display image ${currentFrame + 1}:`, currentImage);
          }}
        />
        
        {/* Enhanced frame indicator */}
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

        {/* Enhanced controls */}
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
                title={isPlaying ? 'Pause rotation' : 'Start rotation'}
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
            title="Reset view"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Enhanced progress bar */}
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
