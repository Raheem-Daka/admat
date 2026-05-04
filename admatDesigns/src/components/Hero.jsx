import React from "react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "../assets/heroImage.webp";
import { FaArrowDown, FaArrowRight } from "react-icons/fa";

const Hero = () => {
  const navigate = useNavigate();

  const handleScrollDown = () => {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  };

  const navigateProducts = () => {
    navigate('/products')
  }
  return (
    <section
      className="min-h-[100vh] md:px-16 lg:px-5 py-10 
                 bg-cover bg-center bg-no-repeat 
                 lg:bg-none bg-[url('assets/HeroImage.webp')]"
      
    >
      <div
        className="flex items-center gap-10  p-6 rounded-lg sm
                   flex-col lg:flex-row 
                   lg:justify-between
                   w-full max-w-full"
      >
        {/* Text Section */}
        <div className=" flex flex-grow flex-col bg-white/60 md:mt-10 sm:mt-10 lg:bg-transparent p-8 rounded">
          {/* Headings */}
          <h1 className="text-center md:text-left text-4xl md:text-5xl font-semibold max-w-xl text-slate-900 leading-tight">
            Furniture Future
          </h1>
          <h2 className=" text-center md:text-left text-3xl md:text-5xl font-semibold max-w-full text-indigo-900 leading-snug mt-2">
            Modern living made simple
          </h2>
          <p className="italic bg-[#49B9FF]/50 max-w-fit px-4 shadow-xl text-indigo text-xl py-1 rounded-xl">elegant, modern, exotic</p>

          {/* Description */}
          <p className="text-center md:text-left text-lg text-slate-700 max-w-lg pt-5 mt-4 font-medium">
            Unlock smarter living with furniture designed to enhance comfort,
            simplify spaces, and help you do more with less effort.
          </p>



          {/* Buttons */}
          <div className="flex items-center gap-4 mt-8 text-sm">
            
              <button
                onClick={navigateProducts} 
                className="bg-indigo-700 hover:bg-indigo-700 text-white active:scale-95 transition rounded-md px-7 h-11">
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
      <div className="flex items-end justify-center py-14">
        <button 
        className="rounded-full animate-bounce p-2 bg-indigo-700 text-white hover:bg-indigo-800 active:scale-95 transition"
        onClick={handleScrollDown}
        ><FaArrowDown size={32}/></button>
      </div>
    </section>
  );
};

export default Hero;