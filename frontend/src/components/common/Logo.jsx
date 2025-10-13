import React from "react";

const Logo = ({ size = "md", showText = true }) => {
  const sizes = {
    sm: { icon: "w-8 h-8", text: "text-lg" },
    md: { icon: "w-10 h-10", text: "text-xl" },
    lg: { icon: "w-12 h-12", text: "text-2xl" },
  };

  const currentSize = sizes[size];

  return (
    <div className="flex items-center gap-2">
      {/* Logo Icon - Magnifying Glass with Checkmark */}
      <div className={`${currentSize.icon} relative`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background Circle */}
          <circle cx="24" cy="24" r="24" fill="url(#gradient)" />

          {/* Magnifying Glass */}
          <circle
            cx="20"
            cy="18"
            r="8"
            stroke="white"
            strokeWidth="2.5"
            fill="none"
          />
          <line
            x1="26"
            y1="24"
            x2="32"
            y2="30"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Checkmark inside magnifying glass */}
          <path
            d="M17 18L19 20L23 16"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="48" y2="48">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <span
          className={`${currentSize.text} font-serif font-bold text-primary-800`}
        >
          Misinformation Vaccine
        </span>
      )}
    </div>
  );
};

export default Logo;
