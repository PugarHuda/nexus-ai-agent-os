"use client";

/**
 * Nex — The Nexus Robot Fox Mascot
 * 24x24 pixel art with clear fox features:
 * - Pointy ears with antenna
 * - Fox snout/muzzle
 * - LED eyes (green)
 * - Mechanical body with chest plate
 * - Bushy pixel tail
 */

// 24x24 Nex idle — robot fox with tail
const NEX_IDLE = [
  "......A.......A.............",
  ".....AA.......AA............",
  "....AAA.......AAA...........",
  "...AAAA.......AAAA..........",
  "..AAAAAAAAAAAAAAAAAA........",
  "..AABBBBBBBBBBBBBBAA........",
  "..AABBBBBBBBBBBBBBA.........",
  "..AABGGB......BGGBAA........",
  "..AABGGB......BGGBAA........",
  "..AABBBB......BBBBAA........",
  "..AAABBB..WW..BBBAA.........",
  "...AABBBBWWWWBBBBAA..........",
  "....AABBBBBBBBBBAA...........",
  ".....DDDDDDDDDDDD...........",
  "....DDDDDDDDDDDDDD..........",
  "....DDEEDDDDDDEEDDD..........",
  "....DDDDDDDDDDDDDD..........",
  "....DDDDDDDDDDDDDDD.........",
  ".....DDDD....DDDDDAA........",
  "....DD..DD..DD..DDAAAA......",
  "....EE..EE..EE..EEAAAA.....",
  "........................AAAA.",
  ".........................AAA.",
  "..........................A..",
];

const NEX_PALETTE: Record<string, string> = {
  A: "#f97316", // Orange fur (fox!)
  B: "#fdba74", // Light orange face
  G: "#22c55e", // Green LED eyes
  D: "#6366f1", // Indigo mech body
  E: "#a5b4fc", // Light indigo paws
  W: "#ffffff", // White muzzle/nose
};

// 24x24 Nex waving
const NEX_WAVE = [
  "......A.......A.............",
  ".....AA.......AA............",
  "....AAA.......AAA...........",
  "...AAAA.......AAAA..........",
  "..AAAAAAAAAAAAAAAAAA........",
  "..AABBBBBBBBBBBBBBAA........",
  "..AABBBBBBBBBBBBBBA.........",
  "..AABGGB......BGGBAA........",
  "..AABGGB......BGGBAA........",
  "..AABBBB......BBBBAA........",
  "..AAABBB..WW..BBBAA.........",
  "...AABBBBWWWWBBBBAA..........",
  "....AABBBBBBBBBBAA...........",
  ".....DDDDDDDDDDDD....EE....",
  "....DDDDDDDDDDDDDD..EE.....",
  "....DDEEDDDDDDEEDDDEE.......",
  "....DDDDDDDDDDDDDDEE.......",
  "....DDDDDDDDDDDDDDD........",
  ".....DDDD....DDDDDAA........",
  "....DD..DD..DD..DDAAAA......",
  "....EE..EE..EE..EEAAAA.....",
  "........................AAAA.",
  ".........................AAA.",
  "..........................A..",
];

// 24x24 Nex thinking (dots above head)
const NEX_THINK = [
  "..........GG..GG..GG........",
  "......A.......A.............",
  ".....AA.......AA............",
  "....AAA.......AAA...........",
  "...AAAA.......AAAA..........",
  "..AAAAAAAAAAAAAAAAAA........",
  "..AABBBBBBBBBBBBBBAA........",
  "..AABBBBBBBBBBBBBBA.........",
  "..AABGGB......BGGBAA........",
  "..AABGGB......BGGBAA........",
  "..AABBBB......BBBBAA........",
  "..AAABBB..WW..BBBAA.........",
  "...AABBBBWWWWBBBBAA..........",
  "....AABBBBBBBBBBAA...........",
  ".....DDDDDDDDDDDD...........",
  "....DDDDDDDDDDDDDD..........",
  "....DDEEDDDDDDEEDDD..........",
  "....DDDDDDDDDDDDDD..........",
  "....DDDDDDDDDDDDDDD.........",
  ".....DDDD....DDDDDAA........",
  "....DD..DD..DD..DDAAAA......",
  "....EE..EE..EE..EEAAAA.....",
  "........................AAAA.",
  "..........................A..",
];

interface NexMascotProps {
  variant?: "idle" | "wave" | "think";
  size?: number;
  className?: string;
  animate?: boolean;
}

function renderPixelGrid(grid: string[], palette: Record<string, string>, pixelSize: number) {
  const maxCols = Math.max(...grid.map(r => r.length));
  const width = maxCols * pixelSize;
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

export default function NexMascot({ variant = "idle", size = 96, className = "", animate = false }: NexMascotProps) {
  const grids = { idle: NEX_IDLE, wave: NEX_WAVE, think: NEX_THINK };
  const grid = grids[variant];
  const pixelSize = size / 24;
  const { width, height, pixels } = renderPixelGrid(grid, NEX_PALETTE, pixelSize);

  return (
    <div className={`inline-block ${animate ? "animate-pixel-float" : ""} ${className}`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ imageRendering: "pixelated" }}>
        {pixels}
      </svg>
    </div>
  );
}

export function NexIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  const pixelSize = size / 24;
  const { width, height, pixels } = renderPixelGrid(NEX_IDLE, NEX_PALETTE, pixelSize);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} style={{ imageRendering: "pixelated" }}>
      {pixels}
    </svg>
  );
}
