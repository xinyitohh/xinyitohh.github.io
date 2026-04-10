import taggoArchitecture from "/assets/projects/taggo-architecture.png";
import mediBookArchitecture from "/assets/projects/medibook-architecture.png";

export const HERO_CONTENT = `I interned at iFAST Global Hub AI building Flutter features for production banking apps. Currently building Taggo, a full-stack crowdsourced grocery price comparison platform, as my Final Year Project.`;

export const ABOUT_TEXT = `Final year Software Engineering student at APU. I interned at iFAST building Flutter features for enterprise banking apps, which gave me hands-on experience in writing maintainable, production-grade code. I'm passionate about what I do and love inspiring others with it. (just like how others inspired me!)
Outside of coding, I like to be in natural surroundings ^_^`;

export const EXPERIENCES = [
  {
    type: "work",
    year: "May 2025 – Sep 2025",
    role: "Mobile Application Developer Intern",
    company: "iFAST Global Hub AI",
    description: `Developed and shipped production-ready features for two major fintech applications: iFAST Global Bank and FSMOne Singapore.

Collaborated within Agile sprint cycles to deliver diverse modules, including a currency converter, beneficiary flows, bond market range orders, and account opening enhancements. 

Proactively resolved critical technical blockers, notably investigating and fixing a native Android SDK 35/36 edge-to-edge configuration issue that had stalled the wider team.

Drove UX improvements by conceptualizing and implementing a seamless, in-place FAQ search experience, replacing a legacy popup design with a smooth, modern scroll-to-top transition that was deployed to production.

Led a large-scale codebase refactoring initiative to support Dark Mode and dynamic text accessibility, migrating over 200+ legacy screens to a standardized, theme-based architecture.`,
    technologies: ["Flutter", "Dart", "Jira", "GitLab", "Agile/Scrum"],
  },
  {
    type: "other",
    year: "Mar 2026 – Present",
    role: "Coding & Robotic Trainer",
    company: "Eduvision",
    description: `Teach a coding and robotics ECA class to primary students in an international school using VEXcode VR.`,
    technologies: ["VEXcode VR", "Robotics", "STEM Education"],
  },
  {
    type: "other",
    year: "Jan 2026 – Present",
    role: "STEM Coding Tutor",
    company: "Twin Bears Art Studio",
    description: `Deliver a Coding & Crafting STEM ECA class using micro:bit for international school primary students.`,
    technologies: ["micro:bit", "STEM Education"],
  },
  {
    type: "other",
    year: "Nov 2025 – Feb 2026",
    role: "Part-Time Python Tutor",
    company: "Elixir Lab · Remote (Singapore)",
    description: `Pioneered the curriculum for a new pilot Python coding program at a traditional tuition centre. 

Created engaging slide decks and project-based lessons to simplify complex concepts for primary students during the program's trial run. Introduced basic AI concepts and computational thinking via live Zoom classes.`,
    technologies: ["Python", "Teaching"],
  },
  {
    type: "other",
    year: "Apr 2024 – Dec 2025",
    role: "Enterprise Student Ambassador",
    company: "Asia Pacific University",
    description: `Supported the planning and execution of campus entrepreneurship initiatives, including Startup Weekend. Assisted with event logistics, participant coordination, and ensuring smooth operations for various student innovation events.`,
    technologies: ["Event Coordination", "Logistics", "Teamwork"],
  },
];

export const PROJECTS = [
  {
    featured: true,
    title: "Taggo — Grocery Price Comparison Platform",
    subtitle: "Final Year Project · 2026 · Ongoing",
    description: `Taggo is a full-stack, crowdsourced grocery price comparison platform designed to solve the problem of fragmented supermarket pricing in Malaysia.

The system features a Flutter mobile app for consumer searches, a Next.js admin dashboard for manual listing management, and a Spring Boot REST API backend. To ensure data integrity, I am designing a community-driven validation engine featuring statistical anomaly detection (filtering extreme outliers), user trust scores, and peer reviews.

Data is managed using serverless PostgreSQL (NeonDB) for product and price history, Elasticsearch for robust full-text search, and Redis for caching. Mobile CI/CD pipelines are automated via Codemagic for iOS builds, utilizing AltStore for sideloading deployment, ngrok for local webhook testing, and Sentry for real-time error tracking and performance monitoring.

Currently integrating Gemini AI to power a RAG-based chatbot utilizing Text-to-SQL for natural language price queries, alongside exploring AI-assisted product detection from user photo submissions.`,
    architectureDesc: `Three-tier architecture: Flutter mobile + Next.js web on the frontend, Spring Boot REST API backend, and NeonDB (PostgreSQL) + Elasticsearch + Redis for data and search. Deployed across Railway (backend), Vercel (Next.js frontend), and DigitalOcean (Elasticsearch + Redis). Integrated with Sentry for application monitoring. Gemini AI integration in progress for RAG-powered natural language price queries and AI-assisted product detection.`,
    technologies: [
      "Flutter",
      "Spring Boot",
      "Next.js",
      "NeonDB",
      "Elasticsearch",
      "Redis",
      "Gemini AI",
      "Codemagic",
      "Sentry",
      "Railway",
      "Vercel",
      "DigitalOcean",
    ],
    screenshots: [],
    architectureImg: taggoArchitecture,
  },
  {
    featured: true,
    title: "MediBook — Healthcare Appointment System",
    subtitle:
      "Designing and Developing Applications on Cloud (DDAC) · 2026 · Ongoing",
    description: `MediBook is a highly scalable, production-ready healthcare appointment system built as a comprehensive cloud computing project.

Intentionally engineered to go far beyond baseline academic requirements, I architected this project to simulate a real-world, enterprise-grade AWS environment rather than a basic deployment. Patients can securely book appointments, interact with an AI-powered health assistant, and receive automated reminders. 

The application pushes technical boundaries by utilizing AWS Comprehend Medical to automatically extract and structure clinical entities from uploaded patient reports, streamlining data entry for medical professionals.`,
    architectureDesc: `The architecture features an ASP.NET backend containerised via Docker, stored in Amazon ECR, and deployed to Elastic Beanstalk. The React frontend is hosted on S3 and distributed via CloudFront. A fully automated GitHub Actions CI/CD pipeline handles zero-touch deployments and CloudFront cache invalidations.

The system heavily utilizes AWS Serverless components: an AI chatbot built with Amazon Lex and Bedrock (Claude) routed through API Gateway and Lambda; clinical entity extraction using Comprehend Medical; and a resilient automated reminder pipeline leveraging EventBridge (cron), SQS queues, Lambda, and SNS/SES. Data is stored in RDS PostgreSQL with S3 for secure file uploads and CloudWatch for comprehensive performance monitoring and X-Ray tracing.`,
    technologies: [
      "AWS",
      "ASP.NET",
      "React",
      "Docker",
      "GitHub Actions",
      "Amazon Lex",
      "Bedrock",
      "Comprehend Medical",
      "EventBridge",
      "Lambda",
      "SQS",
      "RDS",
      "CloudFront",
      "CI/CD",
    ],
    demo: "https://medibook.xinyitoh.com",
    screenshots: [],
    architectureImg: mediBookArchitecture,
  },
  {
    title: "Direct Booking AI Assistant POC",
    description:
      "Identified a business pain point for a local glamping hostel losing 20% of revenue to third-party booking platforms. Pitched and developed a technical Proof-of-Concept (POC) for a direct booking flow featuring a WhatsApp AI chatbot to automate inquiries and reservations.",
    technologies: ["Flutter", "n8n", "Twilio", "WhatsApp API"],
  },
];

export const BOOKS = [
  {
    title: "Spring Start Here",
    author: "Laurențiu Spilcă",
    status: "reading",
    cover: "https://www.oreilly.com/covers/urn:orm:book:9781617298691/300w/",
  },
  {
    title: "Head First Design Patterns",
    author: "Eric Freeman et al.",
    status: "reading",
    cover: "https://www.oreilly.com/covers/urn:orm:book:9781492077992/300w/",
  },
  {
    title: "Grokking Algorithms",
    author: "Aditya Bhargava",
    status: "read",
    cover:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFtIwyxZO45WugxJXK4P1VfnZzDO-U2PaypA&s",
  },
  {
    title: "System Design Interview",
    author: "Alex Xu",
    status: "queued",
    cover:
      "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1592265780i/54109255.jpg",
  },
  {
    title: "Head First Software Architecture",
    author: "Neal Ford et al.",
    status: "queued",
    cover: "https://www.oreilly.com/covers/urn:orm:book:9781098134341/300w/",
  },
  {
    title: "Flutter Engineering",
    author: "Majid Hajian",
    status: "queued",
    cover:
      "https://m.media-amazon.com/images/I/4112c8SJ2OL._SY445_SX342_FMwebp_.jpg",
  },
];

export const SKILLS = {
  Languages: ["Python", "Java", "Dart", "JavaScript", "C++", "SQL", "HTML/CSS"],
  "Frameworks & Tools": [
    "Flutter",
    "Spring Boot",
    "Next.js",
    "React",
    "ASP.NET",
    "Tailwind CSS",
    "Docker",
    "GitHub Actions",
    "Codemagic",
    "Sentry",
  ],
  "Cloud (AWS)": [
    "Elastic Beanstalk",
    "S3",
    "RDS",
    "CloudFront",
    "Route 53",
    "Lambda",
    "API Gateway",
    "Lex",
    "Bedrock",
    "Comprehend Medical",
    "EventBridge",
    "SQS",
    "SNS/SES",
    "CloudWatch",
  ],
  Concepts: [
    "Agile/Scrum",
    "RESTful APIs",
    "CI/CD",
    "Serverless Architecture",
    "Cloud-Native Design",
    "OOP",
  ],
};
