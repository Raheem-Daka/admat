import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id, slug } = useParams(); // get id and slug from route
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/product_details/${id}/${slug}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
        setItem(data.item);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setMessage("Error loading product details");
        setLoading(false);
      });
  }, [id, slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl text-gray-500 animate-pulse">Loading item details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl text-red-500">{message || "No item found."}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold text-center mb-6">{item.name}</h1>

      {/* Image with discount badge overlay */}
      <div className="relative mb-4 flex justify-center">
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-auto object-cover rounded-lg shadow"
          />
        )}
        {item.discounts && item.discounts.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {item.discounts.map((discount, idx) => (
              <span
                key={idx}
                className="bg-lime-300 text-neutral-800 text-xs px-2 py-0.5 rounded-full shadow"
              >
                {discount.discount_type === "percentage"
                  ? `${discount.discount_price}%`
                  : `MWK ${discount.discount_price}`} off
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4">{item.description}</p>

      {/* Price */}
      <div className="mb-4">
        {item.current_price !== item.price && (
          <p className="text-red-600 line-through">
            {new Intl.NumberFormat("en-MW", {
              style: "currency",
              currency: "MWK",
            }).format(Number(item.price))}
          </p>
        )}
        <p className="text-green-600 font-semibold text-lg">
          {new Intl.NumberFormat("en-MW", {
            style: "currency",
            currency: "MWK",
          }).format(Number(item.current_price))}
        </p>
      </div>

      {/* Category */}
      {item.category_name && (
        <p className="text-gray-600 mb-2">Category: {item.category_name}</p>
      )}

      {/* Dates */}
      <p className="text-gray-500 text-sm">
        Created at: {new Date(item.created_at).toLocaleDateString()}
      </p>
      <p className="text-gray-500 text-sm">
        Updated at: {new Date(item.updated_at).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ProductDetails;