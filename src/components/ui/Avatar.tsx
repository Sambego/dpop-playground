"use client";

interface AvatarProps {
  name: string;
  email?: string;
  size?: "sm" | "md" | "lg";
}

export default function Avatar({ name, email, size = "md" }: AvatarProps) {
  const sizes = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-lg",
  };

  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`bg-accent/30 rounded-full glass-card flex items-center justify-center ${sizes[size]}`}
      >
        <span className="font-medium text-accent">{initial}</span>
      </div>
      {(name || email) && (
        <div className="text-sm">
          {name && <span className="text-white font-medium">{name}</span>}
          {email && <span className="text-muted-light block">{email}</span>}
        </div>
      )}
    </div>
  );
}