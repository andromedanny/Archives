import React from 'react';
import clsx from 'clsx';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  text = null 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const colorClasses = {
    primary: 'border-primary-600',
    white: 'border-white',
    gray: 'border-gray-600',
    success: 'border-success-600',
    warning: 'border-warning-600',
    error: 'border-error-600',
  };

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center space-y-2">
        <div
          className={clsx(
            'animate-spin rounded-full border-2 border-t-transparent',
            sizeClasses[size],
            colorClasses[color]
          )}
        />
        {text && (
          <p className="text-sm text-gray-600 animate-pulse">{text}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
