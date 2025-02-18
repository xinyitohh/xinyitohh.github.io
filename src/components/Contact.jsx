import React from 'react';
import { AiOutlineMail } from 'react-icons/ai';
import { AiOutlineLinkedin } from 'react-icons/ai';
import { AiOutlinePhone } from 'react-icons/ai';

function Contact() {
  return (
    <div className="border-b border-neutral-900 pt-2 pb-11 my-6 bg-slate-500 rounded-3xl">
        <h2 className="mt-8 mb-4 text-center text-4xl font-medium text-cyan-50">Get in Touch</h2>
        <div className="flex flex-col items-center justify-center space-y-4 text-lg text-gray-100">  
            <a
              href="https://www.linkedin.com/in/toh-xin-yi-"
              className="flex items-center no-underline text-gray-100 hover:text-blue-900 relative z-30"
            >
                <AiOutlineLinkedin className="mr-2" /> www.linkedin.com/in/toh-xin-yi-
            </a>
            <a
              href="mailto:xinyitoh74@gmail.com"
              className="flex items-center no-underline text-gray-100 hover:text-blue-900 relative z-30"
            >
              <AiOutlineMail className="mr-2" /> xinyitoh74@gmail.com
            </a>
            
            <a
              href="tel:+60182251767"
              className="flex items-center no-underline text-gray-100 hover:text-blue-900 relative z-30"
            >
              <AiOutlinePhone className="mr-2" /> +60 18-225 1767
            </a>
        </div>
    </div>
  );
}

export default Contact;
