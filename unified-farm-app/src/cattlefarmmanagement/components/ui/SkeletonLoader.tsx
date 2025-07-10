import React from 'react';

interface SkeletonLoaderProps {
  height?: string;
  width?: string;
  className?: string;
  count?: number;
  rounded?: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ height = 'h-6', width = 'w-full', className = '', count = 1, rounded = true }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${height} ${width} ${rounded ? 'rounded-lg' : ''} ${className}`}
        />
      ))}
    </>
  );
};

export default SkeletonLoader; 