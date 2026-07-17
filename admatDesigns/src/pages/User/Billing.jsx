import React, { useState, useEffect, useRef } from 'react';
import ProfileSidePanel from '../../components/ProfileSidePanel';
import { ACCESS_TOKEN_KEY } from '../../utils/authKeys';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api/api';
import { toast } from 'sonner';
import { FaCreditCard } from 'react-icons/fa';

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
        is_default: card.is_default || false,
      }));

      setCards(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      toast.error("Cannot edit this card, please try again")
      return;
    }


    setFormData({
      cardName: card.cardName,
      cardNumber: card.cardNumber,
      expiry: card.expiry,
      is_default: card.is_default || false
    });

    setEditingId(card.id);
    setIsEditing(true);
    setIsOpen(true);
    toast.success("Card edited successfully ✅")
  }; 

  //Set default
  const setDefaultCard = async (id) => {
    try {
      await apiFetch(`/billing/${id}/set-default/`, {
        method: "PATCH",
      });

      toast.success("Default card updated");
      fetchCards(); 

    } catch (err) {
      console.error(err);
      toast.error("Failed to set default card");
    }
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
      toast.success("Card deleted successfully ✅")
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
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      <ProfileSidePanel />

      <div className="flex-1 p-6 transition-all duration-300">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Cards</h1>

          <button
            onClick={openModal}
            className="cursor-pointer rounded bg-linear-to-b from-orange-600 to-orange-800 text-orange-100 transition hover:from-orange-700 hover:to-orange-900 px-4 py-2"
          >
            + Add Card
          </button>
        </div>
          
        {/* ✅ LOADING STATE */}
          {loading ? (
            <div className="flex flex-col justify-center items-center py-10">
              <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-center">Loading cards..</p>
            </div>

          ) :  cards.length === 0 ? (
            <div className="flex flex-col justify-center text-gray-500 py-10">
              <p className="flex items-center gap-2"><FaCreditCard />No cards yet 💳</p>
              <p className="text-sm">Click "Add Card" to get started</p>
            </div>
          ) : ( 
            <>
            {/* LIST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card, index) =>
              (
              <div
                key={card.id || index}
                className={`relative p-6 rounded text-white shadow-lg ${card.is_default 
                  ? "ring-2 ring-orange-600" 
                  : "border border-orange-600 focus:ring-2 focus:ring-orange-600 cursor-pointer"}`}
              >
                                  
                <div className="text-gray-600">
                  <div className="absolute top-4 left-4 flex items-center gap-2 text-sm space-x-2 font-semibold">
                    {/*Default & Label */}
                    <span className="flex justify-between items-center mb-2">
                      {card.is_default && (
                        <span className="text-xs px-2 py-1 bg-orange-600 text-white rounded">
                          Default
                        </span>
                      )}
                    </span>                    
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

                </div>

                <div className="flex justify-between items-center  w-full gap-2 mt-6">

                  {/* Toggle switch Default/Not Default */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!card.is_default) {
                          setDefaultCard(card.id);
                        }
                      }}
                      className="bottom-2 flex"
                    >
                      <label className="relative inline-flex items-center cursor-pointer gap-2">

                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={card.is_default}
                          readOnly
                        />

                        <div
                          className={`w-12 rounded-full h-6 transition-colors duration-300 ${
                            card.is_default ? "bg-green-500" : "bg-orange-400"
                          }`}
                        ></div>

                        <span
                          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            card.is_default ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></span>

                        <span className="text-xs text-gray-700">
                          {card.is_default ? "Default" : "Set Default"}
                        </span>

                      </label>
                    </div>
                  
                  {/* Delete and Edit Buttons */}
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(card)}
                      className="px-3 py-1 rounded bg-orange-600 w-[80px] hover:bg-orange-600/50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setSelectedItem(card);
                        setShowModal(true);
                      }}
                      className="px-3 py-1 rounded bg-red-500 w-[80px] hover:bg-red-400 duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>              
          </>
          
          )}

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
                  className="border border-orange-600 focus:ring-2 focus:ring-orange-600 border p-2"
                  inputMode="text"
                  required
                />

                <input
                type="text"
                  name="cardNumber"
                  placeholder="1234 5678 .... ...."
                  value={formData.cardNumber}
                  disabled={isEditing}
                  onChange={handleChange}
                  className="border border-orange-600 border p-2 rounded"
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
                  className="border border-orange-600 p-2 rounded"
                  inputMode="numeric"
                  required
                />

                <div className="flex justify-between mt-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="bg-red-600 text-white px-3 py-2 rounded"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-tr from-orange-600 to-orange-300 text-white px-3 py-1 w-[80px] rounded flex items-center justify-center gap-2"
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