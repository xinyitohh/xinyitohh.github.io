import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Project_UNI from './components/Projects_Uni.jsx';

const App = () => {
  return (
    <div>
      <div class="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
    <div className="overflow-x-hidden text-neutral-300 antialiased 
    selection:bg-cyan-300 selection:text-cyan-900">
{/* <div class="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div> */}


      <div className="fixed top-0 z-10 h-full w-full">
        {/* Any fixed elements like navbar */}
      </div>
      
      <div className="min-h-screen container mx-auto px-8">
        {/* This will make sure the container takes up full screen height */}
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Project_UNI />
        <Contact />

      </div>

    </div>
    </div>
  );
};

export default App;
