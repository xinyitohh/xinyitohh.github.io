import { EXPERIENCES } from "../constants";

const ExperienceItem = ({ experience, accent }) => (
    <div className="relative pl-8 pb-10 last:pb-0">
        <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-white ring-2 ${accent ? 'bg-indigo-500 ring-indigo-200' : 'bg-gray-400 ring-gray-200'}`} />
        <div className="absolute left-[5px] top-4 bottom-0 w-px bg-gray-100 last:hidden" />
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 mb-1">
            <h4 className="font-semibold text-gray-900">{experience.role}</h4>
            <span className="hidden sm:inline text-gray-300 mx-1">·</span>
            <span className="text-gray-600 text-sm">{experience.company}</span>
        </div>
        <p className="text-xs text-gray-400 mb-3">{experience.year}</p>
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line mb-3">
            {experience.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
            {experience.technologies.map((tech, i) => (
                <span
                    key={i}
                    className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                >
                    {tech}
                </span>
            ))}
        </div>
    </div>
);

const Experience = () => {
    const workExp = EXPERIENCES.filter(e => e.type === 'work');
    const otherExp = EXPERIENCES.filter(e => e.type === 'other');

    return (
        <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-10">Experience</h2>

            <div className="mb-10">
                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-6">
                    Work Experience
                </p>
                {workExp.map((exp, i) => (
                    <ExperienceItem key={i} experience={exp} accent={true} />
                ))}
            </div>

            <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
                    Part-time Experience
                </p>
                {otherExp.map((exp, i) => (
                    <ExperienceItem key={i} experience={exp} accent={false} />
                ))}
            </div>
        </section>
    );
};

export default Experience;
