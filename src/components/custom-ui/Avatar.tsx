import React, { useState } from 'react';
import Image from 'next/image';

type Variant = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'purple';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  variant?: Variant;
  url?: string | null;
  fallback?: string;
  size?: Size;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  variant = 'neutral',
  url = null,
  fallback = 'US',
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const variantStyles: Record<Variant, string> = {
    success: 'bg-gradient-to-br from-green-600 to-green-700',
    danger: 'bg-gradient-to-br from-red-600 to-red-700',
    warning: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    info: 'bg-gradient-to-br from-blue-600 to-blue-700',
    neutral: 'bg-gradient-to-br from-gray-600 to-gray-700',
    purple: 'bg-gradient-to-br from-purple-600 to-purple-700',
  };

  const sizeStyles: Record<Size, string> = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const bgColor = variantStyles[variant];
  const sizeClass = sizeStyles[size];

  const showFallback = !url || imageError || imageLoading;

  const handleImageLoad = () => setImageLoading(false);
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-bold text-white shadow-md overflow-hidden relative ${bgColor} ${className}`}
    >
      {url && !imageError && (
        <Image
          src={url}
          alt="Avatar"
          fill
          className={`object-cover transition-opacity duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          sizes="(max-width: 768px) 100px, 200px"
        />
      )}

      {showFallback && (
        <span className="relative z-10">
          {fallback
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </span>
      )}
    </div>
  );
};
