import React from "react";
import { FaFacebook, FaTwitter, FaCamera, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className=" w-full bottom-0 bg-indigo-700 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">admatFurniture</h2>
          <p className="text-sm">
            Building modern web solutions with passion and precision.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li><Link to={"/"} className="hover:text-white">Home</Link></li>
            <li><Link to={"/about"} className="hover:text-white">About</Link></li>
            <li><Link to={"/products"} className="hover:text-white">Products</Link></li>
            <li><Link to={"/contact"} className="hover:text-white">Contact</Link></li>

          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Follow Us</h2>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white flex flex-col justify-center items-center"><FaLinkedin/>LinkedIn</a>
            <a href="#" className="hover:text-white flex flex-col justify-center items-center"><FaTwitter />Twitter</a>
            <a href="#" className="hover:text-white flex flex-col justify-center items-center"><FaFacebook />Facebook</a>
            <a href="#" className="hover:text-white flex flex-col justify-center items-center"><FaCamera />Instagram</a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © {new Date().getFullYear()} AdmatFurniture. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;