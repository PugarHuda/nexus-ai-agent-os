"use client";

interface PixelButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  type?: "button" | "submit";
}

const VARIANTS = {
  primary: "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400",
  secondary: "bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600",
  danger: "bg-red-900 hover:bg-red-800 text-red-300 border-red-600",
};

export default function PixelButton({ children, onClick, disabled, variant = "primary", className = "", type = "button" }: PixelButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-pixel text-[8px] px-4 py-2.5 border-2 ${VARIANTS[variant]} disabled:opacity-40 disabled:cursor-not-allowed transition-colors pixel-shadow ${className}`}
    >
      {children}
    </button>
  );
}
