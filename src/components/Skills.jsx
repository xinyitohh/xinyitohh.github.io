import { SKILLS } from "../constants/index";
import { ICON_MAP } from "../constants/skillIcons";

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
