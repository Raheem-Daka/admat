import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowDown, FaArrowRight } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Hero = () => {
  const [items, setItems] = useState([]);
  const [stopScroll, setStopScroll] = useState(false);
  const navigate = useNavigate();

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products/`);

        const shuffled = [...res.data.results].sort(() => 0.5 - Math.random());
        setItems(shuffled.slice(0, 10));

      } catch (err) {
        console.error("Failed to load products", err);
      }
    };

    fetchProducts();
  }, []);

  const handleHeroImage = (item) => {
    navigate(`/product/${item.id}/${item.slug}`);
  };

  const navigateProducts = () => {
    navigate("/products");
  };

  return (
    <section className="min-h-[100vh] px-5 md:px-16 flex flex-col justify-center 
    bg-[url('assets/HeroImage.webp')] bg-cover bg-center bg-no-repeat lg:bg-none">
      
      {/* ✅ Animation */}
      <style>{`
        .marquee-inner {
          animation: marqueeScroll linear infinite;
        }

        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* LEFT TEXT */}
        <div className="flex flex-col max-w-xl bg-white/60 bg-transparent px-5 py-5 rounded-xl ">
          <h1 className="text-5xl md:text-5xl font-semibold text-slate-900">
            Furniture Future
          </h1>

          <h2 className="text-4xl md:text-5xl font-semibold text-indigo-900 mt-2">
            Modern living made simple
          </h2>

          <p className="italic bg-blue-200 px-4 py-1 mt-2 rounded-xl w-fit">
            elegant, modern, exotic
          </p>

          <p className="mt-5 text-lg text-gray-700">
            Unlock smarter living with furniture designed to enhance comfort,
            simplify spaces, and help you do more with less effort.
          </p>

          <div className="flex gap-4 mt-8">
            <button
              onClick={navigateProducts}
              className="bg-indigo-700 text-white px-6 py-3 rounded hover:bg-indigo-800"
            >
              View Designs
            </button>

            <button className="flex items-center gap-2 border px-6 py-3 rounded">
              Get Started
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* ✅ RIGHT SLIDER */}
        <div
          className="hidden lg:flex overflow-hidden w-full max-w-lg relative"
          onMouseEnter={() => setStopScroll(true)}
          onMouseLeave={() => setStopScroll(false)}
        >
          {/* Fade edges */}
          <div className="absolute left-0 top-0 h-full w-5 bg-gradient-to-r from-black z-10" />
          <div className="absolute right-0 top-0 h-full w-5 bg-gradient-to-l from-black z-10" />

          {/* Loading */}
          {items.length === 0 ? (
            <p className="text-center w-full">Loading products...</p>
          ) : (
            <div
              className="marquee-inner flex"
              style={{
                animationPlayState: stopScroll ? "paused" : "running",
                animationDuration: `${items.length * 5}s`,
              }}
            >
              {[...items, ...items].map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleHeroImage(item)}
                  className="lg:w-60 lg:h-[400px] mx-3 rounded-xl overflow-hidden shadow-lg relative group cursor-pointer hover:scale-105 transition"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white p-2">
                    <p className="font-semibold text-center">{item.name}</p>
                    <p className="text-sm mt-1">${item.current_price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* DOWN BUTTON */}
      <div className="flex justify-center mt-10">
        <button
          onClick={scrollToProducts}
          className="animate-bounce bg-indigo-700 text-white p-3 rounded-full"
        >
          <FaArrowDown size={24} />
        </button>
      </div>
    </section>
  );
};

export default Hero;