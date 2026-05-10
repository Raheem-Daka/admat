import React, { useState } from "react";
 
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "cod",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = () => {
    // ✅ Later you will send this to backend
    console.log("Order placed:", formData);

    alert("✅ Order placed successfully!");
    navigate("/orders");
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ✅ Shipping Details */}
        <div className="border rounded-xl p-6 shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-4">
            Shipping Information
          </h2>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full mb-3 p-3 border rounded focus:outline-none focus:border-indigo-600"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full mb-3 p-3 border rounded focus:outline-none focus:border-indigo-600"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full mb-3 p-3 border rounded focus:outline-none focus:border-indigo-600"
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="w-full mb-3 p-3 border rounded focus:outline-none focus:border-indigo-600"
          />
        </div>

        {/* ✅ Order Summary */}
        <div className="border rounded-xl p-6 shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-4">
            Order Summary
          </h2>

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>MWK 120,000</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Delivery</span>
            <span>MWK 5,000</span>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>MWK 125,000</span>
          </div>

          {/* ✅ Payment */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">
              Payment Method
            </h3>

            <label className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === "cod"}
                onChange={handleChange}
              />
              Cash on Delivery
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="mobile"
                checked={formData.paymentMethod === "mobile"}
                onChange={handleChange}
              />
              Mobile Money
            </label>
          </div>

          {/* ✅ Place Order */}
          <button
            onClick={placeOrder}
            className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

