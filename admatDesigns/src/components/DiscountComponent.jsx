import React from 'react';
import heroImage from "../assets/heroImage.webp";
import { useNavigate } from 'react-router-dom';

const DiscountComponent = () => {
    const navigate = useNavigate()

    const navigateDiscountProducts = () => {
        navigate('/discount_products')
    }
  return (
    <section className="bg-slate-100 py-20 px- justify-center w-full sm:flex-col  flex lg:flex-row items-center gap-8">
      {/* Image Section */}
      <div classname='px-30 border p-3 flex flex-grow' >
        <img 
            src={heroImage}
            alt="Discount showcase" 
            className="ml-10 lg:min-w-[700px] rounded-lg w-40 h-50 lg:w-90 lg:min-h-[500px] object-cover" 
            media=""
        />

        <source type="image/webp" srcset="//images.ctfassets.net/hrltx12pl8hq/41TLWcq0t4Zb5orBsJAVAv/0bb2a38acd78d29e2cce082bf9424611/contributor-lohp.png?fit=&amp;w=512&amp;h=512&amp;fm=webp 1x, //images.ctfassets.net/hrltx12pl8hq/41TLWcq0t4Zb5orBsJAVAv/0bb2a38acd78d29e2cce082bf9424611/contributor-lohp.png?fit=&amp;w=614&amp;h=614&amp;fm=webp 2x" ></source>
      </div>

      {/* Text Section */}
      <div className="flex-1 text-center">
        <h1 className="lg:text-5xl md:text-4xl sm:text-2xl font-bold">
          Transform your living space into a masterpiece.
        </h1>
        <div className="flex flex-col justify-start items-center w-full">
            <p className="mt-4 text-lg font-light">
            Discover premium furniture, unique design rights, and creative custom designs 
            to bring marvels into your living space.
            </p>

            <button 
            className="flex border item-center justify-center mt-6 rounded-xl bg-red-600 lg:px-10 lg:py-3 sm:px-6 sm:py-3 text-white hover:bg-red-700 transition w-40 "
            aria-label="View all furniture designs"
            onClick={navigateDiscountProducts}
            
            >
            View all
            </button>
        </div>
      </div>
    </section>
  );
};

export default DiscountComponent;