import React, { useEffect, useState } from "react";
import { FaCartPlus, FaTimes, FaUser } from "react-icons/fa";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../utils/authKeys";
import { useAuth } from "../utils/AuthContent";

const Navbar = () => {
  
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsOpen(false);
    setProfileOpen(false)
  }, [location.pathname]); 

  const profileLinks = [
    {label: "Account", path: "/account"},
    {label: "Settings", path: "/setting"},

  ]
  const navlinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="flex items-center w-full justify-between px-6 py-4 text-white bg-indigo-700">
      <Link to="/">
        <h1 className="text-2xl font-bold">admatFurniture</h1>
      </Link>

      {/* ✅ Desktop links */}
      <div className="hidden md:flex items-center gap-6 ml-7">
        {navlinks.map((link, i) => (
          <NavLink
            key={i}
            to={link.path}
            className={({ isActive }) =>
              isActive
                ? "underline font-semibold"
                : "relative overflow-hidden h-6 group"
            }
          >
            <span className="block group-hover:-translate-y-full transition-transform duration-300">
              {link.name}
            </span>
            <span className="block absolute top-full left-0 group-hover:translate-y-[-100%] transition-transform duration-300">
              {link.name}
            </span>
          </NavLink>
        ))}
      </div>

      {/* ✅ Desktop Auth Buttons */}
      <div className="hidden md:flex items-center gap-1">
        {isAuthenticated ? (
          <div className="relative flex">
            <Link
              to="/cart"
              className="px-3 py-1 rounded hover:bg-white hover:text-black transition hover:cursor-pointer"
              aria-label="Cart"
            >
              <FaCartPlus size={26}/>
              
            </Link>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className=" px-3 py-1 rounded hover:bg-white hover:text-black transition hover:cursor-pointer"
              aria-label="Profile menu"
            >
              <FaUser size={26}/>
              
            </button>

            {profileOpen && (
              <ProfileDropdown
                links={profileLinks}
                close={() => setProfileOpen(false)} 
                onLogout={() => {
                  logout();
                  setProfileOpen();
                }}            
              />
            )}
            
          </div>
        ) : (
          <Link
            to="/signin"
            className="border px-4 py-2 rounded hover:bg-white hover:text-black transition hover:cursor-pointer"
          >
            Login
          </Link>
        )}
      </div>

      {/* ✅ Mobile Hamburger */}
      <button className="md:hidden" onClick={toggleMenu}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* ✅ Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-4 z-50">
          <FaTimes
            className="absolute top-5 right-5 w-6 h-6 cursor-pointer"
            onClick={toggleMenu}
          />

          {navlinks.map((link, i) => (
            <NavLink
              key={i}
              to={link.path}
              onClick={toggleMenu}
              className={({ isActive }) =>
                isActive ? "underline font-semibold" : ""
              }
            >
              {link.name}
            </NavLink>
          ))}

          {isAuthenticated ? (
            
            <div className="absolute top-5 left-5 flex gap-3">
              <Link to="/cart" onClick={toggleMenu}>
              <FaCartPlus size={24} /></Link>
              <Link to="/account" onClick={toggleMenu}>
              <FaUser size={24}/>
              </Link>
            </div>
          ) : (
            <Link to="/signin" onClick={toggleMenu}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;