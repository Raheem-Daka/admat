import React, {useState, useEffect} from "react";

const API_BASE ="http://127.0.0.1:8000";

const DesignCard = ({ item, onClick }) => {
  
  if (!item) return null;

  // ✅ Calculate percentage discount if not provided
  const discountPercent =
    item.discount_percentage ??
    (item.price && item.current_price
      ? Math.round(((item.price - item.current_price) / item.price) * 100)
      : null
    );

  return (
    <div
      onClick={() => onClick(item.id, item.slug)}
      className="
        border border-zinc-200 hover:border-zinc-300
        transition-colors
        rounded-xl
        p-2
        sm:w-42
        md:w-44
        lg:w-48
        flex flex-col
        cursor-pointer
        bg-white
      "
    >

      {/* Image */}
      <div className="relative flex items-center justify-center h-32 mb-3">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="max-h-full max-w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Name */}
      <p className="text-sm font-semibold text-neutral-700 truncate">
        {item.name}
      </p>

      {/* Price */}
      <div className="flex items-center gap-2 mt-1">
        {item.current_price !== item.price && (
          <span className="text-xs line-through text-red-400">
            MWK {item.price}
          </span>
        )}
        <span className="text-sm font-semibold text-green-600">
          MWK {item.current_price}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-neutral-600 mt-1">
        {item.description}
      </p>
    </div>
  );
};

export default DesignCard;