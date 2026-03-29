"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 3D Pixel Art Hero — CSS-only 3D with mouse parallax.
 * Renders a floating pixel robot/agent that reacts to mouse movement.
 */

// Pixel grid for a robot/agent face (16x16)
const ROBOT_GRID = [
  "................",
  "....CCCCCCCC....",
  "...CCCCCCCCCC...",
  "..CCCCCCCCCCCC..",
  "..CC.BBBB.BBCC..",
  "..CCBBBBBBBBCC..",
  "..CCBB.BB.BBCC..",
  "..CCBBBBBBBBCC..",
  "..CCCC.CC.CCCC..",
  "..CCCCCCCCCCCC..",
  "...CCDDDDDDCC..",
  "....CCCCCCCC....",
  ".....EEEEEE.....",
  "....EE.EE.EE....",
  "...EE..EE..EE...",
  "................",
];

const PALETTE: Record<string, string> = {
  C: "#6366f1", // Indigo body
  B: "#818cf8", // Light indigo face
  D: "#22c55e", // Green mouth
  E: "#a5b4fc", // Light legs
};

// Shield icon grid
const SHIELD_GRID = [
  "........",
  "..AAAA..",
  ".AABBAA.",
  ".ABCCBA.",
  ".ABCCBA.",
  ".AABBAA.",
  "..AAAA..",
  "...AA...",
];

const SHIELD_PALETTE: Record<string, string> = {
  A: "#f59e0b",
  B: "#fbbf24",
  C: "#fef3c7",
};

// Gear icon grid
const GEAR_GRID = [
  "..AA.AA..",
  ".AAAAAAA.",
  "AABBBBBAA",
  "AABB.BBAA",
  ".AABBBAA.",
  "AABB.BBAA",
  "AABBBBBAA",
  ".AAAAAAA.",
  "..AA.AA..",
];

const GEAR_PALETTE: Record<string, string> = {
  A: "#ec4899",
  B: "#f9a8d4",
};

function PixelArt({
  grid,
  palette,
  pixelSize = 6,
  className = "",
}: {
  grid: string[];
  palette: Record<string, string>;
  pixelSize?: number;
  className?: string;
}) {
  const width = grid[0].length * pixelSize;
  const height = grid.length * pixelSize;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className}>
      {grid.map((row, y) =>
        row.split("").map((char, x) => {
          if (char === ".") return null;
          return (
            <rect
              key={`${x}-${y}`}
              x={x * pixelSize}
              y={y * pixelSize}
              width={pixelSize}
              height={pixelSize}
              fill={palette[char] || "#fff"}
            />
          );
        })
      )}
    </svg>
  );
}

export default function PixelHero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateY = ((e.clientX - centerX) / rect.width) * 20;
      const rotateX = ((centerY - e.clientY) / rect.height) * 15;
      setRotation({ x: rotateX, y: rotateY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative w-[400px] h-[400px] mx-auto" style={{ perspective: "800px" }}>
      {/* Main robot — center, largest */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        {/* Shadow */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-24 h-4 bg-indigo-500/20 rounded-full blur-md"
          style={{ transform: "translateZ(-40px)" }}
        />

        {/* Back layer — glow */}
        <div
          className="absolute w-32 h-32 bg-indigo-600/20 rounded-full blur-xl animate-pixel-pulse"
          style={{ transform: "translateZ(-30px)" }}
        />

        {/* Middle layer — robot */}
        <div
          className="animate-pixel-float"
          style={{ transform: "translateZ(20px)" }}
        >
          <PixelArt grid={ROBOT_GRID} palette={PALETTE} pixelSize={8} />
        </div>

        {/* Front layer — sparkle particles */}
        <div
          className="absolute top-8 right-8 animate-pixel-pulse"
          style={{ transform: "translateZ(50px)", animationDelay: "0.5s" }}
        >
          <div className="w-2 h-2 bg-yellow-400" />
        </div>
        <div
          className="absolute bottom-12 left-12 animate-pixel-pulse"
          style={{ transform: "translateZ(40px)", animationDelay: "1s" }}
        >
          <div className="w-1.5 h-1.5 bg-green-400" />
        </div>
        <div
          className="absolute top-16 left-6 animate-pixel-pulse"
          style={{ transform: "translateZ(35px)", animationDelay: "1.5s" }}
        >
          <div className="w-1 h-1 bg-pink-400" />
        </div>
      </div>

      {/* Floating shield — left */}
      <div
        className="absolute top-20 -left-4 transition-transform duration-300 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotation.x * 0.6}deg) rotateY(${rotation.y * 0.6}deg) translateZ(10px)`,
        }}
      >
        <div className="animate-pixel-float" style={{ animationDelay: "0.8s" }}>
          <PixelArt grid={SHIELD_GRID} palette={SHIELD_PALETTE} pixelSize={5} />
        </div>
      </div>

      {/* Floating gear — right */}
      <div
        className="absolute bottom-16 -right-2 transition-transform duration-300 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotation.x * 0.4}deg) rotateY(${rotation.y * 0.4}deg) translateZ(15px)`,
        }}
      >
        <div className="animate-pixel-spin" style={{ animationDuration: "12s" }}>
          <PixelArt grid={GEAR_GRID} palette={GEAR_PALETTE} pixelSize={4} />
        </div>
      </div>

      {/* Floating blocks — decorative */}
      <div
        className="absolute top-4 right-16 transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${rotation.x * 0.3}deg) rotateY(${rotation.y * 0.3}deg) translateZ(25px)`,
        }}
      >
        <div className="w-4 h-4 bg-nexus-500 animate-pixel-float" style={{ animationDelay: "1.2s" }} />
      </div>
      <div
        className="absolute bottom-8 left-20 transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${rotation.x * 0.5}deg) rotateY(${rotation.y * 0.5}deg) translateZ(20px)`,
        }}
      >
        <div className="w-3 h-3 bg-green-500 animate-pixel-float" style={{ animationDelay: "2s" }} />
      </div>
    </div>
  );
}
