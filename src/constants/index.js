import taggoArchitecture from "/assets/projects/taggo-architecture.png";
import mediBookArchitecture from "/assets/projects/medibook-architecture.png";

import taggoMobileHome from "/assets/projects/taggo/mobile-home.jpg";
import taggoMobileSearch from "/assets/projects/taggo/mobile-search.png";
import taggoMobileBarcode from "/assets/projects/taggo/mobile-barcode.png";
import taggoMobileProduct from "/assets/projects/taggo/mobile-product.png";
import taggoMobileChatbot from "/assets/projects/taggo/mobile-chatbot.png";
import taggoMobileShoppingList from "/assets/projects/taggo/mobile-shopping-list.png";
import taggoMobileOptimization from "/assets/projects/taggo/mobile-optimization.png";
import taggoAdminDashboard from "/assets/projects/taggo/admin-dashboard.png";
import taggoAdminProducts from "/assets/projects/taggo/admin-products.png";
import taggoAdminPrices from "/assets/projects/taggo/admin-prices.png";
import taggoMerchantDashboard from "/assets/projects/taggo/merchant-dashboard.png";
import taggoMerchantAnalytics from "/assets/projects/taggo/merchant-analytics.png";

export const HERO_CONTENT = `Final-year Software Engineering student (CGPA 3.59) with production internship experience at iFAST Global Hub AI, shipping Flutter features across two live fintech apps used across Singapore and UK.`;

export const ABOUT_TEXT = `Final year Software Engineering student at APU (CGPA 3.59). I interned at iFAST Global Hub AI building Flutter features for enterprise banking apps across Singapore and the UK, which gave me hands-on experience in writing maintainable, production-grade code. I'm passionate about what I do and love inspiring others with it. (just like how others inspired me!)
Outside of coding, I like to be in natural surroundings ^_^`;

export const EXPERIENCES = [
  {
    type: "work",
    year: "May 2025 – Sep 2025",
    role: "Mobile Application Developer Intern",
    company: "iFAST Global Hub AI",
    description: `Delivered features across two production fintech apps — iFAST Global Bank and FSMOne Singapore — including currency converter, beneficiary management flows, bond market range orders, and account opening enhancements, within Agile sprint cycles.

Independently researched and implemented a complex scroll-over-fullscreen drawer effect for a pre-login UI revamp, delivered within a 2-week timeline; implementation adopted in production.

Proposed and implemented an in-place scroll-to-top interaction for the FAQ search experience to replace a legacy popup design; solution was reviewed, approved, and shipped.

Traced a localization date formatting bug across multiple languages to a shared core library; communicated findings, resulting in appropriate escalation and resolution.

Diagnosed an Android SDK 35/36 edge-to-edge configuration issue; independently researched and implemented the correct opt-out solution, clearing a blocker for the team.`,
    technologies: ["Flutter", "Dart", "Jira", "GitLab", "Agile/Scrum"],
  },
  {
    type: "other",
    year: "Nov 2025 – Present",
    role: "Part-Time Python Tutor",
    company: "Elixir Lab · Remote (Singapore)",
    description: `Designed and delivered a Python coding curriculum for primary school students in Singapore, introduced remotely via live Zoom classes.

Pioneered the curriculum for a new pilot program at a traditional tuition centre — creating engaging slide decks and project-based lessons to simplify complex concepts. Introduced AI and computational thinking concepts to beginners through interactive exercises.`,
    technologies: ["Python", "Teaching", "Curriculum Design"],
  },
  {
    type: "other",
    year: "Jan 2026 – Present",
    role: "STEM Coding Tutor",
    company: "Twin Bears Art Studio",
    description: `Deliver a weekly Coding & Crafting STEM ECA class using micro:bit for primary students at an international school in KL.

Translate technical programming and electronics concepts for non-technical audiences, making hands-on hardware coding accessible and engaging for young learners.`,
    technologies: ["micro:bit", "STEM Education"],
  },
  {
    type: "other",
    year: "Mar 2026 – Present",
    role: "Coding & Robotics Trainer",
    company: "Eduvision",
    description: `Teach a weekly coding and robotics ECA class to primary students at an international school in KL using VEXcode VR.

Guide students through virtual robotics programming challenges, building problem-solving and computational thinking skills in a fun, gamified environment.`,
    technologies: ["VEXcode VR", "Robotics", "STEM Education"],
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

The system features a Flutter mobile app for consumer searches, a Next.js admin and merchant dashboard, and a Spring Boot REST API backend. Community-driven price submissions are validated through statistical anomaly detection, user trust scores, and peer reviews.

Data is managed using NeonDB (PostgreSQL) for product and price history, Elasticsearch for full-text search, and Redis for caching. Image uploads go through Cloudflare R2. Firebase Auth handles authentication across all clients. Resend powers merchant email notifications.

Integrated Google Gemini AI (Gemma 3) for a RAG-based chatbot with Text-to-SQL for natural language price queries, alongside Google Places API for store enrichment and Open Food Facts for product data. Mobile CI/CD is automated via Codemagic, with Sentry for real-time error tracking.`,
    architectureDesc: `Three-tier architecture: Flutter mobile + Next.js admin/merchant dashboard on the frontend (deployed on Vercel), Spring Boot REST API backend (hosted on Railway), and NeonDB (PostgreSQL) + Elasticsearch + Redis on DigitalOcean for data and search. Firebase Auth secures all clients. Cloudflare R2 handles image storage. Gemini AI powers the RAG chatbot. Google Places API and Open Food Facts enrich product and store data. Resend handles email. Sentry for observability. Codemagic + GitHub for mobile CI/CD.`,
    technologies: [
      "Flutter",
      "Spring Boot",
      "Next.js",
      "PostgreSQL",
      "Elasticsearch",
      "Redis",
      "Firebase",
      "Cloudflare R2",
      "Gemini AI",
      "Codemagic",
      "Sentry",
      "Railway",
      "Vercel",
    ],
    screenshots: [
      taggoMobileHome,
      taggoMobileSearch,
      taggoMobileBarcode,
      taggoMobileProduct,
      taggoMobileChatbot,
      taggoMobileShoppingList,
      taggoMobileOptimization,
      taggoAdminDashboard,
      taggoAdminProducts,
      taggoAdminPrices,
      taggoMerchantDashboard,
      taggoMerchantAnalytics,
    ],
    architectureImg: taggoArchitecture,
  },
  {
    featured: true,
    title: "MediBook — Healthcare Appointment System",
    subtitle:
      "Designing and Developing Applications on Cloud (DDAC) · 2026 · Ongoing",
    description: `MediBook is a scalable, production-ready healthcare appointment system built as a comprehensive cloud computing project on AWS.

Intentionally engineered to go far beyond baseline academic requirements, the system simulates a real-world enterprise-grade AWS environment. Patients can securely book appointments, interact with an AI-powered health assistant, and receive automated appointment reminders via email.

The standout feature is an AI chatbot (Amazon Lex + Bedrock Claude) that allows patients to book appointments through natural conversation — selecting specialty, choosing a doctor, and confirming a time slot, all without leaving the chat.`,
    architectureDesc: `ASP.NET backend containerised via Docker, stored in Amazon ECR, and deployed to Elastic Beanstalk. The React frontend is hosted on S3 and distributed globally via CloudFront, with Route 53 DNS and ACM SSL. A fully automated GitHub Actions CI/CD pipeline handles zero-touch deployments and CloudFront cache invalidations, with Terraform managing infrastructure as code (remote state on S3 + DynamoDB lock).

AI chatbot: Amazon Lex routes intents through API Gateway and Lambda — booking requests call back to the ASP.NET API, while complex queries fall back to Bedrock (Claude). Automated reminder pipeline: EventBridge (cron) triggers a Lambda that queues messages via SQS, which a Send Lambda consumes to dispatch emails through Resend. Data stored in RDS PostgreSQL with S3 for file uploads and CloudWatch for monitoring.`,
    technologies: [
      "AWS",
      "ASP.NET",
      "React",
      "Docker",
      "GitHub Actions",
      "Terraform",
      "Amazon Lex",
      "Bedrock",
      "EventBridge",
      "Lambda",
      "SQS",
      "RDS",
      "CloudFront",
      "Resend",
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

export const CERTIFICATIONS = [
  {
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    issued: "May 2026",
    badgeUrl: "https://www.credly.com/badges/16677254-c540-41c6-b49f-79f7101629e8/public_url",
    badgeImg: "https://images.credly.com/size/340x340/images/00634f82-b07f-4bbd-a6bb-53de397fc3a6/image.png",
  },
];

export const SKILLS = {
  Languages: ["Python", "Java", "Dart", "JavaScript", "C#", "C++", "SQL", "HTML/CSS"],
  "Frameworks & Tools": [
    "Flutter",
    "Spring Boot",
    "Next.js",
    "React",
    "ASP.NET",
    "Tailwind CSS",
    "Docker",
    "Terraform",
    "GitHub Actions",
    "Codemagic",
    "Firebase",
    "Cloudflare",
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
    "EventBridge",
    "SQS",
    "ECR",
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
