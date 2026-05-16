import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-sm max-md:px-4">
      <h1 className="text-8xl md:text-9xl font-bold text-indigo-500">404</h1>
      <div className="h-1 w-16 rounded bg-indigo-500 my-5 md:my-7"></div>
      <p className="text-2xl md:text-3xl font-bold text-gray-800">Page Not Found</p>
      <p className="text-sm md:text-base mt-4 text-gray-500 max-w-md text-center">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <div className="flex items-center gap-4 mt-6">
        <Link to="/" className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-800 px-3 py-2.5 text-white rounded-md active:scale-95 transition-all">
            <FaArrowLeft />
            Return Home
        </Link>
        <Link to="/contact" className="flex items-center justify-center gap-2 border  border-indigo-800 px-3 py-2.5 text-indigo-800 rounded-md active:scale-95 transition-all">
            Contact support
            <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;