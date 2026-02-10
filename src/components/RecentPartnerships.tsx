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
    // Stretch to fill the full height of the bottom-right grid cell so spacing can be controlled precisely
    <div className="flex h-full w-full min-w-0 flex-col overflow-visible">
      <div className="border-b border-white/30 w-full mb-2 pb-1 flex-shrink-0" style={{ borderBottomWidth: "1px" }} aria-hidden />
      <SectionHeading className="mb-2 flex-shrink-0" underline underlineGray>
        RECENT PARTNERSHIPS
      </SectionHeading>

      {/* Cards: sit as a fixed stack at the bottom of the column; any extra height is placed above the first card, not between cards */}
      <div className="mt-auto flex flex-col gap-4">
        {PARTNERSHIP_INTERNSHIP_ITEMS.map((item, i) => (
          <React.Fragment key={i}>
            <article
              key={i}
              className="flex w-full min-w-0 flex-col overflow-visible"
            >
              {/* Image and text: side-by-side, flex-nowrap so text never wraps under image; image never shrinks */}
              <div className="flex flex-row flex-nowrap items-end gap-3 overflow-visible">
                {/* Single horizontal image: fixed size so row height is predictable; text stays beside it */}
                <div className="relative h-[7rem] w-[11.25rem] flex-shrink-0 overflow-hidden rounded-sm bg-[#1a1a1a]">
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
                  {/* Body text is clamped to keep both cards the same height and avoid extra vertical drift */}
                  <p className="m-0 mt-1 text-sm font-mono leading-relaxed text-white clamped-body">
                    {item.body}…
                  </p>
                </div>
              </div>
              {/* Full-width line under entire card — extends to right edge of column (aligns with left column lines) */}
              <div className="mt-3 w-full min-w-full flex-shrink-0 border-b border-white/30" style={{ borderBottomWidth: "1px" }} aria-hidden />
            </article>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
