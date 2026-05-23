// src/components/HomeCategoryList.jsx
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getCategories } from "../api/categoryApi";
import placeHolder from "../assets/placeHolder.png"

const formatName = (name) =>
  name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    getCategories(controller.signal)
      .then(setCategories)
      .catch((err) => {
        if (err.name !== "AbortError"){
          console.error(err);
        }
      });

      //cleanup 
      return () => controller.abort();
  }, []);

  return (
    <section className="px-4">
      <h2 className="text-lg font-semibold mb-3">
        Shop by Category
      </h2>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => (
          <NavLink
            key={cat.id}
            to={`/category/${cat.slug}`}
            className={({ isActive }) =>
              `flex-shrink-0 px-2 py-1 rounded transition text-sm font-medium whitespace-nowrap
              ${
                isActive
                  ? "flex items-center justify-center gap-1 bg-indigo-700 text-white"
                  : "flex items-center justify-center gap-1 bg-indigo-50 hover:bg-indigo-700 hover:text-white"
              }`
            }
          >
            <img src={cat.imageUrl || placeHolder} alt="" className="w-8 h-8 object-cover rounded" />
            {formatName(cat.name)}
          </NavLink>
        ))}
      </div>
    </section>
  );
};

export default CategoryList;