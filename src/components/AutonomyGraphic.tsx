"use client";

import { useEffect, useRef } from "react";

// Reusable AUTONOMY grid graphic (V X T C / O I E pattern)
export function AutonomyGraphic({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    void import("gsap").then(({ default: gsap }) => {
      gsap.from(ref.current, {
        scale: 0.98,
        duration: 0.35,
        ease: "power2.out",
      });
    });
  }, []);

  const letters = [
    ["V", "X", "T", "C"],
    ["O", "I", "E", ""],
  ];

  return (
    <div
      ref={ref}
      className={`flex overflow-hidden rounded-sm border border-white/10 bg-white/5 ${className}`}
    >
      {/* Vertical AUTONOMY label */}
      <div className="flex flex-shrink-0 flex-col items-center justify-center gap-1 border-r border-white/10 bg-white/5 px-3 py-4">
        <span
          className="text-xs font-semibold tracking-widest text-white"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          AUTONOMY
        </span>
      </div>
      {/* Letter grid */}
      <div className="grid flex-1 grid-cols-4 grid-rows-2 gap-px bg-white/10 p-3">
        {letters.flat().map((char, i) => (
          <div
            key={i}
            className="flex items-center justify-center bg-[#0a0a0a] text-base font-medium text-white"
          >
            {char}
          </div>
        ))}
      </div>
    </div>
  );
}
