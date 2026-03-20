import React from 'react';

const Avatar = ({ src, alt, size = "md", className = "" }) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
    xl: "w-24 h-24 text-xl",
  };

  return (
    <div className={`
      ${sizes[size]} relative flex items-center justify-center rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-violet-600 border-2 border-white/20 shadow-xl
      ${className}
    `}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="font-bold text-white tracking-widest uppercase">
          {alt?.slice(0, 2) || "AV"}
        </span>
      )}
    </div>
  );
};

export default Avatar;
