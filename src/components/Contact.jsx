import { FaLinkedin, FaGithub } from "react-icons/fa";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";

const Contact = () => {
  return (
    <section id="contact" className="max-w-4xl mx-auto px-6 py-20 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Get in Touch</h2>
      <p className="text-gray-500 mb-10">
        Open to opportunities — feel free to reach out.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="mailto:xinyitoh74@gmail.com"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm hover:border-gray-400 transition-colors"
        >
          <AiOutlineMail className="text-base" />
          xinyitoh74@gmail.com
        </a>
        <a
          href="https://www.linkedin.com/in/toh-xin-yi-"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm hover:border-gray-400 transition-colors"
        >
          <FaLinkedin className="text-base text-blue-500" />
          LinkedIn
        </a>
        <a
          href="https://github.com/xinyitohh"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm hover:border-gray-400 transition-colors"
        >
          <FaGithub className="text-base" />
          GitHub
        </a>
        <a
          href="tel:+60182251767"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm hover:border-gray-400 transition-colors"
        >
          <AiOutlinePhone className="text-base" />
          +60 18-225 1767
        </a>
      </div>
    </section>
  );
};

export default Contact;
