"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SectionHeading } from "./SectionHeading";
import { ASSETS, PLACEHOLDER_BODY } from "@/content/articles";

export function LatestResearch() {
  const graphicRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // Clamp animation to the image container only so text position remains stable
    let ctx: { revert: () => void } | undefined;
    void import("gsap").then(({ default: gsap }) => {
      ctx = gsap.context(() => {
        gsap.from(graphicRef.current, { y: 24, duration: 0.5, ease: "power2.out" });
      });
    });
    return () => { ctx?.revert(); };
  }, []);

  return (
    <div className="flex min-w-0 flex-col overflow-visible">
      <SectionHeading className="mb-4 shrink-0" underline>LATEST RESEARCH</SectionHeading>

      {/* Image: shrink-0 keeps aspect box fixed so following content never overlaps; z-0 so text stays on top if overlap */}
      <div
        ref={graphicRef}
        className="relative z-0 aspect-[16/9] w-full shrink-0 overflow-hidden rounded-sm bg-[#1a1a1a]"
      >
        {!imgError && (
          <Image
            src={ASSETS.latestResearchGraphic}
            alt=""
            fill
            className="object-cover"
            onError={() => setImgError(true)}
          />
        )}
        {imgError && <div className="absolute inset-0" aria-hidden />}
      </div>

      {/* Wrapper keeps text block in flow below image with explicit margin; shrink-0 so it is never compressed under image */}
      <div className="relative z-10 mt-6 shrink-0 min-w-0 overflow-visible">
        {/* Clamp body copy so top row height does not change between localhost and Vercel on resize */}
        <p className="text-sm leading-relaxed text-white clamped-body">
          {PLACEHOLDER_BODY}…
        </p>
        {/* Divider line after description, aligned with image edges */}
        <div className="mt-2 border-b border-white/30 w-full" style={{ borderBottomWidth: "1px" }} aria-hidden />
      </div>
    </div>
  );
}
