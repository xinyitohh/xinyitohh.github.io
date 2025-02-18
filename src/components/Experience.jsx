import { EXPERIENCES } from "../constants";

const Experience = () => {
    return (
        <div className="border-b border-neutral-900 pb-4">
            <h1 className="my-20 text-center text-4xl text-gray-900">Experience</h1>
            <div>
                {EXPERIENCES.map((experience, index) => (
                    <div key={index} className="mb-8 flex flex-wrap lg:justify-center">
                        <div className="w-full lg:w-1/4">
                            <p className="mb-2 text-sm text-neutral-500">{experience.year}</p>
                        </div>
                        <div className="w-full max-w-xl lg:w-3/4">
                            <h6 className="mb-2 font-semibold text-gray-700">
                                {experience.role} <br/>-{" "}
                                <span className="text-sm text-gray-700">
                                    {experience.company}
                                </span>
                            </h6>
                            <p className="mb-4 text-neutral-600 whitespace-pre-line text-justify">
                                {experience.description}
                            </p>
                            {experience.technologies.map((technology, index) => (
                                <span 
                                    key={index}
                                    className="mr-2 mt-4 rounded bg-neutral-400 px-2 py-1 text-sm font-medium text-white">
                                        {technology}
                                    </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Experience;