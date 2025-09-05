"use client";

import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "dark";
  padding?: "none" | "sm" | "md" | "lg";
}

export default function GlassCard({
  children,
  className = "",
  variant = "default",
  padding = "md",
}: GlassCardProps) {
  const variants = {
    default: "glass-card border border-border/40",
    dark: "glass-card-dark border border-border/40",
  };

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const cardClasses = `${variants[variant]} ${paddings[padding]} rounded-2xl ${className}`;

  return <div className={cardClasses}>{children}</div>;
}