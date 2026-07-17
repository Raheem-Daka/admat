import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "../../utils/AuthContext";
import airtelMoney from "../../assets/BHARTIARTL.png"
import tnmMpamba from "../../assets/TNMMpamba.webp"
import payPal from "../../assets/PayPal.png"
import creditCard from "../../assets/CreditCard.jpg"
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Payments = () => {
  const [processing, setProcessing] = useState(false);
  const [method, setMethod] = useState("stripe");

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();

  const authConfig = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  const handlePayment = async () => {
    const token = user?.token;

    if (!token) {
      toast.error("Please sign in to continue.");
      navigate("/signin");
      return;
    }

    try {
      setProcessing(true);

      switch (method) {
        case "stripe":
          await handleStripe();
          break;

        case "paypal":
          await handlePaypal();
          break;

        case "airtel":
          await handleAirtel();
          break;

        case "mpamba":
          await handleMpamba();
          break;

        default:
          toast.error("Please select a payment method.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const simulateSuccess = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    await axios.post(
      `${API_BASE}/orders/`,
      {
        payment_method: method,
      },
      authConfig
    );

    toast.success("Payment successful ✅");

    navigate("/orders");
  };

  const handleStripe = async () => {
    if (!cardNumber || !expiryDate || !cvv) {
      toast.error("Please complete your card details.");
      return;
    }

    toast.info("Processing card payment...");

    await axios.post(
      `${API_BASE}/payments/stripe/`,
      {
        card_number: cardNumber,
        expiry_date: expiryDate,
        cvv,
      },
      authConfig
    );

    await simulateSuccess();
  };

  const handlePaypal = async () => {
    toast.info("Redirecting to PayPal...");

    await axios.post(
      `${API_BASE}/payments/paypal/`,
      {},
      authConfig
    );

    await simulateSuccess();
  };

  const handleAirtel = async () => {
    if (!phoneNumber) {
      toast.error("Please enter your Airtel number.");
      return;
    }

    toast.info("Processing Airtel Money payment...");

    await axios.post(
      `${API_BASE}/payments/airtel/`,
      {
        phone: phoneNumber,
      },
      authConfig
    );

    await simulateSuccess();
  };

  const handleMpamba = async () => {
    if (!phoneNumber) {
      toast.error("Please enter your TNM Mpamba number.");
      return;
    }

    toast.info("Processing Mpamba payment...");

    await axios.post(
      `${API_BASE}/payments/mpamba/`,
      {
        phone: phoneNumber,
      },
      authConfig
    );

    await simulateSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center">
          Complete Your Payment
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Select your preferred payment method
        </p>

        {/* Payment Methods */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">

          <button
            onClick={() => setMethod("stripe")}
            className={`text-left p-5 rounded-2xl border-2 transition ${
              method === "stripe"
                ? "border-orange-600 bg-orange-50"
                : "border-gray-200 hover:border-orange-300"
            }`}
          >
            <div className="flex items-center gap-4">
              <img src={creditCard}
                alt="Airtel Money"
                className="h-20 w-20 rounded-full object-cover"
              />

              <div className="flex flex-col justify-center">
                <h3 className="font-semibold">Credit / Debit Card</h3>
                <p className="text-sm text-gray-500">
                  Visa, Mastercard, Stripe
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setMethod("paypal")}
            className={`text-left p-5 rounded-2xl border-2 transition ${
              method === "paypal"
                ? "border-orange-600 bg-orange-50"
                : "border-gray-200 hover:border-orange-300"
            }`}
          >
            <div className="flex items-center gap-4">
              <img src={payPal}
                alt="Airtel Money"
                className="h-20 w-20 rounded-full object-cover"
              />

              <div className="flex flex-col justify-center">
                <h3 className="font-semibold">PayPal</h3>
                <p className="text-sm text-gray-500">
                  Secure PayPal checkout
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setMethod("airtel")}
            className={`text-left p-5 rounded-2xl border-2 transition ${
              method === "airtel"
                ? "border-orange-600 bg-orange-50"
                : "border-gray-200 hover:border-orange-300"
            }`}
          >
            <div className="flex items-center gap-4">
              <img src={airtelMoney}
                alt="Airtel Money"
                className="h-20 w-20 rounded-full object-cover"
              />

              <div className="flex flex-col justify-center">
                <h3 className="font-semibold">Airtel Money</h3>
                <p className="text-sm text-gray-500">
                  Mobile money payment
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setMethod("mpamba")}
            className={`text-left p-5 rounded-2xl border-2 transition ${
              method === "mpamba"
                ? "border-orange-600 bg-orange-50"
                : "border-gray-200 hover:border-orange-300"
            }`}
          >
            <div className="flex items-cente gap-4">
              <img src={tnmMpamba}
                alt="Airtel Money"
                className="h-20 w-20 object-cover"
              />

              <div className="flex flex-col justify-center">
                <h3 className="font-semibold">TNM Mpamba</h3>
                <p className="text-sm text-gray-500">
                  Mobile money payment
                </p>
              </div>
            </div>
          </button>

        </div>

        {/* Dynamic Form */}
        <div className="mb-6">

          {method === "stripe" && (
            <div className="space-y-4 animate-in fade-in">

              <input
                type="text"
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-500"
              />

              <div className="grid grid-cols-2 gap-4">

                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-500"
                />

                <input
                  type="password"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-500"
                />

              </div>
            </div>
          )}

          {method === "airtel" && (
            <input
              type="tel"
              placeholder="Enter Airtel Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-500"
            />
          )}

          {method === "mpamba" && (
            <input
              type="tel"
              placeholder="Enter TNM Mpamba Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-500"
            />
          )}

          {method === "paypal" && (
            <div className="bg-orange-50 border border-orange-100 p-5 rounded-xl">
              <p className="text-orange-700">
                You will be redirected to PayPal to complete your payment.
              </p>
            </div>
          )}

        </div>

        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-gradient-to-t from-orange-600 via-orange-400 to-orange-300 to hover:bg-indigo-700 text-white py-4 rounded-2xl font-semibold transition disabled:opacity-50"
        >
          {processing ? "Processing Payment..." : "Pay Now"}
        </button>

      </div>
    </div>
  );
};

export default Payments;