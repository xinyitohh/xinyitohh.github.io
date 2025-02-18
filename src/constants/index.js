import java from "/assets/projects_uni/java.png";
import csharp from "/assets/projects_uni/csharp.png";
import hackathon from "/assets/projects_uni/hackathon.png";
export const HERO_CONTENT = `I am a passionate full stack developer with a knack for crafting robust and scalable web applications. With 5 years of hands-on experience, I have honed my skills in front-end technologies like React and Next.js, as well as back-end technologies like Node.js, MySQL, PostgreSQL, and MongoDB. My goal is to leverage my expertise to create innovative solutions that drive business growth and deliver exceptional user experiences.`;

export const ABOUT_TEXT = `I’m a second-year Software Engineering student passionate about technology and problem-solving.
 I have always been curious about how technology works behind the scenes since I was young and I love building solutions.
  I enjoy helping out and working with others, spreading kindness makes me happy. 
  Outside of coding, I like to be in natural surroundings ^_^`;

export const EXPERIENCES = [
  {
    year: "2024 - Present",
    role: "Enterprise Student Ambassador",
    company: "Asia Pacific University",
    description: `As a Student Ambassador for APU’s Enterprise Department, I support key events, facilitate networking, and assist student startups.

I provide on-site support for initiatives like the Enterprise Speaker Series, Accelerator Pitching Day, and Startup Weekend, handling logistics, registration and ushering, and certificate handling.

This role has enhanced my event management, communication, and leadership skills while expanding my network with entrepreneurs and industry leaders, fostering a lasting impact on APU’s startup community.`,
    technologies: ["Teamworking", "Communication"],
  }
];

export const PROJECTS = [
  {
    title: "Chatbot",
    description:
      "A conversational AI chatbot with image support and chat history functionality.\n\nLearnt how to call APIs, store data locally, and manage state using Provider.\n⠀",
    technologies: ["Flutter", "Gemini AI", "Provider", "Hive"],
    demo: "https://flutter-chatbot-f794f.web.app",
    github: "https://github.com/xinyitohh/Flutter_AI_Chatbot_Beginner",
  },
  {
    title: "Belonging Tracker",
    description:
      "A simple application to keep track of personal items, allowing you to easily record every item in daily life.\n\nLearnt how to store data locally and CRUD.\n⠀",
    technologies: ["Flutter", "Hive"],
    demo: "https://belonging-management.web.app",
    github: "https://github.com/xinyitohh/Belonging_management",
  },
  {
    title: "Food Ordering System",
    description:
      "An app that lets users select food items, add them to a cart, and proceed to checkout. (Built following a tutorial)\n\nLearnt how to work with Firebase Authentication, Firestore, and more complicated state management.\n\nAccount for demo:\na@gmail.com\n123456⠀",
    technologies: ["Flutter", "Firebase", "Provider"],
    demo: "https://food-delivery-e2de7.web.app/",
    github: "https://github.com/xinyitohh/Flutter_Food_Ordering",
  },
  {
    title: "Portfolio Website",
    description:
      "A personal portfolio website showcasing projects, skills, and contact information. (Built following a tutorial)\n\nLearnt the basic of React framework and TailwindCSS.\n⠀",
    technologies: ["React", "TailwindCSS"],
    demo: "https://xinyitohh.github.io/",
    github: "https://github.com/xinyitohh/xinyitohh.github.io",
  },
];

export const PROJECTS_UNI = [
  {
    title: "Hall Booking Management System",
    description:
      "I contributed to the admin section of a hall booking management system, implementing user management, including extra feature such as password reset via email and profile picture support.\n⠀",
    technologies: ["Java"],
    img: java,
    github: "https://github.com/xinyitohh/Java_Assignment_"
  },
  {
    title: "Club Management System",
    description:
      "I took part in admin section, implementing user management feature, including additional feature such as password reset via security questions, and a statistical chart overview.\n⠀",
    technologies: ["C#", "MicrosoftSQL"],
    img: csharp,
    github:"https://github.com/OscarLow02/IOOP-Group-Assignment"
  },
  {
    title: "Google Workspace Hackathon Project",
    description:
      "A streamlined HR Recruitment and Management System leveraging Google Workspace tools. I contributed to resume handling with Gemini AI, enhancing candidate matching efficiency.⠀",
    technologies: ["Apps Script", "AppSheet"],
    img: hackathon,
    github:"https://github.com/yeoyulelele/Google-Workspace-Hackathon"
  },

];

