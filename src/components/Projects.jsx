import React from 'react';
import { PROJECTS } from "../constants/index";

const Projects = () => {
  return (
    <div className='border-b border-neutral-900 pb-4'>
        
        <h2 className="my-20 text-center text-4xl text-gray-900">Projects</h2>
        <div>
            {PROJECTS.map((project, index) => (
                <div key={index} className='mb-8 flex flex-wrap lg:justify-center'>
                    <div className="w-full lg:w-1/4 ">
                    <iframe 
                        src={project.demo} 
                        title={project.title}
                        width="450"
                        height="650"
                        className="mb-6 rounded"
                        allowFullScreen
                        style={{position: 'relative', zIndex: 20, border: '2px solid #000'}}
                    ></iframe>
                    </div>
                    <div className="w-full max-w-xl lg:w-3/4  lg:ml-44">
                        <h6 className="mb-2 font-semibold text-gray-600">{project.title}</h6>
                        <p className="mb-4 text-neutral-500">
                            <div className="whitespace-pre-line">
                                {project.description}
                            </div>
                        </p>
                        {project.technologies.map((technology, index) => (
                            <span key={index} 
                                className="mr-2 rounded bg-neutral-400 px-2 py-1 text-sm font-medium text-white">
                                {technology}
                            </span>
                        ))}
                        <div className="mt-4 relative z-10">
                            {project.demo && (
                                <a href={project.demo} target="_blank" rel="noopener noreferrer">
                                    <button className="mr-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                                        Open in New Tab
                                    </button>
                                </a>
                            )}
                            {project.github && (
                                <a href={project.github} target="_blank" rel="noopener noreferrer">
                                    <button className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-900">
                                        GitHub
                                    </button>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}

export default Projects;
