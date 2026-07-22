import React, { useEffect, useState } from 'react';
import placeHolder from "../assets/placeHolder.png";
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const OurPopularProductsComponent = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/products/popular_products/`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setTimeout(() => {
            setLoading(false);
        })
    });
  }, []);

  const handlePopularProduct = (id, slug) => {
    navigate(`/product/${id}/${slug}`);
  };

    return (
        <div className="py-10">

            {loading ? (
            <div className="flex flex-col items-center justify-center w-full py-10">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-500">Loading products...</p>
            </div>            
            ) : (
            <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
                {items.map((item) => (
                <div
                    key={item.id}
                    onClick={() => handlePopularProduct(item.id, item.slug)}
                    className="
                    relative group rounded-lg overflow-hidden cursor-pointer
                    transition-transform duration-300
                    lg:hover:scale-105
                    "
                >
                    <img
                    src={item.imageUrl || placeHolder}
                    alt={item.name}
                    className="w-48 h-48 object-cover object-top"
                    />

                    {/* Overlay */}
                    <div className="
                    absolute inset-0 flex flex-col justify-end p-4
                    text-white bg-black/50
                    opacity-100 lg:opacity-0 lg:group-hover:opacity-100
                    transition-all duration-300
                    ">
                    <h1 className="flex items-center text-sm sm:text-lg font-medium">
                        {item.name}
                    </h1>

                    </div>
                </div>
                ))}

                {/* Optional empty state */}
                {items.length === 0 && (
                <p className="text-center text-gray-500">
                    No popular products found.
                </p>
                )}
            </div>
            )}
        </div>
    );
};

export default OurPopularProductsComponent;