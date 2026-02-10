"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SectionHeading } from "./SectionHeading";
import { PARTNERSHIP_INTERNSHIP_ITEMS, ASSETS } from "@/content/articles";

/**
 * Right block: RECENT PARTNERSHIPS title (thin white underline) + 2 cards.
 * Cards sit at bottom of column (flex-1 justify-end) so bottom line aligns with EdTech/Autonomy; no entrance animation.
 */
export function RecentPartnerships() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex w-full min-w-0 flex-col overflow-visible">
      <div className="border-b border-white/30 w-full mb-2 pb-1 flex-shrink-0" style={{ borderBottomWidth: "1px" }} aria-hidden />
      <SectionHeading className="mb-2 flex-shrink-0" underline underlineGray>
        RECENT PARTNERSHIPS
      </SectionHeading>

      {/* Cards: no flex-1/min-h-0 so container never shrinks and text never clips or goes under image */}
      <div className="flex flex-col">
        {PARTNERSHIP_INTERNSHIP_ITEMS.map((item, i) => (
          <React.Fragment key={i}>
            <article key={i} className={`flex w-full min-w-0 flex-col overflow-visible ${i === 0 ? "pt-0" : "pt-4"} ${i === PARTNERSHIP_INTERNSHIP_ITEMS.length - 1 ? "pb-0" : "pb-4"}`}>
            {/* Image and text: side-by-side, flex-nowrap so text never wraps under image; image never shrinks */}
            <div className="flex flex-row flex-nowrap gap-3 items-end overflow-visible">
            {/* Single horizontal image: fixed size so row height is predictable; text stays beside it */}
            <div className="relative flex-shrink-0 w-[11.25rem] h-[7rem] overflow-hidden rounded-sm bg-[#1a1a1a]">
              {!imgError ? (
                <Image
                  src={ASSETS.internshipLearnGrow}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="11.25rem"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="absolute inset-0" aria-hidden />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <time className="block font-mono text-xs text-white/60">
                {item.date}
              </time>
              <p className="mt-1 text-sm leading-relaxed text-white font-mono m-0">
                {item.body}…
              </p>
            </div>
            </div>
            {/* Full-width line under entire card — extends to right edge of column (longer, aligns with left column lines) */}
            <div className="mt-3 min-w-full w-full flex-shrink-0 border-b border-white/30" style={{ borderBottomWidth: "1px" }} aria-hidden />
          </article>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
