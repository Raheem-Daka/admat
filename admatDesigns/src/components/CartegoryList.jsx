// src/components/HomeCategoryList.jsx
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getCategories } from "../api/categoryApi";

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

      <div className="flex justify-center gap-3 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => (
          <NavLink
            key={cat.id}
            to={`/category/${cat.slug}`}
            className={({ isActive }) =>
              `flex-shrink-0 px-5 py-3 rounded-xl border transition text-sm font-medium whitespace-nowrap
              ${
                isActive
                  ? "bg-indigo-700 text-white"
                  : "bg-white hover:bg-indigo-700 hover:text-white"
              }`
            }
          >
            {formatName(cat.name)}
          </NavLink>
        ))}
      </div>
    </section>
  );
};

export default CategoryList;