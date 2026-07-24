import { useSearchParams } from "react-router-dom";
import PriceRangeSlider from "./PriceRangeSlider";
import { useState, useRef, useEffect } from "react";
import { FaFilter } from "react-icons/fa";

const Chip = ({ label, onRemove }) => (
  <div className="bg-orange-300 px-3 py-1 rounded flex items-center gap-2 text-sm shadow-sm">
    {label}
    <button 
    title="Reset"
    className=" text-orange-600 hover:text-black font-bold" 
    onClick={onRemove}>
      ✕
    </button>
  </div>
);

const FilterBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const ordering = searchParams.get("ordering");
  const category = searchParams.get("category");
  const hasDiscount = searchParams.get("has_discount") === "true";

  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const debounceRef = useRef();

  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters =
  minPrice || maxPrice || category || hasDiscount || ordering;

  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    setSearchParams(params);
  };

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  return (
    <div className="mt-2">
      <div className="flex justify-center mb-4 lg:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded bg-orange-600 px-2 py-1 text-white"
        >
          <FaFilter />
          Filters
        </button>
      </div>
      <div className={`${showFilters ? "block" : "hidden"} lg:block`}>  
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center mt-5 mb-4 gap-4">
          {minPrice && (
            <Chip
              label={`Min: ${minPrice}`}
              onRemove={() => updateParams({ min_price: null, maxPrice: null })}
            />
          )}

          <PriceRangeSlider
            min={0} 
            max={2000}
            initialMin={Number(minPrice) || 0}
            initialMax={Number(maxPrice) || 2000}
            onChange={({ min, max }) => {
              clearTimeout(debounceRef.current);

              debounceRef.current = setTimeout(() => {
                if (
                  Number(minPrice) !== min ||
                  Number(maxPrice) !== max
                ) {
                  updateParams({
                    min_price: min,
                    max_price: max,
                  });
                }
              }, 1000);
            }}
          />

          {maxPrice && (
            <Chip
              label={`Max: ${maxPrice}`}
              onRemove={() => updateParams({ max_price: null })}
            />
          )}            

        </div>      

        {/* ✅ CONTROLS */}
        <div className="flex flex-col lg:flex-row justify-center text-sm gap-2 lg:gap-5">
          <button
            onClick={() =>
              updateParams({
                has_discount: hasDiscount ? null : "true",
              })
            }
            className={`border border-orange-300 px-3 py-1 rounded w-full sm:w-auto 
              ${hasDiscount 
                ? "bg-orange-600 text-white" 
                : ""
              }`}
          >
            {hasDiscount ? "Remove Discount" : "Discount Only"}
          </button>

          <select
            value={ordering || ""}
            onChange={(e) =>
              updateParams({ ordering: e.target.value })
            }
            className="border px-2 py-1 rounded w-full sm:w-auto"
          >
            <option value="">Sort</option>
            <option value="price">Price ↑</option>
            <option value="-price">Price ↓</option>
            <option value="-views">Popular</option>
          </select>

          {/* ✅ CHIPS */}
          {category && (
            <Chip
              label={`Category: ${category}`}
              onRemove={() => updateParams({ category: null })}
            />
          )}

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowFilters(false)}
              className="flex-1 sm:flex-none rounded bg-orange-600 px-3 py-1 text-white"
            >
              Apply Filters
            </button>

            {hasActiveFilters && (
              <button
                onClick={() => setSearchParams({})}
                className="flex-1 sm:flex-none rounded border border-red-500 bg-red-500 px-3 py-1 text-white hover:bg-white hover:text-red-500 transition"
              >
                Clear All
              </button>
            )}
          </div>      
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
