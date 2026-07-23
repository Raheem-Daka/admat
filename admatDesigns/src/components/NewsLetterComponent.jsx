import React from "react";

const NewsLetterComponent = () => {
  return (
    <div className="bg-orange-50 rounded-xl lg:max-w-5xl w-full lg:mx-auto py-10 px-4">
      <section className="flex flex-col items-center">
        <div className="flex flex-col items-center">
          <h2 className="text-center text-4xl font-semibold max-w-2xl text-black">
            Subscribe to our{" "}
            <span className="text-orange-600">newsletter</span>
          </h2>

          <p className="text-center text-slate-500 max-w-lg mt-3">
            A visual collection of our most recent works —
            each piece crafted with intention, emotion, and style.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 items-center my-10 border border-slate-300 rounded p-2 max-w-xl w-full">
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full bg-transparent outline-none px-4 h-11"
          />

          <button className="w-full lg:w-auto rounded bg-gradient-to-b from-orange-600 to-orange-800 text-white h-11 px-5 flex items-center justify-center transition hover:from-orange-700 hover:to-orange-900 active:scale-95">
            Subscribe
          </button>
        </div>      
      </section>
    </div>
  );
};

export default NewsLetterComponent;