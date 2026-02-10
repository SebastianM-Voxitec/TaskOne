/**
 * Placeholder article copy for the design. Replace with real articles or CMS later.
 * Every text block on the page is driven from here so the layout matches the design exactly.
 */

export const PLACEHOLDER_BODY =
  "ARTIFICIAL INTELLIGENCE NOW GENERATES CODE FASTER THAN ENGINEERS AND GUIDES MISSILES WITH INHUMAN PRECISION, YET IN";

export const ONTARIO_EDUCATION_PARAGRAPH =
  "ONTARIO'S PUBLIC EDUCATION SYSTEM HAS A LONG TRADITION OF CLASSROOM-BASED INSTRUCTION, WHERE \"FACE TO FACE LEARNING\" WAS THE NORM, AND TEXTBOOKS AND LECTURES";

// LATEST RESEARCH
export const LATEST_RESEARCH = {
  headline: "HUMAN-IN-THE-LOOP IS THE FOUNDATION OF RESPONSIBLE AI",
  body: PLACEHOLDER_BODY,
};

// RECENT NEWS — 3 article placeholders on the right (date + body); Figma shows 10/03/2025 for each
export const RECENT_NEWS_ITEMS = [
  { date: "10/03/2025", body: PLACEHOLDER_BODY },
  { date: "10/03/2025", body: PLACEHOLDER_BODY },
  { date: "10/03/2025", body: PLACEHOLDER_BODY },
] as const;

// RECENT PARTNERSHIPS
export const PARTNERSHIP_EDTECH = {
  label: "ED TECH",
  title: "TRANSFORMING ONTARIO'S EDUCATION",
  body: PLACEHOLDER_BODY,
};

export const PARTNERSHIP_AUTONOMY_BODY = PLACEHOLDER_BODY;

export const PARTNERSHIP_INTERNSHIP_ITEMS = [
  { label: "LEARN + GROW", sublabel: "INTERNSHIP REFLECTIONS", date: "10/03/2025", body: PLACEHOLDER_BODY },
  { label: "LEARN + GROW", sublabel: "INTERNSHIP REFLECTIONS", date: "12/03/2025", body: PLACEHOLDER_BODY },
] as const;

// Image paths: public/assets/ — use uploaded mock PNGs (space in filename encoded as %20)
export const ASSETS = {
  latestResearchGraphic: "/assets/Human_in_the_loop_Voxitec_53a993300e%201.png",
  autonomyGraphic: "/assets/How_Autonomy_Drives_Successful_Mission_Execution_824dd3cd32%201.png",
  edtechCityscape: "/assets/Digital_transformation_of_Ontario_s_education_system_through_AI_and_technology_innovation_aae9271dbd%201.png",
  internshipLearnGrow: "/assets/Internship_Reflections_5f2e4d99db%201.png",
} as const;
