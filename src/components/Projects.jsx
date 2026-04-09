import { useState, useEffect, useCallback } from "react";
import { PROJECTS } from "../constants/index";

const Lightbox = ({ src, alt, onClose }) => {
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <img
                src={src}
                alt={alt}
                className="max-w-full max-h-full rounded-lg shadow-2xl object-contain"
                onClick={(e) => e.stopPropagation()}
            />
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl leading-none"
                aria-label="Close"
            >
                ×
            </button>
        </div>
    );
};

const ZoomIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 8a3 3 0 116 0A3 3 0 015 8z" />
        <path fillRule="evenodd" d="M8 14a6 6 0 100-12 6 6 0 000 12zm6.32-1.094l3.58 3.58a1 1 0 01-1.414 1.414l-3.58-3.58A8 8 0 1114.32 12.906z" clipRule="evenodd" />
    </svg>
);

const FeaturedCard = ({ project, onZoom }) => (
    <div className="rounded-xl border border-indigo-100 overflow-hidden mb-6 bg-white">
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
            {project.subtitle && (
                <span className="inline-block text-xs font-medium text-indigo-500 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-4">
                    {project.subtitle}
                </span>
            )}
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line mb-5">
                {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-5">
                {project.technologies.map((tech, i) => (
                    <span key={i} className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                        {tech}
                    </span>
                ))}
            </div>
            <div className="flex gap-2 flex-wrap">
                {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                        className="px-4 py-2 border border-gray-200 text-gray-700 text-sm rounded-lg hover:border-gray-400 transition-colors">
                        GitHub
                    </a>
                )}
                {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer"
                        className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
                        Live Demo
                    </a>
                )}
            </div>
        </div>

        {project.screenshots?.length > 0 && (
            <div className="border-t border-gray-100 p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Screenshots</p>
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
                    {project.screenshots.map((src, i) => (
                        <img
                            key={i}
                            src={src}
                            alt={`${project.title} screenshot ${i + 1}`}
                            className="h-64 w-auto flex-shrink-0 rounded-lg border border-gray-200 snap-start object-cover"
                        />
                    ))}
                </div>
            </div>
        )}

        {project.architectureImg && (
            <div className="border-t border-gray-100">
                <div className="p-6 pb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Architecture</p>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                        {project.architectureDesc}
                    </p>
                </div>
                <div className="relative group cursor-zoom-in overflow-hidden" onClick={() => onZoom(project.architectureImg, `${project.title} architecture diagram`)}>
                    <img
                        src={project.architectureImg}
                        alt={`${project.title} architecture diagram`}
                        className="w-full object-contain bg-gray-50 p-4 transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                        <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-gray-600 text-xs px-2.5 py-1.5 rounded-full shadow-sm border border-gray-200/80">
                            <ZoomIcon />
                            Zoom
                        </span>
                    </div>
                </div>
            </div>
        )}
    </div>
);

const ProjectCard = ({ project }) => (
    <div className="flex flex-col rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow bg-white">
        <div className="flex flex-col flex-1 p-5">
            <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 whitespace-pre-line">
                {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
                {project.technologies.map((tech, i) => (
                    <span key={i} className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {tech}
                    </span>
                ))}
            </div>
            <div className="flex gap-2 flex-wrap">
                {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                        className="px-4 py-1.5 border border-gray-200 text-gray-700 text-sm rounded-lg hover:border-gray-400 transition-colors">
                        GitHub
                    </a>
                )}
                {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer"
                        className="px-4 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
                        Live Demo
                    </a>
                )}
            </div>
        </div>
    </div>
);

const Projects = () => {
    const [lightbox, setLightbox] = useState(null);
    const handleClose = useCallback(() => setLightbox(null), []);
    const featured = PROJECTS.filter(p => p.featured);
    const rest = PROJECTS.filter(p => !p.featured);

    return (
        <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-10">Projects</h2>
            {featured.map((p, i) => (
                <FeaturedCard key={i} project={p} onZoom={(src, alt) => setLightbox({ src, alt })} />
            ))}
            {rest.length > 0 && (
                <>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
                        Other Projects
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {rest.map((p, i) => <ProjectCard key={i} project={p} />)}
                    </div>
                </>
            )}
            {lightbox && (
                <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={handleClose} />
            )}
        </section>
    );
};

export default Projects;
