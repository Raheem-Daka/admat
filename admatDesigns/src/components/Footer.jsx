import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaCamera,
  FaLinkedin,
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full mt-12 bg-gradient-to-t from-orange-50 to-orange-100 text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            footer<span className="text-orange-600">Furniture</span>
          </h2>

          <p className="text-sm text-gray-600">
            Building modern furniture solutions with passion and precision.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>

          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-orange-600 transition">
                Home
              </Link>
            </li>

            <li>
              <Link to="/about" className="hover:text-orange-600 transition">
                About
              </Link>
            </li>

            <li>
              <Link to="/products" className="hover:text-orange-600 transition">
                Products
              </Link>
            </li>

            <li>
              <Link to="/contact" className="hover:text-orange-600 transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Follow Us</h2>

          <div className="flex gap-4">
            <Link
              to="#"
              className="flex flex-col items-center hover:text-orange-600 transition"
            >
              <span className="p-2 rounded-full bg-white shadow-sm mb-1">
                <FaLinkedin />
              </span>
              LinkedIn
            </Link>

            <Link
              to="#"
              className="flex flex-col items-center hover:text-orange-600 transition"
            >
              <span className="p-2 rounded-full bg-white shadow-sm mb-1">
                <FaTwitter />
              </span>
              Twitter
            </Link>

            <Link
              to="#"
              className="flex flex-col items-center hover:text-orange-600 transition"
            >
              <span className="p-2 rounded-full bg-white shadow-sm mb-1">
                <FaFacebook />
              </span>
              Facebook
            </Link>

            <Link
              to="#"
              className="flex flex-col items-center hover:text-orange-600 transition"
            >
              <span className="p-2 rounded-full bg-white shadow-sm mb-1">
                <FaCamera />
              </span>
              Instagram
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-6 py-8 border-t border-orange-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Address */}
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-full bg-white shadow">
              <FaMapMarkerAlt className="text-orange-600" />
            </div>

            <div>
              <h4 className="font-medium">Address</h4>
              <p className="text-sm text-gray-600">
                Furniture building, old town
                <br />
                Lilongwe, Malawi
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-full bg-white shadow">
              <FaPhone className="text-orange-600" />
            </div>

            <div>
              <h4 className="font-medium">Phone</h4>
              <p className="text-sm text-gray-600">
                +265 (999) 999-9999
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-full bg-white shadow">
              <FaEnvelope className="text-orange-600" />
            </div>

            <div>
              <h4 className="font-medium">Email</h4>
              <p className="text-sm text-gray-600">
                furniture@furniture.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-orange-200 text-center py-4 text-sm text-gray-600">
        © {new Date().getFullYear()} AdmatFurniture. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;