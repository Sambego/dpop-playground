"use client";

import { ReactNode } from "react";

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export default function GlassButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
}: GlassButtonProps) {
  const baseClasses = "rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2";
  
  const variants = {
    primary: "glass-button-primary",
    secondary: "glass-button-secondary text-muted-light hover:text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
  }`;

  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={buttonClasses}
      disabled={disabled}
    >
      {children}
    </button>
  );
}