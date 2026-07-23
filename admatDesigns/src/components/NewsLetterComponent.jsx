import React from "react";

const NewsLetterComponent = () => {
  return (
    <div className="bg-orange-50 rounded-xl max-w-5xl mx-auto py-10 px-4">
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

        <div className="flex gap-1 items-center justify-center mt-10 border border-slate-300 rounded-full h-14 max-w-xl w-full">
          <input
            type="email"
            placeholder="Enter your email address"
            className="bg-transparent outline-none rounded-full px-4 h-full flex-1"
          />

          <button className="cursor-pointer rounded-full bg-gradient-to-b from-orange-600 to-orange-800 text-white h-11 mr-1 px-10 flex items-center justify-center transition hover:from-orange-700 hover:to-orange-900 active:scale-95">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
};

export default NewsLetterComponent;