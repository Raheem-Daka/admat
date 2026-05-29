import { useSearchParams } from "react-router-dom";
import PriceRangeSlider from "./PriceRangeSlider";
import { useRef } from "react";

const Chip = ({ label, onRemove }) => (
  <div className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2 text-sm shadow-sm">
    {label}
    <button className="text-gray-600 hover:text-black" onClick={onRemove}>
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

  return (
    <div className="mt-2">
      <div className="flex flex-wrap justify-center mt-5 items-center mb-4 gap-4">
        {minPrice && (
          <Chip
            label={`Min: ${minPrice}`}
            onRemove={() => updateParams({ min_price: null })}
          />
        )}

        <PriceRangeSlider
          min={0}
          max={2000}
          value={[
            Number(minPrice) || 0,
            Number(maxPrice) || 2000,
          ]}
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
            }, 300);
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
      <div className="flex justify-center gap-5 items-center">
        <button
          onClick={() =>
            updateParams({
              has_discount: hasDiscount ? null : "true",
            })
          }
          className="border px-3 py-1 rounded"
        >
          {hasDiscount ? "Remove Discount" : "Discount Only"}
        </button>

        <select
          value={ordering || ""}
          onChange={(e) =>
            updateParams({ ordering: e.target.value })
          }
          className="border px-2 py-1 rounded"
        >
          <option value="">Sort</option>
          <option value="price">Price ↑</option>
          <option value="-price">Price ↓</option>
          <option value="-views">Popular</option>
        </select>
      </div>

      {/* ✅ CHIPS */}
      <div className="flex justify-center gap-2 flex-wrap mt-2">
        {category && (
          <Chip
            label={`Category: ${category}`}
            onRemove={() => updateParams({ category: null })}
          />
        )}

        {hasDiscount && (
          <Chip
            label="Discount"
            onRemove={() => updateParams({ has_discount: null })}
          />
        )}

        {ordering && (
          <Chip
            label="Sort"
            onRemove={() => updateParams({ ordering: null })}
          />
        )}

        {(minPrice || maxPrice || category || hasDiscount || ordering) && (
          <button
            onClick={() => setSearchParams({})}
            className="text-white rounded bg-red-500 px-3 py-1 text-sm hover:bg-white hover:text-red-500 hover:cursor-pointer hover:border"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
