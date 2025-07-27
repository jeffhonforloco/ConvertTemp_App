import React from 'react';

interface ConvertTempLogoProps {
  className?: string;
}

export const ConvertTempLogo: React.FC<ConvertTempLogoProps> = ({ className = "h-20 w-auto md:h-32" }) => {
  return (
    <svg
      viewBox="0 0 400 120"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Thermometer Icon */}
      <g>
        {/* Thermometer tube */}
        <rect
          x="20"
          y="15"
          width="8"
          height="65"
          rx="4"
          ry="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-slate-800 dark:text-slate-200"
        />
        
        {/* Thermometer bulb */}
        <circle
          cx="24"
          cy="85"
          r="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-slate-800 dark:text-slate-200"
        />
        
        {/* Blue mercury/liquid */}
        <circle
          cx="24"
          cy="85"
          r="8"
          className="fill-blue-500 dark:fill-blue-400"
        />
        
        {/* Mercury line in tube */}
        <rect
          x="22"
          y="45"
          width="4"
          height="35"
          rx="2"
          ry="2"
          className="fill-blue-500 dark:fill-blue-400"
        />
        
        {/* Temperature marks */}
        <line x1="32" y1="25" x2="38" y2="25" stroke="currentColor" strokeWidth="2" className="text-slate-600 dark:text-slate-400" />
        <line x1="32" y1="35" x2="36" y2="35" stroke="currentColor" strokeWidth="2" className="text-slate-600 dark:text-slate-400" />
        <line x1="32" y1="45" x2="38" y2="45" stroke="currentColor" strokeWidth="2" className="text-slate-600 dark:text-slate-400" />
        <line x1="32" y1="55" x2="36" y2="55" stroke="currentColor" strokeWidth="2" className="text-slate-600 dark:text-slate-400" />
        <line x1="32" y1="65" x2="38" y2="65" stroke="currentColor" strokeWidth="2" className="text-slate-600 dark:text-slate-400" />
      </g>
      
      {/* Convert Text */}
      <text
        x="70"
        y="50"
        fontSize="36"
        fontWeight="600"
        className="fill-slate-800 dark:fill-slate-200"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        Convert
      </text>
      
      {/* Temp Text */}
      <text
        x="70"
        y="85"
        fontSize="36"
        fontWeight="600"
        className="fill-slate-800 dark:fill-slate-200"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        Temp
      </text>
    </svg>
  );
};