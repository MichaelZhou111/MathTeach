import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  size = 'md'
}) => {
  const baseStyles = "font-bold rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-400 text-white shadow-[0_4px_0_rgb(29,78,216)] active:shadow-none active:translate-y-[4px]",
    secondary: "bg-purple-500 hover:bg-purple-400 text-white shadow-[0_4px_0_rgb(126,34,206)] active:shadow-none active:translate-y-[4px]",
    success: "bg-green-500 hover:bg-green-400 text-white shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-[4px]",
    danger: "bg-red-500 hover:bg-red-400 text-white shadow-[0_4px_0_rgb(185,28,28)] active:shadow-none active:translate-y-[4px]",
    outline: "border-4 border-white/50 text-white hover:bg-white/20",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-xl",
    xl: "px-10 py-6 text-3xl",
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};