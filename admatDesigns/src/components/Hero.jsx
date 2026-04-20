import React from "react";
import {Link} from "react-router-dom";
import heroImage from "../assets/heroImage.webp"
import { FaArrowRight } from "react-icons/fa"

const Hero = () => {
  return (
    <section className="pb-20 mt-20 px-4 md:px-16 lg:px-24 xl:px-32 min-h-[100vh]">
      <div className="flex flex-col max-md:gap-20 md:flex-row items-center justify-between">
        {/* Text Section */}
        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-center md:text-left text-4xl leading-[46px] md:text-5xl md:leading-[68px] font-semibold max-w-xl text-slate-900">
            Furniture Future
            <br />
            modern living made simple
          </h1>
          <p className="text-center md:text-left text-sm text-slate-700 max-w-lg mt-2 font-semibold text-lg">
            Unlock smarter living with furniture designed to enhance comfort,
            simplify spaces, and help you do more with less effort
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-4 mt-8 text-sm">
            <Link to={"/products"}>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 transition rounded-md px-7 h-11">
                View Designs
                </button>
            </Link>
            <button
              className="flex items-center gap-2 border border-slate-600 active:scale-95 hover:bg-white/10 transition text-slate-600 rounded-md px-6 h-11"
              aria-label="Watch demo video"
            >
                Get Started
                <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <img
          src={heroImage}
          alt="Modern furniture showcase"
          className="max-w-sm sm:max-w-md rounded lg:max-w-lg 2xl:max-w-xl transition-all duration-300"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default Hero;