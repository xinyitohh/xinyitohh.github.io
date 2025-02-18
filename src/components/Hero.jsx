import pic1 from '/assets/toh_xin_yi.jpg';
const Hero = () => {
    return (
        <div className="border-b border-neutral-900 pb-4">
            {/* Column layout for small screens, row-reverse for large screens */}
            <div className="flex flex-col lg:flex-row-reverse flex-wrap items-center ">
                
                {/* Image Section */}
                <div className="w-full lg:w-1/2 lg:p-8 flex justify-center">
                    <img src={pic1} alt="Toh Xin Yi" className="w-72 h-64 rounded-full object-cover" />
                </div>

                {/* Text Section */}
                <div className="flex flex-col items-center lg:items-start ">
                    <h1 className="pb-8 text-4xl font-medium text-black lg:mt-16 lg:text-6xl">
                        Hey, I'm Xin Yi!
                    </h1>
                    <span className="bg-gradient-to-r text-gray-600 bg-clip-text text-2xl tracking-tight">
                        2nd Year Software Engineering Student
                    </span>
                    <p className="my-1 max-w-xl py-2 text-gray-500 font-light tracking-tighter text-justify">
                        A dedicated second-year software engineering student with a keen interest in developing practical and efficient solutions.
                    </p>
                </div>
                
            </div>
        </div>
    );
};

export default Hero;
