import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DesignCard = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const onClick = (id, slug) => {
    navigate(`/products/${id}/${slug}`);
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        return response.json();
      })
      .then((data) => {
        setItems(data.items || []);
      })
      .catch((error) => {
        console.error("Error getting items:", error);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <section className="bg-white flex items-center justify-center px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex flex-wrap items-stretch justify-center">
          {items.length === 0 ? (
            <p className="text-2xl text-center text-gray-500 col-span-full">
              No Items available.
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => onClick(item.id, item.slug)}
                className="border border-zinc-200 hover:border-zinc-300 transition-colors rounded-xl p-2 flex flex-col w-46 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  {item.discount ? (
                    <span className="bg-lime-300 text-neutral-800 text-xs px-2 py-0.5 rounded-full">
                      <span className="font-bold">{item.discount}</span> off
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">No discount</span>
                  )}
                </div>
                <div className="flex items-center justify-center h-30 mb-2">
                  <img
                    src="https://assets.prebuiltui.com/images/components/card/card-lamp-image.png"
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <p className="text-sm text-neutral-500 mb-2 px-2">
                  {item.name}
                </p>
                <div className="flex items-center gap-2 px-2">
                  <span className="text-sm font-semibold text-neutral-800">
                    {item.price}
                  </span>
                  {item.discount && (
                    <span className="text-xs text-neutral-500 line-through">
                      {item.discount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-600 px-2 mt-2">
                  {item.description}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default DesignCard;