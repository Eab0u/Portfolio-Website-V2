// Source of truth for personal info. Agents must only use facts from files in `content/`.
// Never invent personal facts. Phone and email are intentionally not included.

export const profile = {
  name: "Rahul Manchanda-Izquierdo",
  tagline: "CS and Finance student building AI, web, and 3D things.",
  bio: [
    "I study Computer Science (Machine Learning) and Finance at the University of Maryland, College Park.",
    "I build web apps, AI pipelines, and tools for nonprofits, from hackathon apps to production sites.",
    "When I am not coding, I play competitive volleyball and chase good food, languages, and trains.",
  ],
  links: {
    github: "https://github.com/Eab0u",
    linkedin: "https://linkedin.com/in/rahulmai",
    email: null as string | null,
  },
  skills: {
    languages: ["Python", "Java", "JavaScript", "C", "C#", "OCaml"],
    spoken: ["Spanish", "French", "Catalan"],
    tools: ["React", "TensorFlow", "PyTorch", "Pandas", "UiPath", "Firebase", "Tailwind", "Bootstrap"],
  },
  interests: [
    "Competitive volleyball",
    "Food culture",
    "Language learning",
    "Public transit systems",
    "Cinematography",
    "Football",
  ],
} as const;
