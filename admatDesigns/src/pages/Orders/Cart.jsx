import { useEffect, useState } from "react"
import axios from "axios"

const API_BASE = "http://127.0.0.1:8000"

const Cart = () => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("access_token")

  useEffect(() => {
    if (!token) {
      setCart(null)
      setLoading(false)
      return
    }

    fetchCart(token)
  }, [token])

  const fetchCart = async (authToken) => {
    try {
      const res = await axios.get(`${API_BASE}/api/cart/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      setCart(res.data)
    } catch (err) {
      console.error("Failed to load cart", err.response?.data || err)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return

    try {
      await axios.patch(
        `${API_BASE}/api/cart/items/${itemId}/`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      fetchCart(token)
    } catch (err) {
      console.error("Failed to update quantity", err.response?.data || err)
    }
  }

  const removeItem = async (itemId) => {
    try {
      await axios.delete(
        `${API_BASE}/api/cart/items/${itemId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      fetchCart(token)
    } catch (err) {
      console.error("Failed to remove item", err.response?.data || err)
    }
  }

  if (loading) {
    return <div className="p-6">Loading cart…</div>
  }

  if (!token) {
    return (
      <div className="p-6 text-center">
        Please log in to view your cart 🔐
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return <div className="p-6 text-center">Your cart is empty 🛒</div>
  }

  const total = cart.items.reduce(
    (sum, ci) => sum + Number(ci.item.current_price) * ci.quantity,
    0
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cart.items.map((ci) => (
          <div
            key={ci.id}
            className="flex gap-4 items-center border rounded-lg p-4"
          >
            <img
              src={`${API_BASE}${ci.item.image}`}
              alt={ci.item.name}
              className="w-24 h-24 object-cover rounded"
            />

            <div className="flex-1">
              <h2 className="font-semibold">{ci.item.name}</h2>
              <p className="text-gray-600">
                ${ci.item.current_price}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateQuantity(ci.item.id, ci.quantity - 1)
                }
                className="px-3 py-1 border rounded"
              >
                −
              </button>
              <span>{ci.quantity}</span>
              <button
                onClick={() =>
                  updateQuantity(ci.item.id, ci.quantity + 1)
                }
                className="px-3 py-1 border rounded"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeItem(ci.item.id)}
              className="text-red-500 hover:underline ml-4"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center border-t pt-6">
        <h2 className="text-xl font-semibold">
          Total: ${total.toFixed(2)}
        </h2>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
          Checkout
        </button>
      </div>
    </div>
  )
}

export default Cart