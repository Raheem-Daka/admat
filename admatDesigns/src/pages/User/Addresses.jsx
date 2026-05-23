import React, { useState } from 'react';
import ProfileSidePanel from '../../components/ProfileSidePanel';
import { ACCESS_TOKEN_KEY } from '../../utils/authKeys';

const API_BASE = import.meta.env.VITE_URL_BASE_API;

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    fullName: '',
    phone: '',
    city: '',
    street: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);


    //Get Address
    const apiFetch = (url, options = {}) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    return fetch(`${API_BASE}${url}`, {
        ...options,
        headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
        },
    });
    };

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === formData.id ? formData : addr
        )
      );
      setIsEditing(false);
    } else {
      setAddresses([
        ...addresses,
        { ...formData, id: Date.now() },
      ]);
    }

    resetForm();
    setIsOpen(false); // ✅ close modal
  };

  // Edit
  const handleEdit = (address) => {
    setFormData(address);
    setIsEditing(true);
    setIsOpen(true); // ✅ open modal
  };

  // Delete
  const handleDelete = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: null,
      fullName: '',
      phone: '',
      city: '',
      street: '',
    });
  };

  // Open modal
  const openModal = () => {
    resetForm();
    setIsEditing(false);
    setIsOpen(true);
  };

  return (
    <div className="flex min-h-screen">
      <ProfileSidePanel />

      <div className="p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Addresses</h1>

          <button
            onClick={openModal}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Address
          </button>
        </div>

        {/* LIST */}
        <div className="grid gap-4">
          {addresses.length === 0 ? (
            <p className="text-gray-500">No addresses added yet.</p>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.id}
                className="border rounded p-4 shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{addr.fullName}</p>
                  <p>{addr.phone}</p>
                  <p>{addr.street}, {addr.city}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(addr)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ✅ MODAL */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-full max-w-lg p-6 rounded shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                {isEditing ? 'Edit Address' : 'Add Address'}
              </h2>

              <form onSubmit={handleSubmit} className="grid gap-3">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                />

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                />

                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                />

                <input
                  type="text"
                  name="street"
                  placeholder="Street Address"
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
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    {isEditing ? 'Update' : 'Save'}
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