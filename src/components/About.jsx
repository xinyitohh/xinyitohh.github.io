import pic1 from '/assets/toh_xin_yi_2.jpg';
import pic2 from '/assets/nature.jpg';

import React from 'react'
import { ABOUT_TEXT } from "../constants/index";

const About = () => {
  return (
    <div>
      
      <h2 className="my-20 text-center text-4xl text-gray-900">About Me
         
        </h2>
    <div className='border-b border-neutral-900 pb-4 lg:ml-64'>
        
        <div className="flex flex-col lg:flex-row">
            {/* Left Section - Image and Text */}
            <div className="w-full lg:w-1/2 lg:p-8 flex flex-col items-center lg:items-start">
                <img src={pic1} alt="about" className="rounded-2xl w-80 h-80 mb-6 " />
                <p className='my-2 max-w-xl py-6 text-gray-600 text-justify leading-10' style={{ lineHeight: '2.0rem' }}>{ABOUT_TEXT}</p>
            </div>
            {/* Right Section - Long Image */}
            <div className="w-full lg:w-1/2">
                <img src={pic2} alt="long" className="w-auto  rounded-2xl lg:mt-14" style={{ height: '500px' }} />
            </div>
        </div>
    </div>
     </div>
  )
}

export default About;
