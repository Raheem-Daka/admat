import React, { useEffect, useState } from "react";
import DesignCard from "../components/DesignCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import CategoryList from "../components/CartegoryList";
import SearchComponent from "../components/SearchComponent";
import { apiFetch } from "../api/api";


const API_BASE = import.meta.env.VITE_API_BASE_URL;

const DiscountProducts = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category")

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        let url = "/products/?has_discount=true";

        if (category) {
          url += `&category=${category}`;
        }

        const data = await apiFetch(url);

        setItems(data.results || []);
      } catch (err) {
        console.error("Error fetching discount products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);  
  
const handleNavigate = (id, slug) => {
    navigate(`/product/${id}/${slug}`);
  };

  return (
    <div className="px-10">
      <h1 className="lg:text-4xl sm:text-2xl font-bold py-10 text-center">
        Get quality products on discount
      </h1>

      {loading && (
        <p className="text-center text-lg text-gray-500 animate-pulse">
          Loading products...
        </p>
      )}

      <div className="w-full">
        <div className="">
          <SearchComponent/>
        </div>
        <div>
          <CategoryList />
        </div>
      </div>

      {!loading && items.length === 0 && (
        <p className="text-center text-gray-500">
          No discounted products available.
        </p>
      )}

      {!loading && items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-7 gap-4 mt-5">
          {items.map((item) => (
            <DesignCard
              key={item.id}
              item={item}
              onClick={handleNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscountProducts;