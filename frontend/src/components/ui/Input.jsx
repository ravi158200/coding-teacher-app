import React from 'react';

const Input = ({ label, icon: Icon, type = "text", placeholder, className = "", ...props }) => {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="text-sm font-semibold ml-1 text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative group transition-all duration-300">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors duration-300">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`
            w-full bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-md border-2 border-transparent focus:border-violet-500/50 focus:bg-white dark:focus:bg-slate-900 
            outline-none px-4 py-3 rounded-2xl transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-500
            ${Icon ? 'pl-11' : ''}
          `}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
