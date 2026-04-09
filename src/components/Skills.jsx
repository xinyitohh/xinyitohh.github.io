import {
  Python, Java, Dart, JavaScript, CPlusPlus, HTML5, CSS3,
  Flutter, Spring, NextJs, React, CSharp, TailwindCSS, Docker, GitHubDark,
  AWS, PostgreSQL, Redis, Elastic, Railway, DigitalOcean, VercelDark,
  Git, GitLab, Jira, Firebase,
} from "developer-icons";
import { SKILLS } from "../constants/index";

const ICON_MAP = {
  // Languages
  "Python":        Python,
  "Java":          Java,
  "Dart":          Dart,
  "JavaScript":    JavaScript,
  "C++":           CPlusPlus,
  "HTML/CSS":      HTML5,
  // Frameworks & Tools
  "Flutter":       Flutter,
  "Spring Boot":   Spring,
  "Next.js":       NextJs,
  "React":         React,
  "ASP.NET":       CSharp,
  "Tailwind CSS":  TailwindCSS,
  "Docker":        Docker,
  "GitHub Actions":GitHubDark,
  "Git":           Git,
  "GitLab":        GitLab,
  "Jira":          Jira,
  "Firebase":      Firebase,
  // Cloud — AWS services all use the AWS logo
  "AWS":                  AWS,
  "Elastic Beanstalk":    AWS,
  "S3":                   AWS,
  "RDS":                  AWS,
  "CloudFront":           AWS,
  "Route 53":             AWS,
  "Lambda":               AWS,
  "API Gateway":          AWS,
  "Lex":                  AWS,
  "Bedrock":              AWS,
  "Comprehend Medical":   AWS,
  "EventBridge":          AWS,
  "SQS":                  AWS,
  "SNS/SES":              AWS,
  "CloudWatch":           AWS,
  "ECR":                  AWS,
  // Other cloud
  "Railway":       Railway,
  "DigitalOcean":  DigitalOcean,
  "Vercel":        VercelDark,
  // Data
  "PostgreSQL":    PostgreSQL,
  "Redis":         Redis,
  "Elasticsearch": Elastic,
};

const SkillPill = ({ name }) => {
  const IconComponent = ICON_MAP[name];
  return (
    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 font-medium transition-colors">
      {IconComponent && <IconComponent size={16} />}
      {name}
    </span>
  );
};

const Skills = () => (
  <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-100">
    <h2 className="text-2xl font-bold text-gray-900 mb-10">Skills</h2>
    <div className="space-y-5">
      {Object.entries(SKILLS).map(([category, items]) => (
        <div key={category} className="flex flex-col sm:flex-row gap-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest sm:w-44 sm:flex-shrink-0 pt-1.5">
            {category}
          </span>
          <div className="flex flex-wrap gap-2">
            {items.map((skill) => (
              <SkillPill key={skill} name={skill} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Skills;
