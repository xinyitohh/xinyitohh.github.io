import { SKILLS } from "../constants/index";

const Skills = () => {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-10">Skills</h2>
      <div className="space-y-5">
        {Object.entries(SKILLS).map(([category, items]) => (
          <div key={category} className="flex flex-col sm:flex-row gap-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest sm:w-44 sm:flex-shrink-0 pt-1">
              {category}
            </span>
            <div className="flex flex-wrap gap-2">
              {items.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
