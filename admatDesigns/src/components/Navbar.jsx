import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navlinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <nav className="flex items-center border w-full justify-between border-slate-700 px-6 py-4 rounded text-white text-sm bg-black">
        <Link to={"/"} target="_blank" rel="noopener noreferrer">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4.706" cy="16" r="4.706" fill="#D9D9D9" />
            <circle cx="16.001" cy="4.706" r="4.706" fill="#D9D9D9" />
            <circle cx="16.001" cy="27.294" r="4.706" fill="#D9D9D9" />
            <circle cx="27.294" cy="16" r="4.706" fill="#D9D9D9" />
          </svg>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 ml-7">
          {navlinks.map((link, i) => (
            <Link key={i} to={link.path} className="relative overflow-hidden h-6 group">
              <span className="block group-hover:-translate-y-full transition-transform duration-300">{link.name}</span>
              <span className="block absolute top-full left-0 group-hover:translate-y-[-100%] transition-transform duration-300">
                {link.name === "Products" ? "Our Products" :
                 link.name === "About" ? "About Us" :
                 link.name === "Contact" ? "Contact Us" : link.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Desktop buttons */}
        <div className="hidden ml-14 md:flex items-center gap-4">
          <button className="border border-slate-600 hover:bg-slate-800 px-4 py-2 rounded-full text-sm font-medium transition">
            Contact
          </button>
          <button className="bg-white hover:shadow-[0px_0px_30px_14px] shadow-[0px_0px_30px_7px] hover:shadow-white/50 shadow-white/50 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-100 transition duration-300">
            Get Started
          </button>
        </div>

        {/* Mobile hamburger */}
        <button id="toggleMenu" className="md:hidden text-gray-600 hover:cursor-pointer" onClick={toggleMenu}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Mobile menu */}
        <div
          id="mobileMenu"
          className={`absolute top-48 text-base left-0 bg-black w-full flex-col items-center gap-4 transition-all duration-300 ${
            isOpen ? "flex" : "hidden"
          }`}
        >
          {navlinks.map((link, i) => (
            <Link
              className="hover:underline"
              key={i}
              to={link.path}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <button className="mb-4 border border-slate-600 hover:bg-white hover:text-black px-4 py-2 rounded-full text-sm font-medium transition">Login</button>
          {/*<button className="bg-white hover:shadow-[0px_0px_30px_14px] shadow-[0px_0px_30px_7px] hover:shadow-white/50 shadow-white/50 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-100 transition duration-300">Get Started</button>*/}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;