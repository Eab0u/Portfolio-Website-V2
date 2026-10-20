export type Project = {
  slug: string;
  title: string;
  context: string;
  period: string;
  summary: string;
  tags: string[];
  links: { live: string | null; repo: string | null };
};

// Links marked null are filled in by Rahul later.
export const projects: Project[] = [
  {
    slug: "umd-nutrition-tracker",
    title: "UMD Nutrition Tracker",
    context: "Bitcamp Hackathon, University of Maryland",
    period: "April 2026",
    summary:
      "A cross-platform app that scrapes live UMD dining hall nutrition data for meal logging and personalized macro and calorie tracking. Built with a team of 3 and shipped to iOS and Android from one codebase.",
    tags: ["React Native", "Expo", "FastAPI", "Firebase", "Playwright"],
    links: { live: null, repo: null },
  },
  {
    slug: "catalan-petition-website",
    title: "Catalan Petition Website",
    context: "Generalitat de Catalunya",
    period: "June 2025 to present",
    summary:
      "A public petition platform with real-time counters, GDPR-compliant data handling, and layered security including hCaptcha and SHA-256 hashing.",
    tags: ["React", "TypeScript", "Vite", "Firebase"],
    links: { live: null, repo: null },
  },
  {
    slug: "dataaids",
    title: "DataAids Nonprofit Platform",
    context: "Founder",
    period: "May 2022 to August 2024",
    summary:
      "A nonprofit platform delivering custom software to 7 small nonprofits, including internal tools and dashboards for reporting and donor tracking.",
    tags: ["Web", "Dashboards", "Nonprofit"],
    links: { live: "https://dataaids.org/", repo: null },
  },
];
