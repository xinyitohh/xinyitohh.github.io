import pic1 from "/assets/toh_xin_yi_2.jpg";
import nature from "/assets/nature.jpg";
import { ABOUT_TEXT } from "../constants/index";

const About = () => {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">About</h2>
      <div className="flex flex-col sm:flex-row items-stretch gap-8">
        <img
          src={pic1}
          alt="Toh Xin Yi"
          className="w-28 h-28 rounded-2xl object-cover flex-shrink-0 self-start"
        />
        <p className="text-gray-600 leading-7 text-base flex-1 whitespace-pre-wrap">
          {ABOUT_TEXT}
        </p>
        <img
          src={nature}
          alt="nature"
          className="w-full sm:w-44 rounded-2xl object-cover flex-shrink-0"
        />
      </div>
    </section>
  );
};

export default About;
