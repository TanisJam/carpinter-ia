"use client";

interface DimensionSliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function DimensionSlider({
  label,
  min,
  max,
  value,
  unit = "cm",
  onChange,
}: DimensionSliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    const roundedValue = Math.round(newValue);
    if (roundedValue >= min && roundedValue <= max) {
      onChange(roundedValue);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Label and Value */}
      <div className="flex items-center justify-between">
        <label className="text-2xl font-normal text-gray-800">{label}</label>
        <span className="text-3xl font-semibold text-blue-600">
          {value} {unit}
        </span>
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          className="w-full h-10 appearance-none bg-transparent cursor-pointer slider-custom"
          style={{
            background: `linear-gradient(to right, #0F172B 0%, #0F172B ${
              ((value - min) / (max - min)) * 100
            }%, #E5E7EB ${((value - min) / (max - min)) * 100}%, #E5E7EB 100%)`,
          }}
        />
      </div>

      {/* Min and Max Labels */}
      <div className="flex items-center justify-between text-base text-gray-400">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>

      <style jsx>{`
        .slider-custom::-webkit-slider-thumb {
          appearance: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: white;
          border: 3px solid #0f172b;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider-custom::-moz-range-thumb {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: white;
          border: 3px solid #0f172b;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider-custom::-webkit-slider-runnable-track {
          height: 12px;
          border-radius: 9999px;
        }

        .slider-custom::-moz-range-track {
          height: 12px;
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
}
