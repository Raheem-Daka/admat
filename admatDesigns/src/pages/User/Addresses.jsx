import React, { useState, useEffect } from "react";
import ProfileSidePanel from "../../components/ProfileSidePanel";
import { apiFetch } from "../../api/api";
import { FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "sonner";

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
  const [isEditingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedAddress, setSelectedAddress] =useState(null)
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectAddress = (addr) => {
    setSelectedAddress(addr.id);
    localStorage.setItem("last_address_id", addr.id);

  };
  // ✅ FETCH ADDRESSES

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {

    if (!selectedAddress) {
      const savedId = Number(localStorage.getItem("last_address_id"));

    if (!addresses.length) return;

      const preferred =
        addresses.find(a => a.id === savedId) ||
        addresses.find(a => a.is_default) ||
        addresses[0];

      if (preferred) {
        setSelectedAddress(preferred.id);
      }
    }
  }, [addresses]);

  const selectedFull = addresses.find(
    (a) => a.id === selectedAddress
  );
  

  const defaultAddress =
    selectedFull ||    
    addresses.find((a) => a.is_default) ||
    addresses[0];

  const formatAddresses = (data) => {
    const results = data.results || data || [];

    return results.map((addr) => ({
      id: addr.id,
      full_name: addr.full_name || "Unknown",
      phone: addr.phone || "----",
      city: addr.city || "----",
      street: addr.street || "----",
      label: addr.label || "home",
      is_default: addr.is_default || false,
    }));
  };


  //fetch Addresses
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/addresses/");
      setAddresses(formatAddresses(data));
    } catch (err) {
      console.error("Failed to find addresses", err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  //Address validation
  const validateAddress = () => {
    if (!formData.fullName.trim()) return "Full name is required";

    if (!formData.phone.match(/^[0-9]{7,15}$/))
      return "Invalid phone number";

    if (formData.city.length < 2) return "City is required";

    if (formData.street.length < 5)
      return "Street must be more detailed";

    return null;
  };


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

    const error = validateAddress();

    if (error) {
      toast.error(error);
      return;
    }

    try {
      const payload = {
        full_name: formData.fullName,
        phone: formData.phone,
        city: formData.city,
        street: formData.street,
        label: formData.label,
        is_default: formData.is_default
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
      setAddresses(formatAddresses(data));

      resetForm();
      setIsOpen(false);
      setIsEditing(false);
      toast.success(isEditing ? "Address updated ✅" : "Address added ✅");

    } catch (err) {
      console.error("Save failed", err);
      toast.error("Failed to save address, Please try again");
    }
  };

  // ✅ EDIT
  const handleEdit = (addr) => {
    if(!addr.id) {
      console.log("Missing address ID");
      toast.error("Cannot edit this address, Please try again");
      return;
    }

    setFormData({
      id: addr.id,
      fullName: addr.full_name,
      phone: addr.phone,
      city: addr.city,
      street: addr.street,
      is_default: addr.is_default || false,
      label: addr.label
    });

    setEditingId(addr.id);
    setIsEditing(true);
    setIsOpen(true);
  };

  // Set Default
  const setDefaultAddress = async (id) => {
    
    try {
      await apiFetch(`/addresses/${id}/set-default/`, {
        method: "PATCH",
      });

      const data = await apiFetch("/addresses/");
      const formatted = formatAddresses(data);
      setAddresses(formatted);
      toast.success("Successfully changed default card")

      // ✅ update selected
      const newDefault = formatted.find(a => a.is_default);
      if (newDefault) {
        setSelectedAddress(newDefault.id);
        localStorage.setItem("last_address_id", newDefault.id);
      }

    } catch (err) {
      console.error(err);
      toast.error("Failed to set default address");
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (addresses.length === 1) {
      toast.error("You must keep at least one address");
      return;
    }

    try {
      await apiFetch(`/addresses/${id}/`, {
        method: "DELETE",
      });

      setAddresses(prev => {
        const updated = prev.filter(a => a.id !== id);

        // ✅ fix selection if deleted address was selected
        if (selectedAddress === id) {
          const fallback =
            updated.find(a => a.is_default) ||
            updated[0] ||
            null;

          setSelectedAddress(fallback?.id || null);
        }

        return updated;
      });

    } catch (err) {
      console.error("Failed to delete address", err);
    }
  };

  //Confirm Delete
  const confirmDelete = async () => {
    if (!selectedItem) return;

    await handleDelete(selectedItem.id);

    setShowModal(false);
    setSelectedItem(null);
    toast.success("Address deleted ✅");
  };

  // ✅ RESET FORM
  const resetForm = () => {
    setFormData({
      id: null,
      fullName: "",
      phone: "",
      city: "",
      street: "",
      label: "home",
      is_default: false
    });
  };

  const openModal = () => {
    resetForm();
    setIsEditing(false);
    setEditingId(null);
    setIsOpen(true);
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <ProfileSidePanel />

      <div className="flex-1 p-6 transition-all duration-300">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaMapMarkerAlt className="text-orange-600" />
            Addresses
          </h1>

          <button
            onClick={openModal}
            className="cursor-pointer rounded bg-linear-to-b from-orange-600 to-orange-800 text-orange-100 transition hover:from-orange-700 hover:to-orange-900 py-3 px-2"
          >
            + Add Address
          </button>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center py-10">
            <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-500">Loading addresses...</p>
          </div>
        ) : addresses.length === 0 ? (
          // ✅ EMPTY STATE
          <div className="text-center text-gray-500 py-10 flex flex-col items-center gap-2">
            <FaMapMarkerAlt className="text-3xl text-indigo-500" />
            <p>No addresses yet</p>
          </div>
        ) : (
        <>
          {/*{defaultAddress && (
              <div className="mb-4 p-4 bg-green-50 border rounded">
                <p className="font-semibold">{defaultAddress.full_name}</p>
                <p>{defaultAddress.street}, {defaultAddress.city}</p>
              </div>
            )}*/}

          {/* ✅ LIST*/}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => handleSelectAddress(addr)}
                className={`relative p-6 rounded text-white shadow-lg ${addr.is_default ? "bg-gradient-to-br from-orange-500 via-orange-200 to-orange-300" : "border-1 border-orange-600"} ${selectedAddress === addr.id ? "ring-2 ring-orange-500" : "hover:ring-2 hover:ring-orange-300 cursor-pointer"}`}
              >
                <div className="flex flex-col gap-1 text-gray-600 font-medium">

                  {/*Default & Label */}
                  <div className="flex justify-between items-center mb-2">
                    {addr.is_default && (
                      <span className="text-xs px-2 py-1 bg-orange-600 text-white rounded">
                        Default
                      </span>
                    )}

                    <span className="text-xs px-2 py-1 rounded bg-gray-200 text-orange-700 uppercase">
                      {addr.label} address
                    </span>
                  </div>
                  <span className="uppercase tracking-wide">
                    {addr.full_name}
                  </span>
                  <span className="text-sm">{addr.phone}</span>
                  <span className="text-sm">
                    {addr.street}, {addr.city}
                  </span>
                  
                </div>


              <div className="flex justify-between items-center w-full gap-2 mt-6">

                {/* Toggle switch Default/Not Default */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!addr.is_default) {
                      setDefaultAddress(addr.id);
                    }
                  }}
                  className="flex bottom-2"
                >
                  <label className="relative inline-flex items-center cursor-pointer gap-2">

                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={addr.is_default}
                      readOnly
                    />

                    <div
                      className={`w-12 rounded-full h-6 transition-colors duration-300 ${
                        addr.is_default ? "bg-green-500" : "bg-orange-400"
                      }`}
                    ></div>

                    <span
                      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        addr.is_default ? "translate-x-6" : "translate-x-0"
                      }`}
                    ></span>

                    <span className="text-xs text-gray-700">
                      {addr.is_default ? "Default" : "Set Default"}
                    </span>

                  </label>
                </div>


                  {/* Buttons Edit and Delete */}
                <div className="flex items-center justify-between mb-2">
                  

                  {/* Delete and Edit Buttons */}
                  <div className="space-x-2">
                    <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(addr)
                    }}
                      className="px-3 py-1 rounded bg-orange-600 w-[80px] hover:bg-orange-600/50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(addr);
                        setShowModal(true);
                      }}
                        
                      className="px-3 py-1 rounded bg-red-500 w-[80px] hover:bg-red-600"
                    >
                      Delete
                    </button>

                  </div>
                  </div>
                </div>
              </div>
            ))}
          </div>         
        </>
        )}

        {/* Delete Modal */}
        {showModal && (         
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center backdrop-blur-sm z-50">
          <div className="bg-white shadow-md rounded-xl py-6 px-5 md:w-[460px] w-[370px]">
               {/* Icon */}
               <div className="flex items-center justify-center p-4 bg-red-100 rounded-full w-16 h-16 mx-auto">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.875 5.75h1.917m0 0h15.333m-15.333 0v13.417a1.917 1.917 0 0 0 1.916 1.916h9.584a1.917 1.917 0 0 0 1.916-1.916V5.75m-10.541 0V3.833a1.917 1.917 0 0 1 1.916-1.916h3.834a1.917 1.917 0 0 1 1.916 1.916V5.75m-5.75 4.792v5.75m3.834-5.75v5.75" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-gray-900 text-center font-semibold mt-4 text-xl">Are you sure?
              </h2>

              {/* Description */}
              <p className="text-sm text-gray-600 mt-2 text-center">
                Do you really want to delete 
                <span className="text-red-500 font-bold"> {selectedItem?.full_name}</span>'s Address from your addresses?<br/> <span>This action cannot be undone.</span>
              </p>

              {/* Buttons */}
              <div className="flex items-center justify-center gap-4 mt-5 w-full">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedItem(null);
                  }}
                  className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="w-full md:w-36 h-10 rounded-md text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition"
                >
                  Yes, Remove
                </button>
              </div>
          </div>
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

                {/* Select label */}
                <select
                  name="label"
                  value={formData.label || "home"}
                  onChange={handleChange}
                  className="border p-2 rounded"
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                </select>

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