import { FaLinkedin, FaGithub } from "react-icons/fa";

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                <span className="font-semibold text-gray-900 tracking-tight">Toh Xin Yi</span>
                <div className="flex items-center gap-5 text-xl text-gray-400">
                    <a
                        href="https://www.linkedin.com/in/toh-xin-yi-"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="hover:text-blue-500 transition-colors"
                    >
                        <FaLinkedin />
                    </a>
                    <a
                        href="https://github.com/xinyitohh"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="hover:text-gray-900 transition-colors"
                    >
                        <FaGithub />
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
