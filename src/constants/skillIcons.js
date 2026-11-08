// Icons shared by the Skills section and the WakaTime section.
import {
  Python, Java, Dart, JavaScript, CPlusPlus, HTML5, CSS3,
  Flutter, Spring, NextJs, React, CSharp, TailwindCSS, Docker, GitHubDark,
  AWS, PostgreSQL, Redis, Elastic, Railway, DigitalOcean, VercelDark,
  Git, GitLab, Jira, Firebase,
  TypeScript, PHP, Kotlin, Go, Swift, VueJs, Markdown,
  Ruby, C, Lua, Sass, SvelteJS, RustDark, MySQL,
} from "developer-icons";
import { createElement } from "react";
import { LuBraces, LuEllipsis } from "react-icons/lu";

// Flat coloured square with a short label, the same look as the JavaScript and TypeScript logos.
// Used where the icon set has no matching logo (or only a line icon that clashes with the rest).
const badge = (bg, label) =>
  function Badge({ size = 18, ...rest }) {
    return createElement(
      "svg",
      { viewBox: "0 0 24 24", width: size, height: size, role: "img", "aria-label": label, ...rest },
      createElement("rect", { width: 24, height: 24, rx: 3, fill: bg }),
      createElement("text", {
        x: 12, y: 16.4, textAnchor: "middle", fontSize: 11, fontWeight: 700, fill: "#fff",
        fontFamily: "Inter, system-ui, sans-serif",
      }, label)
    );
  };
const PowerShell = badge("#2671be", "PS");
const BashBadge = badge("#3b4650", "sh");
const TextBadge = badge("#9ca3af", "Tx");

export const ICON_MAP = {
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

// WakaTime's language names -> icon. Anything not listed gets a neutral dot.
export const LANGUAGE_ICONS = {
  "JavaScript": JavaScript,
  "TypeScript": TypeScript,
  "JSX":        React,
  "TSX":        React,
  "Python":     Python,
  "Java":       Java,
  "Dart":       Dart,
  "CSS":        CSS3,
  "HTML":       HTML5,
  "C++":        CPlusPlus,
  "C#":         CSharp,
  "C":          C,
  "PHP":        PHP,
  "Kotlin":     Kotlin,
  "Go":         Go,
  "Rust":       RustDark,
  "Swift":      Swift,
  "Ruby":       Ruby,
  "Lua":        Lua,
  "Vue.js":     VueJs,
  "Svelte":     SvelteJS,
  "Sass":       Sass,
  "SQL":        MySQL,
  "Bash":       BashBadge,
  "Markdown":   Markdown,
  "PowerShell": PowerShell,
  "Text":       TextBadge,
  "Other":      LuEllipsis, // WakaTime's bucket for files whose language it cannot tell
  "JSON":       LuBraces, // the official JSON swirl logo is hard to recognise at small sizes
};
