export type Entry = {
  kind: "education" | "work";
  title: string;
  org: string;
  place?: string;
  start?: string;
  end: string;
  bullets: string[];
};

export const experience: Entry[] = [
  {
    kind: "education",
    title: "B.S. Computer Science (Machine Learning) and Finance",
    org: "University of Maryland, College Park",
    end: "Expected May 2028",
    bullets: ["Dean's List, GPA 3.79"],
  },
  {
    kind: "work",
    title: "Developer",
    org: "Alongside AI, LLC",
    place: "Baltimore, MD",
    start: "April 2026",
    end: "August 2026",
    bullets: [
      "Built an internal Python library wrapping the Braintrust SDK to automate RAG pipeline evaluation.",
      "Built a lead generation pipeline that surfaces 2 qualified prospects daily from hiring and news signals, with personalized outreach and Slack lead cards.",
      "Deployed to AWS EC2 with Docker and GitHub Actions CI/CD, with a feedback loop learning from accept and reject decisions.",
    ],
  },
  {
    kind: "work",
    title: "Web Developer",
    org: "Bluenovo",
    place: "Columbia, MD",
    start: "May 2024",
    end: "August 2024",
    bullets: [
      "Designed and launched 5+ production websites with React, REST APIs, Tailwind, and Bootstrap, improving page load times by 30%.",
      "Ensured cross-device compatibility across desktop, tablet, and mobile.",
    ],
  },
  {
    kind: "work",
    title: "Robotic Process Automation Developer",
    org: "Medcor Group",
    place: "Orange, CA",
    start: "July 2023",
    end: "August 2023",
    bullets: [
      "Built UiPath workflows that cut manual data processing time by 60%.",
      "Designed and tested rule-based categorization logic to improve data accuracy.",
    ],
  },
  {
    kind: "work",
    title: "Natural Language Processing Engineer",
    org: "Barcelona Supercomputing Center",
    place: "Barcelona, Spain",
    start: "June 2023",
    end: "July 2023",
    bullets: [
      "Developed an NLP classification model with 98% test accuracy on confidential patient data.",
      "Built preprocessing, feature extraction, and evaluation pipelines for healthcare datasets.",
    ],
  },
];
