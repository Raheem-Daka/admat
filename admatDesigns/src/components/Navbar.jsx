import React, { useEffect, useState } from "react";
import { FaCartPlus, FaTimes, FaUser } from "react-icons/fa";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../utils/authKeys";
import { useAuth } from "../utils/AuthContext";
import { useCart } from "../context/CartContext";


const Navbar = () => {
  
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const {cart} = useCart();
  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsOpen(false);
    setProfileOpen(false)
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-dropdown")) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isHomePage) {
        setIsScrolled(true);
        return;
    }

    const handleScroll = () => {
        setIsScrolled(window.scrollY > window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const profileLinks = [
    {label: "Account", path: "/account"},
    {label: "Settings", path: "/setting"},

  ];

  const navlinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  const toggleMenu = () => setIsOpen(prev => !prev);

  return (
    <nav
      className={`fixed top-0 left-0 flex items-center w-full justify-between px-6 py-3 transition-all duration-300 z-50 md:px-2 lg:px-24 xl:px-32 ${
        isScrolled
          ? "bg-white/30 backdrop-blur-xl shadow-sm border-b border-white/40 text-gray-800 py-3 md:py-4"
          : "bg-white/40 backdrop-blur-xl border-b border-white/20 text-black py-4 md:py-6"
      }`}
    >
      <Link 
      to="/" 
      onClick={() => window.scrollTo(0, 0)} 
      className="text-lg font-bold">
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
          <div className="relative flex gap-2 items-center">

            {/*Cart */}
            <Link
              to="/cart"
              className="px-3 py-1 rounded hover:bg-white hover:text-black transition hover:cursor-pointer"
              aria-label="Cart"
            >
              <div className="relative">
                <FaCartPlus size={26} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}   
              </div> 
            </Link>

            {/*Profile */}
            <div className="relative flex profile-dropdown">
              <button
                onClick={() => setProfileOpen(prev => !prev)}
                className=" px-3 py-1 rounded hover:bg-white hover:text-black transition hover:cursor-pointer"
                aria-label="Toggle profile menu"
                aria-expanded={profileOpen}
              >
                <FaUser size={26}/>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
                  <ProfileDropdown
                    links={profileLinks}
                    close={() => setProfileOpen(false)} 
                    onLogout={() => {
                      logout();
                      setProfileOpen(false);
                      navigate("/")
                    }}            
                  />
                </div>
              )}
            </div>            
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-50">
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