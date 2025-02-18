import logo from "/assets/a.png";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const Navbar = () => {
    return (
        <nav className="mb-20 flex items-center justify-between py-6 relative z-50"> 
            {/* Logo */}
            <div className="flex flex-shrink-0 items-center">
                <a href="/" className="flex items-center">
                    <img className="mx-2 w-10" src={logo} alt="Kevin Rush Logo" />
                </a>
            </div>
            
            {/* Social media icons */}
            <div className="m-8 flex items-center justify-center gap-4 text-2xl">
                <a 
                    href="https://www.linkedin.com/in/toh-xin-yi-" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                    className="hover:text-blue-500 transition-colors duration-300"
                >
                    <FaLinkedin />
                </a>
                <a 
                    href="https://github.com/xinyitohh" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="GitHub Profile"
                    className="hover:text-gray-800 transition-colors duration-300"
                >
                    <FaGithub />
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
