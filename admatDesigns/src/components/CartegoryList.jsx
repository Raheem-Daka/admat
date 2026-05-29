import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { getCategories } from "../api/categoryApi";
import placeHolder from "../assets/placeHolder.png";

const formatName = (name) =>
  name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const data = await getCategories(controller.signal);
        setCategories(data || []);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error(err);
      }
    };

    load();

    return () => controller.abort();
  }, []);

  return (
    <section className="px-4">
      <h2 className="text-lg font-semibold mb-3">Shop by Category</h2>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <NavLink
            key={cat.id}
            to={() => {
              const params = new URLSearchParams(searchParams);
              const currentCategory = searchParams.get("category");

              if (currentCategory === cat.slug) {
                params.delete("category");
              } else {
                params.set("category", cat.slug);
              }

              return `/discounts?${params.toString()}`;
            }}
            className={() =>
              `flex flex-col  border border-gray-200 items-center gap-1 px-3 py-1 rounded text-sm truncate transition ${
                activeCategory === cat.slug
                  ? "bg-indigo-700 text-white"
                  : "bg-indigo-50 hover:bg-indigo-700 hover:text-white"
              }`
            }
          >            
            <img
              src={cat.imageUrl || placeHolder}
              onError={(e) => (e.currentTarget.src = placeHolder)}
              className="w-8 h-8 object-contain bg-white p-1 rounded"
              alt={cat.name}
            />
            {formatName(cat.name)}
          </NavLink>
        ))}
      </div>
    </section>
  );
};

export default CategoryList;