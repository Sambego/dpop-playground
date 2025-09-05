"use client";

interface JwtIoButtonProps {
  jwt: string;
  className?: string;
}

export default function JwtIoButton({ jwt, className = "" }: JwtIoButtonProps) {
  const handleOpenJwtIo = () => {
    const jwtIoUrl = `https://jwt.io/#token=${encodeURIComponent(jwt)}`;
    window.open(jwtIoUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleOpenJwtIo}
      className={`
        p-2 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100
        glass-button text-muted hover:text-accent hover:scale-105 flex items-center justify-center space-x-2 z-10
        ${className}
      `}
      title="Open in JWT.io"
    >
      <span className="text-[12px]">Open in jwt.io</span>
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </button>
  );
}
