import taggoArchitecture from "/assets/projects/taggo-architecture.png";
import mediBookArchitecture from "/assets/projects/medibook-architecture.png";

export const HERO_CONTENT = `I interned at iFAST Global Hub AI building Flutter features for real production banking apps. Now building Taggo, a crowdsourced grocery price comparison platform, as my FYP.`;

export const ABOUT_TEXT = `Final year SE student at APU. I interned at iFAST building Flutter features for real banking apps, which taught me a lot about writing code that has to hold up. I'm passionate about what I do and love inspiring others with it. Outside of coding, I like to be in natural surroundings ^_^`;

// type: "work" → shown under Work Experience
// type: "other" → shown under Part-time & Teaching
export const EXPERIENCES = [
  {
    type: "work",
    year: "May 2025 – Sep 2025",
    role: "Mobile Application Developer Intern",
    company: "iFAST Global Hub AI",
    description: `Worked on two live fintech apps simultaneously — iFAST Global Bank and FSMOne Singapore — shipping features, UI revamps, and bug fixes across full sprint cycles from ticket to deployment.

Contributed to a wide range of modules: currency converter, beneficiary flow, customer feedback, debit card dispute, pre-login revamp, watchlist management, bond market orders, and more.

Took on two system-wide features toward the end of the internship — text size accessibility settings and dark mode — which required migrating hardcoded colours across 200+ UI pages to a theme-based approach.`,
    technologies: ["Flutter", "Dart", "Jira", "GitLab", "Agile/Scrum"],
  },
  {
    type: "other",
    year: "Mar 2026 – Present",
    role: "Coding & Robotic Trainer",
    company: "Eduvision",
    description: `Teach coding and robotics ECA class to primary students in an international school using VEXcode VR.`,
    technologies: ["VEXcode VR", "Robotics", "STEM Education"],
  },
  {
    type: "other",
    year: "Jan 2026 – Present",
    role: "STEM Coding Tutor",
    company: "Twin Bears Art Studio",
    description: `Delivered Coding & Crafting STEM classes using micro:bit for international school primary students.`,
    technologies: ["micro:bit", "STEM Education"],
  },
  {
    type: "other",
    year: "Nov 2025 – Feb 2026",
    role: "Part-Time Python Tutor",
    company: "Elixir Lab · Remote (Singapore)",
    description: `Pioneered delivery of a pilot Python course; redesigned teaching materials to improve student concept retention and engagement.

Taught Python programming to primary students via live Zoom. Introduced basic AI concepts and computational thinking.`,
    technologies: ["Python", "Teaching", "Curriculum Design"],
  },
  {
    type: "other",
    year: "Apr 2024 – Dec 2025",
    role: "Enterprise Student Ambassador",
    company: "Asia Pacific University",
    description: `Mentored student startup teams using entrepreneurial design thinking; co-coordinated Startup Weekend and other key innovation events.

Built technical Proof-of-Concepts (POCs) using Flutter, n8n, and Twilio to validate business viability for early-stage student startups.`,
    technologies: ["Flutter", "n8n", "Twilio", "Communication"],
  },
];

// featured: true → rendered as a full-width highlighted card
// img: replace with architecture diagram once available
export const PROJECTS = [
  {
    featured: true,
    title: "Taggo — Grocery Price Comparison Platform",
    subtitle: "Final Year Project · Ongoing",
    description: `Taggo is a crowdsourced grocery price comparison platform — built because grocery prices in Malaysia vary a lot across supermarkets and there's no good way to compare them without physically going.

The platform has three parts: a Flutter mobile app for consumers to search and compare prices across stores, a Next.js admin dashboard for managing listings and reviewing submissions, and a Spring Boot backend handling REST APIs and the crowdsource contribution flow with validation logic.

PostgreSQL stores product data, price history, and multi-store comparisons. Elasticsearch powers full-text product search, Redis handles caching. Deployed across Railway, Vercel, and DigitalOcean.

Currently integrating Gemini AI for a RAG-powered chatbot that lets users query prices in natural language. Also exploring AI-assisted product detection from user photo submissions.`,
    architectureDesc: `Three-tier architecture: Flutter mobile + Next.js web on the frontend, Spring Boot REST API backend, and PostgreSQL + Elasticsearch + Redis for data and search. Deployed across Railway (backend), Vercel (Next.js frontend), and DigitalOcean (Elasticsearch + Redis). Gemini AI integration in progress for RAG-powered natural language price queries and AI-assisted product detection from photo submissions.`,
    technologies: ["Flutter", "Spring Boot", "Next.js", "PostgreSQL", "Elasticsearch", "Redis", "Gemini AI", "RAG", "Railway", "Vercel", "DigitalOcean"],
    screenshots: [], // add paths when available e.g. ["/assets/projects/taggo-1.jpg"]
    architectureImg: taggoArchitecture,
  },
  {
    featured: true,
    title: "MediBook — Healthcare Appointment System",
    subtitle: "Cloud Architecture & Application Development (DDAC) · 2026 · Ongoing",
    description: `MediBook is a healthcare appointment system built for DDAC — a module where the lecturer set a real-world standard: build something production-deployable and put it on your CV. Live at medibook.xinyitoh.com.

Patients can book appointments, chat with an AI assistant for health Q&A, and receive automated appointment reminders. Doctors manage schedules and patient records. The system extracts clinical entities from uploaded patient reports using AWS Comprehend Medical.`,
    architectureDesc: `ASP.NET backend containerised with Docker, stored in Amazon ECR, deployed to Elastic Beanstalk. React frontend on S3 + CloudFront. GitHub Actions CI/CD pipeline runs on every merge to main — builds Docker image, pushes to ECR, deploys to Elastic Beanstalk, uploads React build to S3, invalidates both CloudFront caches. No manual steps.

AI chatbot with Amazon Lex + Bedrock (Claude) for health Q&A and appointment booking intents. Comprehend Medical extracts clinical entities from uploaded patient reports. Serverless reminder pipeline: EventBridge (daily cron) → Lambda → SQS → Lambda → SNS/SES. RDS PostgreSQL, S3 for file uploads, CloudWatch for monitoring.`,
    technologies: ["AWS", "ASP.NET", "React", "Docker", "GitHub Actions", "Amazon Lex", "Bedrock", "Comprehend Medical", "EventBridge", "Lambda", "SQS", "RDS", "CloudFront", "CI/CD"],
    demo: "https://medibook.xinyitoh.com",
    screenshots: [], // add paths when available e.g. ["/assets/projects/medibook-1.jpg"]
    architectureImg: mediBookArchitecture,
  },
  {
    title: "AI Chatbot",
    description:
      "A conversational AI chatbot with image support and chat history, built with Flutter and Gemini AI. Learnt API integration, local storage with Hive, and state management using Provider.",
    technologies: ["Flutter", "Gemini AI", "Provider", "Hive"],
    demo: "https://flutter-chatbot-f794f.web.app",
    github: "https://github.com/xinyitohh/Flutter_AI_Chatbot_Beginner",
  },
  {
    title: "Food Ordering System",
    description:
      "A food ordering app with cart and checkout flow. Learnt Firebase Authentication, Firestore, and state management.\n\nDemo account: a@gmail.com / 123456",
    technologies: ["Flutter", "Firebase", "Provider"],
    demo: "https://food-delivery-e2de7.web.app/",
    github: "https://github.com/xinyitohh/Flutter_Food_Ordering",
  },
];

export const SKILLS = {
  "Languages": ["Python", "Java", "Dart", "JavaScript", "C++", "SQL", "HTML/CSS"],
  "Frameworks & Tools": ["Flutter", "Spring Boot", "Next.js", "React", "ASP.NET", "Tailwind CSS", "Docker", "GitHub Actions"],
  "Cloud (AWS)": ["Elastic Beanstalk", "S3", "RDS", "CloudFront", "Route 53", "Lambda", "API Gateway", "Lex", "Bedrock", "Comprehend Medical", "EventBridge", "SQS", "SNS/SES", "CloudWatch"],
  "Concepts": ["Agile/Scrum", "RESTful APIs", "CI/CD", "Serverless Architecture", "Cloud-Native Design", "OOP"],
};
