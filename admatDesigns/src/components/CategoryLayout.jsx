import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import placeHolder from "../assets/placeHolder.png"

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const formatName = (name) =>
  name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const CategoryLayout = () => {
  
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API_BASE}/categories/`)
    .then((res) => res.json())
    .then((data) => {
      setCategories(data.results || data);
    });

  }, []);

  const handleNavigateToCategory = (cat) => {
    navigate(`/category/${cat.slug}`)
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-center mx-auto">
        Look up the furniture you want by category
      </h1>
      <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
        A visual collection of our most recent works - each piece crafted with intention, emotion, and style.
      </p>
      <div className="sm:px-5 flex gap-2 lg:h-[400px] h-[240px] sm:h-[280px] md:h-[320px] w-full max-w-6xl mt-10 mx-auto overflow-x-auto scrollbar-hide px-2">
        {categories.map((cat) => (
          <div
          key={cat.id}
          onClick={() => handleNavigateToCategory(cat)} 
          className="flex-shrink-0 relative group transition-all xl:w-50 lg:w-46 md:w-38 sm:w-[250px] rounded-lg overflow-hidden h-[400px] duration-500 lg:hover:w-96 cursor-pointer">
            <img
              src={cat.imageUrl || placeHolder}
              alt={cat.name}
              className="h-full w-full flex items- object-cover object-center"

            />
            
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <p className="text-white text-xl font-bold">
              {formatName(cat.name)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryLayout;
