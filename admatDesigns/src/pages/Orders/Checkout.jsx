import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../utils/AuthContext";
import { apiFetch } from "../../api/api";
import { FaChevronDown } from "react-icons/fa";


  const Checkout = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addresses, setAddresses] = useState([])
    const [placingOrder, setPlacingOrder] = useState(false);
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      const handleClickOutside = () => setIsOpen(false);

      if (isOpen) {
        document.addEventListener("click", handleClickOutside);
      }

      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, [isOpen]);
   

    const [formData, setFormData] = useState({
      full_name: "",
      phone: "",
      address: "",
      city: "",
      payment_method: "cod",
    });

  const placeOrder = async () => {
    if(placingOrder) return

    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (
      !formData.full_name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim()
    ) {
      toast.error("Please fill in all shipping details");
      return;
    }

    try {
      setPlacingOrder(true);

      //const token = user?.token;

      if (formData.payment_method === "cod") {
        await apiFetch(`/orders/`,{
            method: "POST",  
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify({
              ...formData,
              address_id: selectedAddress,
            }),
          }
        );

        toast.success("Order placed successfully ✅");
        navigate("/orders");

      } else {

        // Go to payment page for online
        navigate("/payments");
      }

    } catch (err) {

      console.log("ERROR RESPONSE:", err);

      const message = 
        err?.data?.message || 
        err?.message || 
        "Failed to place order, Please try again";

      toast.error(message);
    } finally {
      setPlacingOrder(false);
    }
  };

  useEffect(() => {
    const savedId = localStorage.getItem("last_address_id");

    if (savedId) {
      setSelectedAddress(Number(savedId));
    }
  }, []);


  useEffect(() => {
    if (selectedAddress) {
      localStorage.setItem("last_address_id", selectedAddress);
    }
  }, [selectedAddress]);

  // Fetchaddress
  const fetchAddresses = async () => {
    try {
      const data = await apiFetch("/addresses/");
      const formatted = formatAddresses(data);

      console.log("RAW DATA:", data);         // ✅ correct debug
      console.log("FORMATTED:", formatted);   // ✅ correct debug

      setAddresses(formatted);

    } catch (err) {
      console.log("Address fetch error:", err);
    }
  };  

  useEffect(() => {
    if (!Array.isArray(addresses) || addresses.length === 0) return;

    if (!selectedAddress) {
      const defaultAddr =
        addresses.find(a => a.is_default) || addresses[0];

      setSelectedAddress(defaultAddr.id);
    }
  }, [addresses, selectedAddress]);

  // Address fromat
  const formatAddresses = (data) => {
    const results = data?.results || data || [];

    return results.map((addr) => ({
      id: addr.id,
      full_name: addr.full_name,
      phone: addr.phone,
      city: addr.city,
      street: addr.street,
      is_default: addr.is_default,
    }));
  };
  // Default Address
  const selectedFullAddress = useMemo(() => {
    if (!Array.isArray(addresses) || addresses.length === 0) 
      return null;
    
      return (
        addresses.find(a => a.id === selectedAddress) ||
        addresses.find(a => a.is_default) ||
        addresses[0]
      );
    }, [addresses, selectedAddress]);


  //Auto select Default address
  useEffect(() => {
    if (!selectedFullAddress) return;

    setFormData(prev => ({
      ...prev,
      full_name: selectedFullAddress.full_name || "",
      phone: selectedFullAddress.phone || "",
      address: selectedFullAddress.street || "",
      city: selectedFullAddress.city || "",
    }));
  }, [selectedFullAddress]);


  useEffect(() => {
    const token = user?.token;
    
    if (!token) {
      toast.error("Session expired. Please sign in again.")
      navigate("/signin");
      return;
    }

    fetchCart();
    fetchAddresses();
  }, [user?.token]);

  const handleSelectAddress = (addr) => {
    setSelectedAddress(addr.id);

    setFormData(prev => ({
      ...prev,
      full_name: addr.full_name,
      phone: addr.phone,
      address: addr.street,
      city: addr.city,
    }));
  };

  const fetchCart = async () => {
    try {
      const data = await apiFetch(`/cart/`, {
      });

      if (!data?.items?.length) {
        toast.info("Your cart is empty 🛒");
        setTimeout(() => {
          navigate("/cart");
        }, 1000)
        return;
      }

      setCart(data);
    } catch (err) {

    if (err.response) {
        console.log("SERVER ERROR:", err.response.data);
      } else if (err.request) {
        console.log("NO RESPONSE FROM SERVER");
      } else {
        console.log("REQUEST SETUP ERROR:", err.message);
      }
      
      toast.error("Failed to load checkout items");
      navigate("/cart");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 800)
    }
  };

  if (loading) {
    return (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-500">Loading checkout items...</p>
          </div>
    );
  }  
  if (!cart) return null;

  const subtotal = cart.items.reduce(
    (sum, ci) =>
      sum + Number(ci.item.current_price) * ci.quantity,
    0
  );

  const deliveryFee = cart.delivery_fee ?? 5000;
  const total = Number(cart.total ?? subtotal + deliveryFee);

  return (
    <>

      {Array.isArray(addresses) && addresses.length === 0 && (
        <div className="p-4 border rounded bg-yellow-50 text-center">
          <p className="mb-2 text-sm text-gray-600">
            You don’t have any saved addresses.
          </p>
          <button
            onClick={() => navigate("/account/addresses")}
            className="text-orange-600 font-semibold"
          >
            Add Address
          </button>
        </div>
      )}     

      <form
        onSubmit={(e) => {
          e.preventDefault();
          placeOrder();
        }}
        className="mt-10 px-6 py-5 bg-white shadow max-w-6xl mx-auto grid lg:grid-cols-2 gap-8"
      >
        {/* ✅ LEFT SIDE (Checkout form) */}
        <div>
          <h1 className="font-semibold text-2xl text-gray-500 mb-5">Checkout</h1>

          {/* selected address */}
<div className="relative w-full max-w-6xl mx-auto">
  <button
  type="button"
    onClick={(e) => {
      e.stopPropagation(); // ✅ prevent closing
      setIsOpen(prev => !prev);
    }}
    className="flex justify-between items-center w-full border p-3 rounded border-orange-300 text-left bg-white"
  >    
  {selectedFullAddress
      ? `${selectedFullAddress.full_name} — ${selectedFullAddress.city}`
      : "Select delivery address"
  }
  <FaChevronDown />
  </button>

  {isOpen && (
    <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto animate-fadeIn">
      {addresses.map(addr => (
        <div
          key={addr.id}
          onClick={() => {
            handleSelectAddress(addr);
            setIsOpen(false);
          }}
          className={`p-3 cursor-pointer transition flex justify-between items-center ${
            selectedAddress === addr.id
              ? "bg-orange-100 border-l-4 border-orange-500"
              : "hover:bg-orange-50"
          }`}        
          >
          <p className="font-medium">{addr.full_name}</p>
          <p className="text-sm">
            {addr.street}, {addr.city}
          </p>
        </div>
        
      ))}
    </div>
  )}
</div>
          {selectedFullAddress && (
            <div className="my-3 py-3  rounded">
              <div>
                <h2 className="font-semibold text-xl text-gray-500">selected address</h2>
              </div>
              <div className="text-orange-200 bg-orange-600 rounded p-3">
                <p className="uppercase font-semibold">{selectedFullAddress.full_name}</p>
                <p>{selectedFullAddress.street}, {selectedFullAddress.city}</p>
                <p className="text-sm">{selectedFullAddress.phone}</p>

              </div>
            </div>
          )}

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              className="w-full border p-3 rounded border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />

            <input
              type="text"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full border p-3 rounded border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />

            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full border p-3 rounded border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />

            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="w-full border p-3 rounded border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="my-6">
            <h2 className="font-semibold text-gray-500 text-xl mb-3">Payment Method</h2>
            <select
              value={formData.payment_method}
              onChange={(e) =>
                setFormData({ ...formData, payment_method: e.target.value })
              }
              className="w-full border p-3 rounded border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="cod">Cash on Delivery</option>
              <option value="online">Online Payment</option>
            </select>
          </div>
        </div>

        {/* ✅ RIGHT SIDE (Order Summary) */}
        <div>
          <h2 className="font-semibold text-2xl text-gray-500  mb-5">Order Summary</h2>

          <div className="space-y-4">
            {cart.items.map((ci) => (
              <div
                key={ci.id}
                className="flex justify-between text-sm"
              >
                <div>
                  <p className="font-medium">{ci.item.name}</p>
                  <p className="text-gray-500">Qty: {ci.quantity}</p>
                </div>

                <p className="font-semibold">
                  MWK {(ci.item.current_price * ci.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <hr className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>MWK {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span>MWK {deliveryFee.toFixed(2)}</span>
            </div>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>MWK {total.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            disabled={
              placingOrder ||
              !Array.isArray(addresses) ||
              addresses.length === 0 ||
              !selectedAddress
            }            
            className="mt-6 w-full rounded bg-linear-to-b from-orange-600 to-orange-800 hover:from-orange-700 hover:to-orange-900 text-white px-4 py-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {placingOrder ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Placing order...
              </span>
            ) : (
              "Place order"
            )}          
          </button>
        </div>
      </form>
    </>
  );
};

export default Checkout;

