"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { PARTNERSHIP_EDTECH, ASSETS } from "@/content/articles";

/** Left block: cityscape image, ED TECH + TRANSFORMING ONTARIO'S EDUCATION, article text below. */
export function EdTechBlock() {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="flex h-full w-full min-w-0 flex-col">
      <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-[#1a1a1a]">
        {!imgError && (
          <Image
            src={ASSETS.edtechCityscape}
            alt=""
            fill
            className="object-cover"
            onError={() => setImgError(true)}
          />
        )}
        {imgError && (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-xs text-white/50">
            Add edtech-cityscape.jpg to public/assets/
          </div>
        )}
        {/* No overlays — title/label are in the image asset */}
      </div>
      {/* Line between image and description — more space under image so line doesn't touch */}
      <div className="mt-5 border-b border-white/30 w-full" style={{ borderBottomWidth: "1px" }} aria-hidden />
      <p className="mt-5 min-h-0 flex-1 text-sm leading-relaxed text-white font-mono m-0">
        {PARTNERSHIP_EDTECH.body}…
      </p>
      {/* Bottom line — same left edge as text (no p margin), aligned with block (Figma) */}
      <div className="mt-5 min-w-full w-full flex-shrink-0 border-b border-white/30" style={{ borderBottomWidth: "1px" }} aria-hidden />
    </article>
  );
}
