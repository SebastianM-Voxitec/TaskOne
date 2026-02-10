import { LatestResearch } from "@/components/LatestResearch";
import { RecentNews } from "@/components/RecentNews";
import { RecentPartnerships } from "@/components/RecentPartnerships";
import { EdTechBlock } from "@/components/EdTechBlock";
import { AutonomyBlock } from "@/components/AutonomyBlock";
import { PLACEHOLDER_BODY } from "@/content/articles";

// Use rem so spacing scales with browser zoom; equal left/right via .content-container
const CONTENT_GAP_REM = "1.5rem";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white font-mono overflow-x-hidden">
      {/* Centered container: equal left/right margin; rem padding so zoom scales correctly */}
      <div className="content-container py-6">
        {/* Top row: fixed 12-col grid — items-start so row height is content-based and text under image is never clipped */}
        <div
          className="grid grid-cols-12 items-start"
          style={{ gap: CONTENT_GAP_REM }}
        >
          <section className="min-w-0 col-span-7 overflow-visible flex flex-col">
            <LatestResearch />
          </section>
          <section className="min-w-0 col-span-5">
            <RecentNews />
          </section>
        </div>

        <div style={{ marginTop: CONTENT_GAP_REM, marginBottom: CONTENT_GAP_REM }} />

        {/* Bottom: fixed 3-col — EdTech | Autonomy | RECENT PARTNERSHIPS; row height is locked so cards align pixel-perfect */}
        <div
          className="grid grid-cols-3 items-stretch"
          style={{ gap: CONTENT_GAP_REM }}
        >
          <div className="col-span-2 flex min-h-0 flex-col">
            <div className="grid min-h-0 flex-1 grid-cols-2 items-end" style={{ gap: CONTENT_GAP_REM }}>
              <EdTechBlock />
              <AutonomyBlock />
            </div>
          </div>
          {/* Right column stretches to full row height so RECENT PARTNERSHIPS bottom lines align with left blocks */}
          <section className="flex w-full min-w-0 flex-col overflow-visible">
            <RecentPartnerships />
          </section>
        </div>
      </div>
    </main>
  );
}
