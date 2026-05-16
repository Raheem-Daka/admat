// src/pages/CategoryPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DesignCard from "../components/DesignCard";
import CategoryList from "../components/CartegoryList";
import SearchComponent from "../components/SearchComponent";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const formatName = (slug) =>
  slug.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const CategoryProducts = () => {
  const { slug } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true);

    fetch(`${API_BASE}/categories/${slug}/items/`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleNavigate = (item) => {
    navigate(`/products/${item.id}/${item.slug}/`)
  }

  return (
    <section className="px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {formatName(slug)}
      </h1>

      <div>
        <div>
          <SearchComponent />
        </div>
        <div>
          <CategoryList />

        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading products…</p>
      ) : items.length === 0 ? (
        <p className="text-center py-12 text-gray-400">
          No products found in this category...
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 gap-4">
          {items.map((item) => (
            <DesignCard 
            key={item.id} 
            item={item} 
            onClick={() => handleNavigate(item)}/>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoryProducts;