"use client";

/**
 * Nex — The Nexus Mascot
 * A pixel robot fox with antenna, indigo body, green eyes.
 * Represents the autonomous, intelligent AI agents of Nexus.
 */

// 16x16 Nex facing forward (idle)
const NEX_IDLE = [
  "......AA.AA.....",
  ".....AAAAAA.....",
  "....AAIIAAIIA....",
  "...AAIIIIIIIAA...",
  "...AIIGGIIGGIA...",
  "...AIIIIIIIIIA...",
  "...AIIII..IIIA...",
  "....AIIIIIIA....",
  ".....DDDDDD.....",
  "....DDDDDDDD....",
  "...DD.DDDD.DD...",
  "...DD.DDDD.DD...",
  "....DDDDDDDD....",
  ".....DD..DD.....",
  "....DD....DD....",
  "....EE....EE....",
];

const NEX_PALETTE: Record<string, string> = {
  A: "#6366f1", // Indigo fur
  I: "#818cf8", // Light indigo inner
  G: "#22c55e", // Green eyes
  D: "#4f46e5", // Dark indigo body
  E: "#a5b4fc", // Light paws
};

// 16x16 Nex waving (for empty states)
const NEX_WAVE = [
  "......AA.AA.....",
  ".....AAAAAA.....",
  "....AAIIAAIIA....",
  "...AAIIIIIIIAA...",
  "...AIIGGIIGGIA...",
  "...AIIIIIIIIIA...",
  "...AIIII..IIIA...",
  "....AIIIIIIA....",
  ".....DDDDDD..A..",
  "....DDDDDDDD.A..",
  "...DD.DDDD.DDA..",
  "...DD.DDDD.DD...",
  "....DDDDDDDD....",
  ".....DD..DD.....",
  "....DD....DD....",
  "....EE....EE....",
];

// 16x16 Nex thinking (for loading states)
const NEX_THINK = [
  "..........GG....",
  "......AA.AAGG...",
  ".....AAAAAA.G...",
  "....AAIIAAIIA....",
  "...AAIIIIIIIAA...",
  "...AIIGGIIGGIA...",
  "...AIIIIIIIIIA...",
  "...AIIII..IIIA...",
  "....AIIIIIIA....",
  ".....DDDDDD.....",
  "....DDDDDDDD....",
  "...DD.DDDD.DD...",
  "...DD.DDDD.DD...",
  "....DDDDDDDD....",
  ".....DD..DD.....",
  "....EE....EE....",
];

interface NexMascotProps {
  variant?: "idle" | "wave" | "think";
  size?: number;
  className?: string;
  animate?: boolean;
}

function renderPixelGrid(grid: string[], palette: Record<string, string>, pixelSize: number) {
  const width = grid[0].length * pixelSize;
  const height = grid.length * pixelSize;
  const pixels: JSX.Element[] = [];

  grid.forEach((row, y) => {
    row.split("").forEach((char, x) => {
      if (char !== ".") {
        pixels.push(
          <rect
            key={`${x}-${y}`}
            x={x * pixelSize}
            y={y * pixelSize}
            width={pixelSize}
            height={pixelSize}
            fill={palette[char] || "#fff"}
          />
        );
      }
    });
  });

  return { width, height, pixels };
}

export default function NexMascot({ variant = "idle", size = 64, className = "", animate = false }: NexMascotProps) {
  const grids = { idle: NEX_IDLE, wave: NEX_WAVE, think: NEX_THINK };
  const grid = grids[variant];
  const pixelSize = size / 16;
  const { width, height, pixels } = renderPixelGrid(grid, NEX_PALETTE, pixelSize);

  return (
    <div className={`inline-block ${animate ? "animate-pixel-float" : ""} ${className}`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ imageRendering: "pixelated" }}>
        {pixels}
      </svg>
    </div>
  );
}

/** Small inline Nex for text/badges */
export function NexIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  const pixelSize = size / 16;
  const { width, height, pixels } = renderPixelGrid(NEX_IDLE, NEX_PALETTE, pixelSize);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} style={{ imageRendering: "pixelated" }}>
      {pixels}
    </svg>
  );
}
