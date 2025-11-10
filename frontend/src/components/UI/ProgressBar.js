import React from 'react';

/**
 * Progress Bar Component
 * Objective 4.3 & 4.5: Clear feedback during file operations
 */
const ProgressBar = ({ 
  progress = 0, 
  label = 'Uploading...', 
  showPercentage = true,
  className = '',
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600'
  };

  const bgColorClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    red: 'bg-red-100',
    yellow: 'bg-yellow-100'
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
          )}
        </div>
      )}
      <div className={`w-full h-2.5 rounded-full overflow-hidden ${bgColorClasses[color] || bgColorClasses.blue}`}>
        <div
          className={`h-full transition-all duration-300 ease-out ${colorClasses[color] || colorClasses.blue}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

