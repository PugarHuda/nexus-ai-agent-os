"use client";

import { useEffect, useRef, useState } from "react";
import NexMascot from "./NexMascot";

export default function PixelHero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setRotation({
        x: ((centerY - e.clientY) / rect.height) * 12,
        y: ((e.clientX - centerX) / rect.width) * 15,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative w-[380px] h-[380px] mx-auto" style={{ perspective: "900px" }}>
      {/* Platform / ground */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-2 bg-indigo-600/30 blur-sm" style={{ transform: "translateZ(-20px) rotateX(60deg)" }} />

      {/* Main 3D scene */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        {/* Glow */}
        <div className="absolute w-48 h-48 bg-orange-500/10 blur-3xl animate-pixel-pulse" style={{ transform: "translateZ(-40px)" }} />
        <div className="absolute w-32 h-32 bg-indigo-500/10 blur-2xl" style={{ transform: "translateZ(-30px)" }} />

        {/* Nex mascot — front and center */}
        <div className="animate-pixel-float" style={{ transform: "translateZ(40px)" }}>
          <NexMascot variant="idle" size={160} />
        </div>

        {/* Orbiting 0G chain block */}
        <div
          className="absolute top-4 right-8 animate-pixel-float"
          style={{ transform: "translateZ(60px)", animationDelay: "0.5s" }}
        >
          <div className="bg-indigo-600 border-2 border-indigo-300 px-2 py-1.5 pixel-shadow">
            <span className="font-pixel text-[6px] text-white">0G</span>
          </div>
        </div>

        {/* INFT badge */}
        <div
          className="absolute bottom-20 left-4 animate-pixel-float"
          style={{ transform: "translateZ(50px)", animationDelay: "1.2s" }}
        >
          <div className="bg-orange-600 border-2 border-orange-300 px-2 py-1 pixel-shadow">
            <span className="font-pixel text-[5px] text-white">INFT</span>
          </div>
        </div>

        {/* TeeML verification badge */}
        <div
          className="absolute top-20 left-2 animate-pixel-float"
          style={{ transform: "translateZ(45px)", animationDelay: "0.8s" }}
        >
          <div className="bg-green-600 border-2 border-green-300 px-1.5 py-1 pixel-shadow">
            <span className="font-pixel text-[5px] text-white">✓ TEE</span>
          </div>
        </div>

        {/* Skill gem */}
        <div
          className="absolute bottom-12 right-12 animate-pixel-spin"
          style={{ transform: "translateZ(55px)", animationDuration: "8s" }}
        >
          <div className="w-5 h-5 bg-yellow-500 border-2 border-yellow-300 rotate-45" />
        </div>

        {/* Sparkle particles */}
        {[
          { top: "8px", left: "50%", delay: "0s", size: "3px", color: "bg-green-400" },
          { top: "30%", right: "4px", delay: "0.7s", size: "2px", color: "bg-orange-400" },
          { bottom: "25%", left: "15%", delay: "1.4s", size: "2px", color: "bg-indigo-300" },
          { top: "60%", right: "20%", delay: "2.1s", size: "3px", color: "bg-yellow-400" },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute animate-pixel-pulse"
            style={{ ...p, transform: `translateZ(${50 + i * 10}px)`, animationDelay: p.delay } as React.CSSProperties}
          >
            <div className={`${p.color}`} style={{ width: p.size, height: p.size }} />
          </div>
        ))}

        {/* Data stream */}
        <div className="absolute bottom-24 right-4 opacity-20" style={{ transform: "translateZ(15px)" }}>
          {[8, 6, 10, 4, 7].map((w, i) => (
            <div key={i} className="bg-indigo-400 mb-1 animate-pulse" style={{ width: `${w * 4}px`, height: "2px", animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
