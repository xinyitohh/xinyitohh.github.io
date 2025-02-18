import React from 'react';


function Contact() {
  return (
    <div className="border-b border-neutral-900 pt-2 pb-11 my-6 bg-slate-500 rounded-3xl">

        <h2 className="mt-8 mb-4 text-center text-4xl font-medium text-cyan-50">Get in Touch</h2>
        <div className="text-center tracking-tighter relative z-20 text-lg">  
            <a
              href="www.linkedin.com/in/toh-xin-yi-"
              className="border-b text-gray-100 hover:text-blue-900 relative z-30"  
            >
                www.linkedin.com/in/toh-xin-yi-
            </a>
            <a
              href="mailto:xinyitoh74@gmail.com"
              className="border-b text-gray-100 hover:text-blue-900 relative z-30"  
            >
              <br/>xinyitoh74@gmail.com
            </a>
            <a
              href="tel:+60182251767"
              className="border-b text-gray-100 hover:text-blue-900 relative z-30"
            >
              <br/>+60 18-225 1767
            </a>
        </div>
    </div>
  );
}

export default Contact;
