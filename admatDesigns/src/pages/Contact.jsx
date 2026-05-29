import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiFetch } from "../api/api";
import { FaUser, FaEnvelope } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        await apiFetch('/contact/', {
          method: "POST",
        });
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    };

    fetchMessage();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); 
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
      return
    } 
      setErrors({});
      setSending(true);

      try {
        await apiFetch("/contact/", {
          method: "POST",
          body: JSON.stringify(formData),
        });
          setSubmitted(true);
          setFormData({ name: "", email: "", message: "" }); // reset form
          toast.success("Message sent");

      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Something went wrong.");
      }finally {
        setSending(false)
      }
  };

  return (
    <div className="flex justify-center bg-white rounded-lg">
        {/*Form */}
        <form onSubmit={handleSubmit} className="xl:min-w-3xl lg:min-w-2xl md:min-w-xl items-center text-sm text-slate-80 mx-auto">
          <div className="text-center mb-6">
            <p className="text-md bg-indigo-200 text-indigo-600 font-semibold px-3 py-1 rounded">Contact Us</p> 
            <h1 className="text-4xl font-bold py-4 text-center">Let’s Get In Touch.</h1>
            <p className="max-md:text-sm text-gray-500 pb-10 text-center">
                Or just reach out manually to us at <a href="#" className="text-indigo-600 hover:underline">admin@admin.com</a>
            </p>
          </div>
          <div>
            <label className="block font-medium">Name</label>
            <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">
              <FaUser className="text-gray-400 mr-2" />              
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="bg-white h-full px-2 w-full outline-none bg-transparent py-2 focus:outline-none focus:ring-blue-300"
              />
            </div>
            {errors.name && (
              <span className="bg-red-600 rounded mt-2 text-white p-1 text-sm">{errors.name}</span>
            )}
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="bg-white h-full px-2 w-full outline-none bg-transparent py-2 focus:outline-none  focus:ring-blue-300"
              />
            </div>
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
              rows={5}
              className="bg-transparent w-full px-3 py-2 border border-slate-300 rounded-md resize-none outline-none focus:outline-none focus-within:ring-indigo-400 focus:ring-blue-300 transition-all min-h-[100px]"
            />
            {errors.message && (
              <span className="bg-red-600 rounded mt-2 text-white p-1 text-sm">{errors.message}</span>
            )}
          </div>

          <button
            disabled={sending}
            type="submit"
            className={`flex items-center justify-center mt-5 py-2.5 w-full rounded transition ${
              sending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-500 text-white"
            }`}
          >
            {sending ? "Sending.." : "Submit"}
          </button>
        </form>

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
                navigate("/");
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