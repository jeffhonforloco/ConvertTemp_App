
import React from 'react';

interface ConvertTempLogoProps {
  className?: string;
}

export const ConvertTempLogo: React.FC<ConvertTempLogoProps> = ({ className = "h-20 w-auto md:h-32" }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* White Thermometer Icon */}
      <img 
        src="/lovable-uploads/a96d02dd-a838-47a8-a6bb-8c65b5034a32.png" 
        alt="Temperature Converter Icon"
        className="w-12 h-12 md:w-16 md:h-16"
      />
      
      {/* Convert Temp Text */}
      <div className="flex flex-col">
        <span className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">
          Convert
        </span>
        <span className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">
          Temp
        </span>
      </div>
    </div>
  );
};
