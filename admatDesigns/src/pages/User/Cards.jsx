import React, { useState, useEffect, useRef } from 'react';
import ProfileSidePanel from '../../components/ProfileSidePanel';
import { ACCESS_TOKEN_KEY } from '../../utils/authKeys';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api/api';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Cards = () => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  const [cards, setCards] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

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
      const data = await apiFetch('/cards/'); // correct usage

      const results = data.results || [];

      const formatted = results.map((card) => ({
        id: card.id,
        cardName: card.card_name,
        cardNumber: card.card_number,
        expiry: card.expiry,
      }));

      setCards(formatted);
    } catch (err) {
      console.error(err);
    } finally {
        timeoutRef.current = setTimeout(() => {
          setLoading(false);
        }, 800);
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

      if (digits.length >= 3) {
        value = digits.slice(0, 2) + '/' + digits.slice(2);
      } else {
        value = digits;
      }

      let month = parseInt(digits.slice(0, 2));
      if (digits.length >= 2) {
        if (month > 12) value = '12' + (digits.length > 2 ? '/' + digits.slice(2) : '');
        if (month === 0) value = '01' + (digits.length > 2 ? '/' + digits.slice(2) : '');
      }
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
        await apiFetch(`/cards/${editingId}/`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        // CREATE
        await apiFetch(`/cards/`, {
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
      await apiFetch(`/cards/${id}/`, {
        method: 'DELETE',
      });

      fetchCards();
    } catch (err) {
      console.error(err);
    }
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
    return '•••• •••• •••• ' + number;
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
            <p>No cards added yet.</p>
          ) : (
            cards.map((card, index) => (
              <div
                key={card.id ?? index }
                className="bg-indigo-600 text-white p-5 rounded flex justify-between items-center"
              >
                <div>
                  <p>{card.cardName}</p>
                  <p>{maskCard(card.cardNumber)}</p>
                  <p>Exp: {card.expiry}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(card)}
                    className="lg:w-20 bg-yellow-400 text-black px-2 py-2 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(card.id)}
                    className="lg:w-20 bg-red-500 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
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
                    className="bg-blue-600 text-white px-3 py-2 rounded"
                  >
                    {isEditing ? "update" : "Save"}
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

export default Cards;