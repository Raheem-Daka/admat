import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "../../utils/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Payments = () => {
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [method, setMethod] = useState("stripe");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  const handlePayment = async () => {
    const token = user?.token;

    if (!token) {
      toast.error("Not authenticated, Please Sign In to continue.");
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
          toast.error("Invalid payment method, Please choose another method.");
      }

    } catch (err) {
      toast.error("Payment failed.Please try again.");
    } finally {
      setProcessing(false);
    }
  };


  const simulateSuccess = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    await axios.post(
      `${API_BASE}/orders/`,
      { payment_method: method },
      authConfig,
    );

    toast.success("Payment successful ✅. Thank you for your purchase");
    navigate("/orders");
  };

  //Mpamba
  const handleMpamba = async () => {
    toast.info("Processing Mpamba payment...");

    await axios.post(
      `${API_BASE}/payments/mpamba/`, 
      {},
      authConfig);

    await simulateSuccess();
    };

  //Airtel Money
  const handleAirtel = async () => {
    toast.info("Processing Airtel Money...");

    await axios.post(
      `${API_BASE}/payments/airtel/`, 
      {},
      authConfig);

    await simulateSuccess();
  };

//Stripe
const handleStripe = async () => {
  toast.info("Redirecting to card payment...");

  // Example backend call
  await axios.post(
    `${API_BASE}/payments/stripe/`, 
    {}, 
    authConfig);

  // simulate success
  await simulateSuccess();
};


//Pay Pal
const handlePaypal = async () => {
  toast.info("Redirecting to PayPal...");

  await axios.post(
    `${API_BASE}/payments/paypal/`, 
    {},
    authConfig);

  await simulateSuccess();
};

  return (
    <div className="flex flex-col items-center justify-center h-screen px-6">
      <h1 className="text-3xl font-bold mb-4">Payment</h1>

      <p className="text-gray-500 mb-4">
        Choose a payment method
      </p>

      {/* Payment selector */}
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className="border p-3 rounded mb-6 w-full max-w-sm"
      >
        <option value="stripe">Visa / Card (Stripe)</option>
        <option value="paypal">PayPal</option>
        <option value="airtel">Airtel Money</option>
        <option value="mpamba">TNM Mpamba</option>
      </select>

      <button
        onClick={handlePayment}
        disabled={processing}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </div>  
  );
};

export default Payments;
