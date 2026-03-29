"use client";

import { useEffect, useRef, useState } from "react";
import NexMascot from "./NexMascot";

/**
 * 3D Pixel Art Hero — CSS 3D with mouse parallax.
 * Features Nex the robot fox mascot floating in 3D space
 * with orbiting pixel elements.
 */

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
    <div ref={containerRef} className="relative w-[360px] h-[360px] mx-auto" style={{ perspective: "800px" }}>
      {/* Main Nex mascot — center */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        {/* Glow behind Nex */}
        <div
          className="absolute w-40 h-40 bg-indigo-600/15 blur-2xl animate-pixel-pulse"
          style={{ transform: "translateZ(-30px)" }}
        />

        {/* Shadow */}
        <div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 w-20 h-3 bg-indigo-500/20 blur-md"
          style={{ transform: "translateZ(-40px)" }}
        />

        {/* Nex mascot */}
        <div className="animate-pixel-float" style={{ transform: "translateZ(30px)" }}>
          <NexMascot variant="idle" size={128} />
        </div>

        {/* Orbiting elements */}
        {/* Chain block */}
        <div
          className="absolute top-6 right-10 animate-pixel-float"
          style={{ transform: "translateZ(50px)", animationDelay: "0.5s" }}
        >
          <div className="w-6 h-6 bg-indigo-500 border-2 border-indigo-300 flex items-center justify-center">
            <span className="font-pixel text-[5px] text-white">0G</span>
          </div>
        </div>

        {/* Shield */}
        <div
          className="absolute bottom-16 left-6 animate-pixel-float"
          style={{ transform: "translateZ(40px)", animationDelay: "1s" }}
        >
          <div className="w-5 h-6 bg-yellow-500 border-2 border-yellow-300" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }} />
        </div>

        {/* Gear */}
        <div
          className="absolute top-16 left-4 animate-pixel-spin"
          style={{ transform: "translateZ(35px)", animationDuration: "10s" }}
        >
          <div className="w-5 h-5 bg-pink-500 border-2 border-pink-300" />
        </div>

        {/* Sparkle particles */}
        <div className="absolute top-4 left-20 animate-pixel-pulse" style={{ transform: "translateZ(55px)", animationDelay: "0.3s" }}>
          <div className="w-2 h-2 bg-green-400" />
        </div>
        <div className="absolute bottom-8 right-16 animate-pixel-pulse" style={{ transform: "translateZ(45px)", animationDelay: "1.5s" }}>
          <div className="w-1.5 h-1.5 bg-yellow-400" />
        </div>
        <div className="absolute top-24 right-4 animate-pixel-pulse" style={{ transform: "translateZ(60px)", animationDelay: "2s" }}>
          <div className="w-1 h-1 bg-indigo-300" />
        </div>

        {/* Data stream lines */}
        <div className="absolute bottom-20 right-8" style={{ transform: "translateZ(20px)" }}>
          <div className="space-y-1 opacity-30">
            <div className="w-8 h-0.5 bg-indigo-400 animate-pulse" />
            <div className="w-6 h-0.5 bg-indigo-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
            <div className="w-10 h-0.5 bg-indigo-400 animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
