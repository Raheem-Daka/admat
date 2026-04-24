import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] =useState(false)

  const toggleSearch = () => {
    setSearchOpen(!searchOpen)
  }

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
          <h1 className="text-2xl font-bold">admatFurniture</h1>
          
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 ml-7">
          {navlinks.map((link, i) => (
            <Link key={i} to={link.path} className="relative overflow-hidden h-6 group">
              <span className="block group-hover:-translate-y-full transition-transform duration-300">{link.name}</span>
              <span className="block flex absolute top-full left-0 group-hover:translate-y-[-100%] transition-transform duration-300">
                {link.name === "Products" ? "Our Products" :
                 link.name === "About" ? "About Us" :
                 link.name === "Contact" ? "Contact Us" : link.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Desktop Search buttons */}
        <div className="relative hidden ml-14 md:flex items-center ">
          <button
            onClick={toggleSearch}
            className="hover:cursor-pointer hover:transition-transform duration-300 px-4 py-2 rounded-full text-sm font-medium transition"
          >
            {searchOpen ? <FaTimes size={16} /> : <FaSearch size={16} />}
          </button>

          <div
            className={`flex items-center border pl-4 gap-2 border-gray-500/30 h-[46px] rounded-full overflow-hidden transition-all duration-300 ${
              searchOpen ? "max-w-md opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            <button >
              <FaSearch />
            </button>
            
            <input
              type="text"
              placeholder="Search"
              className="w-full h-full outline-none text-gray-500 bg-transparent placeholder-gray-500 text-sm"
            />
          </div>
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
          className={`absolute fixed top-0 left-0 min-h-[100vh] text-base bg-black min-w-full flex-col justify-center items-center gap-4 transition-all duration-300 ${
            isOpen ? "flex" : "hidden"
          }`}
          
        >
            <button>
              <FaTimes 
              className="w-6 h-6 top-5 absolute right-5 text-slate-400"
              onClick={toggleMenu} />
            </button>
          {navlinks.map((link, i) => (
            <Link
              className="hover:underline hover:transition-all ease-out pb-2 duration-300"
              key={i}
              to={link.path}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {/*}
          <button className="mb-4 border border-slate-600 hover:bg-white hover:text-black px-4 py-2 rounded-full text-sm font-medium transition">
          Login
          </button>*/}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;