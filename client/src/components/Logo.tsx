import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`${sizeClasses[size]} bg-smart-blue rounded-full flex items-center justify-center mb-4`}>
        <svg
          className="w-3/4 h-3/4 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-smart-blue">SMART</h1>
        <h1 className="text-2xl font-bold text-smart-blue">PUMP</h1>
      </div>
    </div>
  );
};

export default Logo;
