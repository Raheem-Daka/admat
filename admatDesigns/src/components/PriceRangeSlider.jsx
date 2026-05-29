import { useState, useEffect } from "react";

const PriceRangeSlider = ({ min = 0, max = 1000, onChange }) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);

  const getPercent = (value) => {
    return ((value - min) / (max - min)) * 100;
  };

  // ✅ update parent
  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  return (
    <div className="xl:w-[500px] lg:w-[400px] md:[300px] sm:w-[200px] px-2">

      {/* Values */}
      <div className="flex justify-between text-sm mb-1">
        <span>{minVal}</span>
        <span>{maxVal}</span>
      </div>

      <div className="relative h-8">

        {/* Track */}
        <div className="absolute top-3 z-10 w-full h-1 bg-gray-300 rounded"></div>

        {/* Range highlight */}
        <div
          className="absolute top-3 z-10 h-1 bg-indigo-600 rounded"
          style={{
            left: `${getPercent(minVal)}%`,
            width: `${getPercent(maxVal) - getPercent(minVal)}%`,
          }}
        />

        {/* MIN handle */}
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(e) =>
            setMinVal(Math.min(Number(e.target.value), maxVal - 1))
          }
          className="absolute w-full pointer-events-none appearance-none bg-transparent z-20"
        />

        {/* MAX handle */}
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(e) =>
            setMaxVal(Math.max(Number(e.target.value), minVal + 1))
          }
          className="absolute w-full pointer-events-none appearance-none bg-transparent z-20"
        />

      </div>
    </div>
  );
};

export default PriceRangeSlider;
