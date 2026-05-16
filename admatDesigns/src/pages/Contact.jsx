import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/contact/`)
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching message:", error));
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    if (!token) {
      toast.error("Session expired. Please sign in again.");
      navigate("/signin");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      try {
        const response = await fetch(`${API_BASE}/api/contact/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          setSubmitted(true);
          setFormData({ name: "", email: "", message: "" }); // reset form
        } else {
          toast.error("Failed to submit message.");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Something went wrong.");
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto pt-12 p-6 bg-white rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 flex justify-center">
        {message}
      </h1>
      <div className="bg-slate-100 shadow-md px-4 py-3">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-white w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.name && (
              <span className="bg-red-600 rounded mt-2 text-white p-1 text-sm">{errors.name}</span>
            )}
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-white w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.email && (
              <span className="bg-red-600 rounded mt-2 text-white p-1 text-sm">{errors.email}</span>
            )}
          </div>

          <div>
            <label className="block font-medium">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="bg-white w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 min-h-[100px]"
            />
            {errors.message && (
              <span className="bg-red-600 rounded mt-2 text-white p-1 text-sm">{errors.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>

      {submitted && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="rounded-lg flex flex-col items-center justify-center text-center max-w-md w-full p-6">
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2 text-gray-800">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your message has been successfully submitted. We’ll get back to you soon.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                // navigate("/");
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;