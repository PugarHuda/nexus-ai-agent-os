"use client";

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function PixelCard({ children, className = "", borderColor = "border-gray-700", onClick, hover = false }: PixelCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-gray-900 border-2 ${borderColor} p-4 ${hover ? "hover:bg-gray-800/70 hover:border-indigo-500/50 cursor-pointer" : ""} transition-colors ${className}`}
    >
      {children}
    </div>
  );
}
