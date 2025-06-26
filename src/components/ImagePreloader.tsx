
import { useEffect } from 'react';

interface ImagePreloaderProps {
  images: string[];
  priority?: boolean;
}

// Global image preloader component for aggressive image caching
export const ImagePreloader: React.FC<ImagePreloaderProps> = ({ images, priority = false }) => {
  useEffect(() => {
    if (images.length === 0) return;

    // Create preload links in document head for maximum performance
    const preloadLinks: HTMLLinkElement[] = [];

    images.forEach((src, index) => {
      if (!src || src.trim() === '') return;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      
      if (priority || index < 5) {
        link.fetchPriority = 'high';
      }

      document.head.appendChild(link);
      preloadLinks.push(link);

      // Also create image objects for browser cache
      const img = new Image();
      img.loading = priority ? 'eager' : 'lazy';
      img.src = src;
    });

    // Cleanup function
    return () => {
      preloadLinks.forEach(link => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
    };
  }, [images, priority]);

  return null; // This component doesn't render anything
};
