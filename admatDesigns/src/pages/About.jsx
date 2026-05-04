import React, { useState } from "react";

const About = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  // Each item has a short preview and a full explanation
  const sections = [
    {
      title: "Quality",
      preview: "We use premium materials and expert craftsmanship...",
      full: "At AdmatFurniture, quality is our cornerstone. We carefully select premium woods, metals, and fabrics, ensuring durability and longevity. Every piece is crafted by skilled artisans who pay attention to detail, so your furniture not only looks beautiful but also withstands daily use for years to come."
    },
    {
      title: "Design",
      preview: "Our furniture blends modern aesthetics with timeless elegance...",
      full: "Design is at the heart of AdmatFurniture. We combine contemporary trends with timeless elegance, creating pieces that fit seamlessly into any space. Whether you prefer minimalist lines or bold statement furniture, our collections are designed to elevate your home or office environment."
    },
    {
      title: "Sustainability",
      preview: "We are committed to eco-friendly practices...",
      full: "Sustainability guides our production process. We source materials responsibly, reduce waste, and use eco-friendly finishes. Our goal is to minimize environmental impact while delivering furniture that aligns with your values. Choosing AdmatFurniture means investing in a greener future."
    }
  ];

  const handleClick = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow px-6 py-12">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            About AdmatFurniture
          </h1>

           <p
            className="text-lg text-gray-600 mb-10 cursor-pointer hover:text-blue-600"
            onClick={() =>
              handleClick(
                "AdmatFurniture believes furniture is more than utility — it reflects lifestyle, taste, and comfort. Our mission is to craft modern, durable, and stylish pieces that transform houses into homes."
              )
            }
          >
            At <span className="font-semibold">AdmatFurniture</span>, we believe
            furniture is more than just utility — it’s a reflection of your
            lifestyle, taste, and comfort.
          </p>         

          {/* Values Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {sections.map((section, idx) => (
              <p
                key={idx}
                className="border hover:bg-slate-200 bg-slate-100 p-6 rounded-lg shadow hover:shadow-lg transition-transform ease-out cursor-pointer"
                onClick={() => handleClick(section.full)}
              >
                <span className="text-xl font-semibold text-gray-800 block mb-3">
                  {section.title}
                </span>
                {section.preview}
              </p>
            ))}
          </div>
          
          <p
            className="text-lg text-gray-600 "      
          >
            Whether you’re furnishing a cozy apartment or a spacious office,
            AdmatFurniture is here to bring comfort, style, and functionality
            into your everyday life.
          </p>

        </div>
        <div className="rounded bg-slate-200 py-10 w-full min-h-[70px] flex flex-col items-center justify-center lg:mt-20 sm:mt-10">
           <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Where to find us
          </h1>
          <div className="w-full min-h-[50px] flex items-center justify-center rounded-lg overflow-hidden">
            <iframe
              title="AdmatFurniture Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.953736315316!3d-37.81627977975195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d9a651e5e0!2sFederation%20Square%2C%20Melbourne%20VIC%203000%2C%20Australia!5e0!3m2!1sen!2sus!4v1618317045678!5m2!1sen!2sus"
              width="600"
              height="450"
              className="border-0 w-full"
            />
          </div>

        </div>
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className=" fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50" >
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full h-1/3 p-8 flex flex-col justify-between">
            <h2 className="text-xl font-bold mb-4">More Information</h2>
            <p className="text-gray-700 mb-6">{modalContent}</p>
            <button
              onClick={() => setModalOpen(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;