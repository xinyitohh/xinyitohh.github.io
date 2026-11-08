// Icons for the WakaTime section's Editors, Categories and Operating systems cards.
// Names come from WakaTime and are not always spelled the same way ("VS Code" vs
// "Visual Studio Code"), so each list is a set of regex rules; the first match wins.
// AI tool logos come from Lobe Icons (MIT): https://github.com/lobehub/lobe-icons
import { createElement } from "react";
import {
  VisualStudioCode, Android, OpenAI, NeoVim, Vim, Sublime,
  Atom, Chrome, Firefox, Brave, Edge, Safari, Figma, Canva, Postman, Notion,
} from "developer-icons";
import antigravitySvg from "@lobehub/icons-static-svg/icons/antigravity-color.svg";
import claudeSvg from "@lobehub/icons-static-svg/icons/claude-color.svg";
import claudeCodeSvg from "@lobehub/icons-static-svg/icons/claudecode-color.svg";
import cursorSvg from "@lobehub/icons-static-svg/icons/cursor.svg";
import codexSvg from "@lobehub/icons-static-svg/icons/codex-color.svg";
import copilotSvg from "@lobehub/icons-static-svg/icons/copilot-color.svg";
import geminiSvg from "@lobehub/icons-static-svg/icons/gemini-color.svg";
import kiroSvg from "@lobehub/icons-static-svg/icons/kiro-color.svg";
import traeSvg from "@lobehub/icons-static-svg/icons/trae-color.svg";
import windsurfSvg from "@lobehub/icons-static-svg/icons/windsurf.svg";
import qoderSvg from "@lobehub/icons-static-svg/icons/qoder-color.svg";
import opencodeSvg from "@lobehub/icons-static-svg/icons/opencode.svg";
import clineSvg from "@lobehub/icons-static-svg/icons/cline.svg";
import { FaWindows, FaApple, FaLinux } from "react-icons/fa";
import {
  LuCodeXml, LuBox, LuTerminal,
  LuCode, LuBot, LuSearchCode, LuFileText, LuGitPullRequest, LuPalette, LuGlobe,
  LuSearch, LuFlaskConical, LuHammer, LuGraduationCap, LuUsers, LuMessageSquare,
  LuListChecks, LuNotebookPen, LuWrench, LuLayers,
} from "react-icons/lu";

// <img> (not inline SVG) so the SVGs' internal ids can't clash on one page.
const img = (src) =>
  function LobeIcon({ size = 18 }) {
    return createElement("img", { src, width: size, height: size, alt: "", draggable: false });
  };

const EDITOR_RULES = [
  [/antigravity/i, img(antigravitySvg)],
  [/vs ?code|visual studio code/i, VisualStudioCode],
  [/claude code/i, img(claudeCodeSvg)],
  [/claude/i, img(claudeSvg)],
  [/cursor/i, img(cursorSvg)],
  [/windsurf/i, img(windsurfSvg)],
  [/kiro/i, img(kiroSvg)],
  [/trae/i, img(traeSvg)],
  [/qoder/i, img(qoderSvg)],
  [/opencode/i, img(opencodeSvg)],
  [/cline/i, img(clineSvg)],
  [/gemini/i, img(geminiSvg)],
  [/android studio/i, Android],
  [/intellij|pycharm|webstorm|phpstorm|clion|rider|goland|datagrip|rubymine|rustrover|appcode|dataspell|jetbrains/i, LuCodeXml],
  [/copilot/i, img(copilotSvg)],
  [/codex/i, img(codexSvg)],
  [/openai/i, OpenAI],
  [/neovim/i, NeoVim],
  [/\bvim\b/i, Vim],
  [/sublime/i, Sublime],
  [/\batom\b/i, Atom],
  [/chrome/i, Chrome],
  [/firefox/i, Firefox],
  [/brave/i, Brave],
  [/\bedge\b/i, Edge],
  [/safari/i, Safari],
  [/figma/i, Figma],
  [/canva/i, Canva],
  [/postman/i, Postman],
  [/notion/i, Notion],
  [/blender/i, LuBox],
  [/terminal|powershell|bash|\bcmd\b/i, LuTerminal],
];

// Order matters: "AI Coding" must be tested before plain "Coding".
const CATEGORY_RULES = [
  [/ai coding/i, LuBot],
  [/writing tests|running tests|manual testing|testing/i, LuFlaskConical],
  [/writing docs|documentation/i, LuFileText],
  [/code review/i, LuGitPullRequest],
  [/debug/i, LuSearchCode],
  [/coding/i, LuCode],
  [/design/i, LuPalette],
  [/brows/i, LuGlobe],
  [/research/i, LuSearch],
  [/build/i, LuHammer],
  [/learn/i, LuGraduationCap],
  [/meeting/i, LuUsers],
  [/communicat/i, LuMessageSquare],
  [/plan/i, LuListChecks],
  [/note/i, LuNotebookPen],
  [/support/i, LuWrench],
  [/index/i, LuLayers],
];

const OS_RULES = [
  [/windows/i, FaWindows],
  [/\bmac|apple|darwin/i, FaApple],
  [/linux|ubuntu|debian/i, FaLinux],
];

const RULES = { editors: EDITOR_RULES, categories: CATEGORY_RULES, os: OS_RULES };

// Returns an icon component for a WakaTime name, or undefined (the caller shows a dot).
export const iconFor = (kind, name) =>
  RULES[kind]?.find(([re]) => re.test(name))?.[1];
