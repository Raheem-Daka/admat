import React, { useState, useEffect } from "react";
import ProfileSidePanel from "../../components/ProfileSidePanel";
import { apiFetch } from "../../api/api";
import { FaMapMarkerAlt } from "react-icons/fa";

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: null,
    fullName: "",
    phone: "",
    city: "",
    street: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ FETCH ADDRESSES
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await apiFetch("/addresses/");
        setAddresses(data.results || data || []);
      } catch (err) {
        console.error("Failed to fetch addresses", err);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchAddresses();
  }, []);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ SUBMIT (CREATE + UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        full_name: formData.fullName,
        phone: formData.phone,
        city: formData.city,
        street: formData.street,
      };

      if (isEditing) {
        await apiFetch(`/addresses/${formData.id}/`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/addresses/", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      // ✅ REFRESH
      const data = await apiFetch("/addresses/");
      setAddresses(data.results || data || []);

      resetForm();
      setIsOpen(false);
      setIsEditing(false);

    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save address");
    }
  };

  // ✅ EDIT
  const handleEdit = (addr) => {
    setFormData({
      id: addr.id,
      fullName: addr.full_name,
      phone: addr.phone,
      city: addr.city,
      street: addr.street,
    });

    setIsEditing(true);
    setIsOpen(true);
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    try {
      await apiFetch(`/addresses/${id}/`, {
        method: "DELETE",
      });

      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // ✅ RESET FORM
  const resetForm = () => {
    setFormData({
      id: null,
      fullName: "",
      phone: "",
      city: "",
      street: "",
    });
  };

  const openModal = () => {
    resetForm();
    setIsEditing(false);
    setIsOpen(true);
  };

  return (
    <div className="flex min-h-screen">
      <ProfileSidePanel />

      <div className="p-6 w-full">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaMapMarkerAlt className="text-indigo-600" />
            Addresses
          </h1>

          <button
            onClick={openModal}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition"
          >
            + Add Address
          </button>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center py-10">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-500">Loading...</p>
          </div>
        ) : addresses.length === 0 ? (
          // ✅ EMPTY STATE
          <div className="text-center text-gray-500 py-10 flex flex-col items-center gap-2">
            <FaMapMarkerAlt className="text-3xl text-indigo-500" />
            <p>No addresses yet</p>
          </div>
        ) : (
          // ✅ LIST
          <div className="grid gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="relative p-6 rounded-2xl text-white shadow-lg bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden"
              >
                <div className="flex flex-col gap-1">
                  <span className="uppercase tracking-wide">
                    {addr.full_name}
                  </span>
                  <span className="text-white text-sm text-gray-600">{addr.phone}</span>
                  <span className="text-white text-sm text-gray-500">
                    {addr.street}, {addr.city}
                  </span>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => handleEdit(addr)}
                    className="px-3 py-1 rounded bg-white/20 hover:bg-white/30"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="px-3 py-1 rounded bg-red-500/80 hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ✅ MODAL */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center backdrop-blur-sm z-50 p-4">
            <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                {isEditing ? "Edit Address" : "Add Address"}
              </h2>

              <form onSubmit={handleSubmit} className="grid gap-3">
                <input
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                />

                <input
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                />

                <input
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                />

                <input
                  name="street"
                  placeholder="Street"
                  value={formData.street}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                />

                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                  >
                    {isEditing ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;