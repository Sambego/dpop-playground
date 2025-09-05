"use client";

interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  className?: string;
}

export default function SkeletonLoader({
  width = "w-full",
  height = "h-4",
  className = "",
}: SkeletonLoaderProps) {
  return (
    <div
      className={`${width} ${height} bg-muted/20 rounded glass-card animate-pulse ${className}`}
    />
  );
}

export function SkeletonCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass-card p-6 rounded-2xl border border-border/40 space-y-4">
      {children}
    </div>
  );
}