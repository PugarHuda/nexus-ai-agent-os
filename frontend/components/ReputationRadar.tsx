"use client";

import { REPUTATION_DIMENSIONS } from "@/lib/constants";

interface Props {
  accuracy: number;
  reliability: number;
  safety: number;
  collaboration: number;
  size?: number;
}

/**
 * SVG radar chart showing agent reputation across 4 dimensions.
 * Values are 0-10000 (basis points). Displayed as percentages.
 */
export default function ReputationRadar({
  accuracy,
  reliability,
  safety,
  collaboration,
  size = 200,
}: Props) {
  const center = size / 2;
  const radius = size * 0.38;
  const values = [accuracy, reliability, safety, collaboration].map((v) => v / 10000);
  const angles = values.map((_, i) => (Math.PI * 2 * i) / 4 - Math.PI / 2);

  const getPoint = (angle: number, value: number) => ({
    x: center + Math.cos(angle) * radius * value,
    y: center + Math.sin(angle) * radius * value,
  });

  const dataPoints = values.map((v, i) => getPoint(angles[i], v));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid rings */}
        {rings.map((r) => (
          <polygon
            key={r}
            points={angles.map((a) => {
              const p = getPoint(a, r);
              return `${p.x},${p.y}`;
            }).join(" ")}
            fill="none"
            stroke="#374151"
            strokeWidth="0.5"
          />
        ))}

        {/* Axis lines */}
        {angles.map((a, i) => {
          const p = getPoint(a, 1);
          return (
            <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#374151" strokeWidth="0.5" />
          );
        })}

        {/* Data polygon */}
        <polygon points={dataPoints.map((p) => `${p.x},${p.y}`).join(" ")} fill="rgba(99,102,241,0.2)" stroke="#6366f1" strokeWidth="2" />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={REPUTATION_DIMENSIONS[i].color} />
        ))}

        {/* Labels */}
        {REPUTATION_DIMENSIONS.map((dim, i) => {
          const labelPoint = getPoint(angles[i], 1.25);
          return (
            <text
              key={dim.key}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] fill-gray-400"
            >
              {dim.label}
            </text>
          );
        })}
      </svg>

      {/* Score labels */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        {REPUTATION_DIMENSIONS.map((dim, i) => (
          <div key={dim.key} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dim.color }} />
            <span className="text-gray-400">{dim.label}:</span>
            <span className="text-white font-medium">{(values[i] * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
