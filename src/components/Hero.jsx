import pic1 from '/assets/toh_xin_yi.jpg';
import { HERO_CONTENT } from '../constants/index';

const Hero = () => {
    return (
        <section className="max-w-4xl mx-auto px-6 py-20 lg:py-28">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
                <div className="flex-1 text-center lg:text-left">
                    <p className="text-sm font-medium text-indigo-500 uppercase tracking-widest mb-4">
                        Software Engineering Student
                    </p>
                    <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight">
                        Hi, I'm Xin Yi
                    </h1>
                    <p className="text-gray-500 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                        {HERO_CONTENT}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
                        <a
                            href="mailto:xinyitoh74@gmail.com"
                            className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Get in touch
                        </a>
                        <a
                            href="https://github.com/xinyitohh"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:border-gray-400 transition-colors"
                        >
                            GitHub
                        </a>
                    </div>
                </div>
                <div className="flex-shrink-0">
                    <img
                        src={pic1}
                        alt="Toh Xin Yi"
                        className="w-48 h-48 lg:w-56 lg:h-56 rounded-full object-cover ring-4 ring-indigo-100"
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;
