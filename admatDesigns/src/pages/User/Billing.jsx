import React, { useState, useEffect, useRef } from 'react';
import ProfileSidePanel from '../../components/ProfileSidePanel';
import { ACCESS_TOKEN_KEY } from '../../utils/authKeys';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api/api';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Billing = () => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  const [cards, setCards] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
  });

  // FETCH CARDS (runs once)
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);

    try {
      const data = await apiFetch('/billing/')

      const results = data.results || data || [];

      const formatted = results.map((card) => ({
        id: card.id,
        cardName: card.card_name || "Unknown",
        cardNumber: card.card_number || "",
        expiry: card.expiry || "--/--",
      }));

      setCards(formatted);
    } catch (err) {
      console.error(err);
    } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
    }
  };

  // HANDLE INPUT
  const handleChange = (e) => {
    let { name, value } = e.target;

    // CARD NAME (letters + spaces only)
    if (name === 'cardName') {
      value = value.replace(/[^a-zA-Z\s]/g, '');
    }

    // CARD NUMBER
    if (name === 'cardNumber') {
      let digits = value.replace(/\D/g, '').slice(0, 16);
      value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    // EXPIRY
  if (name === 'expiry') {
    let digits = value.replace(/\D/g, '').slice(0, 4);

    let month = digits.slice(0, 2);
    let year = digits.slice(2);

    if (month > 12) month = "12";
    if (month === "00") month = "01";

    value = month + (year ? "/" + year : "");
  }
      setFormData({
        ...formData,
        [name]: value,
      });
    };

  // ADD CARD (API)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      card_name: formData.cardName,
      card_number: formData.cardNumber.replace(/\s/g, '').slice(-4),
      expiry: formData.expiry,
    };

    try {
      if (isEditing) {
        // UPDATE
        if (!editingId) {
          console.error("Missing ID for update");
          toast.error("Failed, Please try again")
          return;
        }
        await apiFetch(`/billing/${editingId}/`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        // CREATE
        await apiFetch(`/billing/`, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }

      fetchCards();
      setIsOpen(false);
      resetForm();
      setIsEditing(false);
      setEditingId(null);

    } catch (err) {
      console.error(err);
    }
  };

  //Editing Button
  const handleEdit = (card) => {
    if (!card.id) {
      console.log("Missing card ID");
      toast.error("Failed, please try again")
      return;
    }


    setFormData({
      cardName: card.cardName,
      cardNumber: card.cardNumber,
      expiry: card.expiry,
    });

    setEditingId(card.id);
    setIsEditing(true);
    setIsOpen(true);
  }; 

  // DELETE CARD (API)
  const handleDelete = async (id) => {
    try {
      await apiFetch(`/billing/${id}/`, {
        method: 'DELETE',
      });

      fetchCards();
    } catch (err) {
      console.error(err);
    }
  };

  //Confirm Delete
  const confirmDelete = async () => {

    if (!selectedItem) return 
      await handleDelete(selectedItem.id);
      
      setShowModal(false);
      setSelectedItem(null);
  };

  // RESET
  const resetForm = () => {
    setFormData({
      cardName: '',
      cardNumber: '',
      expiry: '',
    });
  };

  const openModal = () => {
    resetForm();
    setIsEditing(false);
    setEditingId(null);
    setIsOpen(true);
  };

  const maskCard = (number) => {
    if (!number) return "•••• •••• •••• ••••";

    return "•••• •••• •••• " + number;
  };

  const getBrand = (number = "") => {
    if (!number || typeof number !== "string") return "CARD";

    if (number.startsWith("4")) return "VISA";
    if (number.startsWith("5")) return "MASTERCARD";
    if (number.startsWith("3")) return "AMEX";
    return "CARD";
  };

  return (
    <div className="flex min-h-screen">
      <ProfileSidePanel />

      <div className="p-6 w-full">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Cards</h1>

          <button
            onClick={openModal}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            + Add Card
          </button>
        </div>

        {/* LIST */}
        <div className="grid gap-4">
          
        {/* ✅ LOADING STATE */}
          {loading ? (
            <div className="flex flex-col justify-center items-center py-10">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-center">Loading cards..</p>
            </div>

          ) :  cards.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p>No cards yet 💳</p>
              <p className="text-sm">Click "Add Card" to get started</p>
            </div>
          ) : (
            cards.map((card, index) => (
              <div
                key={card.id || index}
                className="relative p-6 rounded-2xl text-white shadow-lg bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden"
              >
                <div className="absolute top-4 left-4 text-sm font-semibold">
                  {getBrand(card.cardNumber)}
                </div>

                <div className="absolute top-4 right-4 text-xs opacity-70">
                  <h2 className="font-semibold">{card.cardName}'s Card</h2>
                </div>

                <p className="text-lg tracking-widest mt-4">
                  {maskCard(card.cardNumber)}
                </p>

                <div className="flex justify-between mt-6 text-sm">
                  <span className="uppercase tracking-wide">
                    {card.cardName}
                  </span>
                  <span>{card.expiry}</span>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => handleEdit(card)}
                    className="px-3 py-1 rounded bg-white/20 hover:bg-white/30"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setSelectedItem(card);
                      setShowModal(true);
                    }}
                    className="px-3 py-1 rounded bg-red-500/80 hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* DELETE CONFIRMATION MODAL */}
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
                <span className="text-red-500 font-bold"> {selectedItem?.cardName}</span>'s Card from your cards?<br/> <span>This action cannot be undone.</span>
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


        {/* Edit MODAL */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center backdrop-blur-sm">
            <div className="bg-white p-6 rounded w-full max-w-md">
              <h2 className="mb-4 text-lg font-semibold">
                {isEditing ? "Edit Card" : "Add Card"}
              </h2>

              <form onSubmit={handleSubmit} className="grid gap-3">
                <input
                  name="cardName"
                  placeholder="Card Name"
                  value={formData.cardName}
                  onChange={handleChange}
                  className="border p-2"
                  inputMode="text"
                  required
                />

                <input
                type="text"
                  name="cardNumber"
                  placeholder="1234 5678 .... ...."
                  value={isEditing ? maskCard(formData.cardNumber) : formData.cardNumber}
                  disabled={isEditing}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  inputMode="numeric"
                  required
                />

                
                  {isEditing && (
                    <p className="text-sm text-gray-500 mt-1">
                      To change card number, please add a new card
                    </p>
                  )}


                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  inputMode="numeric"
                  required
                />

                <div className="flex justify-between mt-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="bg-gray-400 px-3 py-2 rounded"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-2"
                  >
                    {loading && (
                      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {isEditing ? "updating..." : "Save"}
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

export default Billing;