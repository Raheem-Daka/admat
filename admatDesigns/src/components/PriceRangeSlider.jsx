import { useState, useEffect } from "react";

const PriceRangeSlider = ({ min = 0, max = 1000, onChange }) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);

  const GAP = 10

  useEffect(() => {
    setMinVal(min);
    setMaxVal(max);
  }, [min, max]);

  const getPercent = (value) => {
    if (max === min) return 0;
    return ((value - min) / (max - min)) * 100;
  };

  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  return (
    <div className="xl:w-[500px] lg:w-[400px] md:w-[300px] sm:w-[200px] px-2">
      
      <div className="flex justify-between text-sm mb-1">
        <span title={`Min: ${minVal}`}>{minVal}</span>
        <span>{maxVal}</span>
      </div>

      <div className="relative h-8">

        <div className="absolute top-3 w-full h-1 bg-gray-400 rounded"></div>

        <div
          className="absolute top-3 h-1 bg-orange-600 rounded"
          style={{
            left: `${getPercent(minVal)}%`,
            width: `${getPercent(maxVal) - getPercent(minVal)}%`,
          }}
        />

        {/* MIN */}
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(e) =>
            setMinVal(Math.min(Number(e.target.value), maxVal - GAP))
          }
          className="absolute w-full appearance-none bg-transparent z-20"
        />

        {/* MAX */}
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(e) =>
            setMaxVal(Math.max(Number(e.target.value), minVal + GAP))
          }
          className="absolute w-full appearance-none bg-transparent z-20"
        />
      </div>
    </div>
  );
};

export default PriceRangeSlider;
