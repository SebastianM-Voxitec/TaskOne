"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SectionHeading } from "./SectionHeading";
import { RECENT_NEWS_ITEMS, ONTARIO_EDUCATION_PARAGRAPH, ASSETS } from "@/content/articles";

/**
 * Figma: RECENT NEWS has one rectangle image on the left, article paragraph below it,
 * and three article placeholders (date + body) stacked on the right. No underline on LATEST RESEARCH;
 * RECENT NEWS has thin solid white underline.
 */
export function RecentNews() {
  const rightRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // Animate right-column news cards only; layout metrics remain driven by CSS
    let ctx: { revert: () => void } | undefined;
    void import("gsap").then(({ default: gsap }) => {
      ctx = gsap.context(() => {
        gsap.from(rightRef.current?.children ?? [], {
          x: 12,
          duration: 0.35,
          stagger: 0.06,
          ease: "power2.out",
        });
      });
    });
    return () => { ctx?.revert(); };
  }, []);

  return (
    <div>
      <SectionHeading className="mb-4" underline>
        RECENT NEWS
      </SectionHeading>

      {/* Left: one rectangular image (AUTONOMY grid) fully displayed; right: news snippets — compact */}
      <div className="grid grid-cols-12 gap-5">
        {/* Rectangle image: aspect 4/3 so image is fully visible, object-contain avoids crop */}
        <div className="flex flex-col gap-3 col-span-5">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-[#1a1a1a]">
            {!imgError && (
              <Image
                src={ASSETS.autonomyGraphic}
                alt=""
                fill
                className="object-contain object-center"
                sizes="40vw"
                onError={() => setImgError(true)}
              />
            )}
            {imgError && <div className="absolute inset-0" aria-hidden />}
          </div>
          {/* Clamp left column paragraph so top grid row height is fixed across viewport widths */}
          <p className="text-sm leading-relaxed text-white clamped-body">
            {ONTARIO_EDUCATION_PARAGRAPH}
          </p>
        </div>

        {/* Right: three article placeholders — tight stack */}
        <div ref={rightRef} className="flex flex-col gap-0 col-span-7">
          {RECENT_NEWS_ITEMS.map((item, i) => (
            <div key={i} className="border-b border-white/10 py-3 first:pt-0 last:border-b-0 last:pb-0">
              <time className="mb-0.5 block font-mono text-xs text-white/60">
                {item.date}
              </time>
              {/* Clamp each news body so varying copy length does not push the RECENT NEWS column taller on Vercel */}
              <p className="text-sm leading-relaxed text-white clamped-body">
                {item.body}…
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
