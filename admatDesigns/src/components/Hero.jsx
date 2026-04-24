import React from "react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "../assets/heroImage.webp";
import { FaArrowRight } from "react-icons/fa";

const Hero = () => {
  const navigate = useNavigate();

  const navigateProducts = () => {
    navigate('/products')
  }
  return (
    <section
      className="flex items-center justify-center md:px-16 lg:px-10 xl:px-20 
                 bg-cover bg-center bg-no-repeat 
                 lg:bg-none bg-[url('assets/HeroImage.webp')]"
      
    >
      <div
        className="flex min-h-[100vh] 
                   flex-col lg:flex-row 
                   max-md:gap-20 
                   items-center 
                   lg:justify-between sm:justify-center"
      >
        {/* Text Section */}
        <div className="flex flex-col m bg-white/60 md:mt-10 sm:mt-10 lg:bg-transparent p-8 rounded">
          {/* Headings */}
          <h1 className="text-center md:text-left text-4xl md:text-5xl font-semibold max-w-xl text-slate-900 leading-tight">
            Furniture Future
          </h1>
          <h2 className="text-center md:text-left text-3xl md:text-5xl font-semibold max-w-xl text-indigo-900 leading-snug mt-2">
            Modern living made simple
          </h2>

          {/* Description */}
          <p className="text-center md:text-left text-lg text-slate-700 max-w-lg mt-4 font-medium">
            Unlock smarter living with furniture designed to enhance comfort,
            simplify spaces, and help you do more with less effort.
          </p>



          {/* Buttons */}
          <div className="flex items-center gap-4 mt-8 text-sm">
            
              <button
                onClick={navigateProducts} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 transition rounded-md px-7 h-11">
                View Designs
              </button>
         
            <button
              className="flex items-center gap-2 border border-slate-600 active:scale-95 hover:bg-white/10 transition text-slate-600 rounded-md px-6 h-11"
              aria-label="Watch demo video"
            >
              Get Started
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Hero Image (only visible on large screens) */}
        <img
          src={heroImage}
          alt="Modern furniture showcase"
          className="hidden lg:block max-w-sm rounded lg:max-w-lg 2xl:max-w-xl transition-all duration-300"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default Hero;