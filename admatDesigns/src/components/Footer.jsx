import React from "react";
import { FaFacebook, FaTwitter, FaCamera, FaLinkedin, FaPhone, FaMapMarkerAlt , FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className=" w-full bottom-0 backdrop-blur-xl bg-orange-50 mt-12 
    bg-gradient-to-t from-orange-600 from-orange-50 text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Company Info */}
        <div>
          <h2 className="text-2xl font-bold mb-4">BB</h2>
          <p className="text-sm">
            Building modern web solutions with passion and precision.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li><Link to={"/"} className="hover:underline">Home</Link></li>
            <li><Link to={"/about"} className="hover:underline">About</Link></li>
            <li><Link to={"/products"} className="hover:underline">Products</Link></li>
            <li><Link to={"/contact"} className="hover:underline">Contact</Link></li>

          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
          <div className="flex space-x-4">
            <Link to="#" className="hover:transition-all flex flex-col justify-center items-center">

              <span className="p-2 rounded-full bg-white/70 backdrop-blur-md shadow-sm mb-1">
                <FaLinkedin />
              </span>
              Linked
            </Link>
            <Link to="#" className="hover:transition-all flex flex-col justify-center items-center">
              <span className="p-2 rounded-full bg-white/70 backdrop-blur-md shadow-sm mb-1">
                <FaTwitter />
              </span>
              Twitter
            </Link>
            <Link to="#" className="hover:transition-all flex flex-col justify-center items-center">
              <span className="p-2 rounded-full bg-white/70 backdrop-blur-md shadow-sm mb-1">
                <FaFacebook />
              </span>
              Facebook
            </Link>
            <Link to="#" className="hover:transition-all flex flex-col justify-center items-center">
              <span className="p-2 rounded-full bg-white/70 backdrop-blur-md shadow-sm mb-1">
                <FaCamera />
              </span>
              Instagram
            </Link>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="max-w-7xl mx-auto flex justify-center md:flex-row gap-6 md:gap-16 py-9 space-x-4 px-6">
        <div className="flex items-start gap-2.5 flex-1">
            <div className="size-8 rounded-lg flex items-center justify-center">
              <FaMapMarkerAlt />
            </div>
            <div>
                <h4 className="text-base font-medium text-zinc-800 mb-0.5">Address</h4>
                <p className="text-sm text-orange-200 leading-relaxed">548 Market Street, Suite 410<br />San Francisco, United States</p>
            </div>
        </div>
        <div className="flex items-start gap-2.5 flex-1">
            <div className="size-8 rounded-lg flex items-center justify-center">
                <FaPhone />
            </div>
            <div>
                <h4 className="text-base font-medium text-zinc-800 mb-0.5">Phone</h4>
                <p className="text-sm text-orange-200 leading-relaxed">+1 (55) 123-4567</p>
            </div>
        </div>
        <div className="flex items-start gap-2.5 flex-1">
            <div className="size-8 rounded-lg flex items-center justify-center">
                <FaEnvelope className=""/>
            </div>
            <div>
                <h4 className="text-base font-medium text-zinc-800 mb-0.5">Email</h4>
                <p className="text-sm text-orange-200 leading-relaxed">admin@admin.com</p>
            </div>
        </div>
    </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-700 text-center py-4 text-sm text-orange-200">
        © {new Date().getFullYear()} AdmatFurniture. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;