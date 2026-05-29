import { useEffect, useState } from "react";
import { useEffect, useState } from localStorage.getItem("cookie-consent");

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {

    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex flex-col items-center w-96 bg-white/80 backdrop-blur-xl text-gray-500 text-center p-6 rounded-xl border border-white/40 shadow-lg text-sm">

        <img
          className="w-14 h-14"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/cookies/cookieImage1.svg"
          alt="cookie"
        />

        <h2 className="text-gray-800 text-xl font-medium pb-3 mt-2">
          We care about your privacy
        </h2>

        <p className="w-11/12">
          This website uses cookies for functionality, analytics, and marketing.
          By accepting, you agree to our{" "}
          <a href="#" className="font-medium underline">
            Cookie Policy
          </a>.
        </p>

        <div className="flex items-center justify-center mt-6 gap-4 w-full">
          <button
            onClick={handleDecline}
            className="font-medium px-6 border border-gray-300 py-2 rounded hover:bg-gray-100 active:scale-95 transition"
          >
            Decline
          </button>

          <button
            onClick={handleAccept}
            className="bg-indigo-600 px-6 py-2 rounded text-white font-medium active:scale-95 hover:bg-indigo-700 transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}


