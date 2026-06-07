import React, { useState, useEffect } from "react";
import ProfileSidePanel from "../../components/ProfileSidePanel";
import { apiFetch } from "../../api/api";
import { toast } from "sonner";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PasswordStrength from "../../components/PasswordStrength";
import { getPasswordStrength ,generatePassword, getPasswordRules } from "../../utils/passwords";
import { FaExclamationTriangle } from "react-icons/fa";

const Settings = () => {

  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [saving, setSaving] = useState(false);
  const [suggested, setSuggested] = useState("");
  const password = passwords.new_password;
  const strength = getPasswordStrength(passwords?.new_password || "");
  const rules = getPasswordRules(passwords?.new_password || "");

  //2FA State
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [otp, setOtp] = useState("");

  const [sessions, setSessions] = useState([]);
  const [showDisableModal, setShowDisableModal] = useState(false);

  //logout all sessions
  const logoutSession = async (id) => {
    try {
      await apiFetch(`/sessions/${id}/logout/`, { method: "POST" });
      setSessions((prev) => prev.filter(s => s.id !== id));
      toast.success("Session removed ✅");
    } catch {
      toast.error("Error logging out ❌");
    }
  };

  const logoutAllSessions = async () => {
    try {
      await apiFetch("/sessions/logout-all/", { method: "POST" });
      setSessions([]);
      toast.success("All sessions logged out ✅");
    } catch {
      toast.error("Failed ❌");
    }
  };

  useEffect(() => {
    fetchSessions();
    fetch2FAStatus();
  }, []);

  const fetchSessions = async () => {
    try {
      const data = await apiFetch("/sessions/");
      setSessions(data);
    } catch {
      toast.error("Failed to load sessions ❌");
    }
  };


  //2FA handler
  const handleToggle2FA = async () => {
    try {
      if (!twoFAEnabled) {
        const res = await apiFetch("/2fa/setup/");

        if (res.message === "2FA already enabled") {
          setTwoFAEnabled(true);
          toast.success("2FA already enabled ✅");
          return;
        }

        setQrCode(res.qr_code);
      } else {
        await apiFetch("/2fa/disable/", { method: "POST" });
        setTwoFAEnabled(false);
        toast.success("2FA disabled ✅");
      }
    } catch {
      toast.error("Failed to toggle 2FA ❌");
    }
  };
  
    //Enable 2FA
    if (!twoFAEnabled) {
      const res = async () => {
        await apiFetch("/2fa/setup/");
              
          if (res.message === "2FA already enabled") {
            setTwoFAEnabled(true);
            toast.success("2FA Enabled ✅");
            return;
          }

          setQrCode(res.qr_code);
        }        
      } 
    // Disable 2FA
    const disable2FA = async () => {
      await apiFetch("/2fa/disable/", {
        method: "POST"
      });
    };

    //Fetch 2FA status
    const fetch2FAStatus = async () => {
      try {
        const res = await apiFetch("/2fa/status/");
        setTwoFAEnabled(res.enabled);
      } catch {
        toast.error("Failed to load 2FA status");
      }
    };

    // Verify OTP
    const verifyOTP = async () => {
      try{
      await apiFetch("/2fa/verify/", {
        method: "POST",
        body: JSON.stringify({ otp }),
      });
      setTwoFAEnabled(true);
      setQrCode("");
      setOtp("");
      toast.success("2FA enabled ✅");
    } catch {
      toast.error("Invalid OTP ❌");
    }
  };

  // ✅ handle input change
  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ update password
  const handlePasswordUpdate = async () => {
    // ✅ VALIDATION FIRST
    if (
      !passwords.current_password ||
      !passwords.new_password ||
      !passwords.confirm_password
    ) {
      toast.error("All fields are required ❌");
      return;
    }

    if (passwords.new_password !== passwords.confirm_password) {
      toast.error("Passwords do not match ❌");
      return;
    }

    if (passwords.new_password.length < 6) {
      toast.error("Password must be at least 6 characters ❌");
      return;
    }

    try {
      setSaving(true);

      await apiFetch("/change-password/", {
        method: "POST",
        body: JSON.stringify({
          current_password: passwords.current_password,
          new_password: passwords.new_password,
        }),
      });

      toast.success("Password updated successfully ✅");
      // reset fields
      setPasswords({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      setShowPassword({
        current: false,
        new: false,
        confirm: false,
      });

    } catch (err) {
      console.error(err);
      const message = 
        err?.response?.data?.message ||
        err.message ||
        "Failed to update password ❌"

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <ProfileSidePanel />

      <div className="flex-1 p-6 max-w-4xl mx-auto">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account</p>
        </div>

        {/* PASSWORD CARD */}
        <div>
          <form 
          onSubmit={(e) => {
            e.preventDefault();
            handlePasswordUpdate();
          }}
          className="bg-white p-6 rounded border border-gray-300  mt-6">
            <h2 className="text-xl text-gray-500 font-semibold mb-4">Security</h2>

            <div className="space-y-4">
              {/* Current password */}
              <div className="relative">
                <input
                  type={showPassword.current ? "text" : "password"}
                  name="current_password"
                  placeholder="Current Password"
                  value={passwords.current_password}
                  onChange={handlePasswordChange}
                  className="border border-orange-300 focus:outline-none focus:ring focus:ring-orange-500 focus:border-orange-500 p-3 rounded-lg w-full pr-10 transition text-sm"
                />

                <span
                  role="button"
                  aria-label="Toggle password visibility"
                  tabIndex={0}

                  onClick={() =>
                    setShowPassword(prev => ({ 
                      ...prev,
                      current: !showPassword.current }))
                  }
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                >
                  {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* New Password */}
              <div className="relative">
                <input
                  type={showPassword.new ? "text" : "password"}
                  name="new_password"
                  placeholder="New Password"
                  value={passwords.new_password}
                  onChange={handlePasswordChange}
                  className="border border-orange-300 focus:outline-none focus:ring focus:ring-orange-500 focus:border-orange-500 p-3 rounded-lg w-full pr-10 transition text-sm"
                />

                <span              
                  role="button"
                  aria-label="Toggle password visibility"
                  tabIndex={0}

                  onClick={() =>
                    setShowPassword(prev => ({ 
                      ...prev, 
                      new: !showPassword.new 
                    }))
                  }
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                >
                  {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                </span>

                  <button
                    type="button"
                    onClick={() => setSuggested(generatePassword())}
                    className="text-xs text-orange-600 mt-1 block hover:underline hover:text-orange-800"
                  >
                    Suggest password 🔐
                  </button>
                
                  {suggested && (
                    <div className="mt-2 p-2 border rounded bg-gray-50 text-sm flex justify-between items-center">
                      <span className="font-mono">{suggested}</span>
                
                      <div className="flex gap-2">
                        {/* USE BUTTON */}
                        <button
                          type="button"
                          onClick={() => {
                            setPasswords( prev =>({
                              ...prev,
                              new_password: suggested,
                              confirm_password: suggested,
                            }));
                            setSuggested("");
                          }}

                          className="text-orange-600 hover:underline text-xs"
                        >
                          Use
                        </button>

                        {/* REGENERATE BUTTON */}
                        <button
                          type="button"
                          onClick={() => setSuggested(generatePassword())}
                          className="text-orange-600 hover:underline text-xs"
                        >
                          Regenerate
                        </button>

                        {/* COPY BUTTON */}
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(suggested)
                            toast.success("Password copied ✅")
                          }}
                          className="text-orange-600 hover:underline text-xs hover:underline"
                        >
                          Copy
                        </button>
                
                      </div>
                    </div>
                  )}
                
                {/* Strength Meter */}
                <div className="mt-3">
                  <PasswordStrength 
                  password={password}
                  strength={strength}
                  rules={rules}/>
                </div>
                
              </div>


              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirm_password"
                  placeholder="Confirm New Password"
                  value={passwords.confirm_password}
                  onChange={handlePasswordChange}
                  className="border border-orange-300 focus:outline-none focus:ring focus:ring-orange-500 focus:border-orange-500 p-3 rounded-lg w-full pr-10 transition text-sm"
                />

                <span              
                  role="button"
                  aria-label="Toggle password visibility"
                  tabIndex={0}

                  onClick={() =>
                    setShowPassword(prev => ({ 
                      ...prev,
                      showPassword, 
                      confirm: !showPassword.confirm }))
                  }
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                >
                  {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                </span>
                
                {/* confirmation checker */}
                {passwords.confirm_password && (
                  <p className={`text-xs mt-2 ${
                    passwords.new_password === passwords.confirm_password
                      ? "text-green-600"
                      : "text-red-500"
                  }`}>
                    {passwords.new_password === passwords.confirm_password
                      ? "Passwords match ✅"
                      : "Passwords do not match ❌"}
                  </p>
                )}
                


              </div>
            </div>

            {/* Button */}
            <div className="mt-5">
              <button
              type="submit"
              disabled={
                saving ||
                !strength ||
                strength?.label !== "Very Strong 💪" ||
                passwords.new_password !== passwords.confirm_password
              }

              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>

        </div>

        {/* 2FA */}
        <div className="bg-white p-6 mt-6 rounded border border-gray-300">
          <h2 className="text-lg font-semibold text-gray-500">Two-Factor Authentication</h2>

          <p className="text-sm text-gray-500 mt-1">
            Add extra security to your account
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm">
              Status: {twoFAEnabled ? "Enabled ✅" : "Disabled ❌"}
            </span>

            <button
              onClick={() => {
                if (twoFAEnabled) {
                  setShowDisableModal(true); // ✅ open modal
                } else {
                  handleToggle2FA(); // ✅ enable directly
                }
              }}
              className={`px-4 py-2 rounded text-white ${
                twoFAEnabled ? "bg-red-500" : "bg-green-600"
              }`}
            >
              {twoFAEnabled ? "Disable" : "Enable"}
            </button>

          </div>

          {/* QR Code (only when enabling) */}
        {qrCode && (
          <div className="mt-6 flex flex-col items-center">
            <p className="text-sm sm:text-base mb-3 font-medium">
              Scan this QR code:
            </p>

            <img
              src={qrCode}
              alt="QR Code"
              className="
                w-40 h-40       /* default mobile */
                sm:w-52 sm:h-52 /* tablets */
                md:w-60 md:h-60 /* small laptops */
                lg:w-72 lg:h-72 /* large screens */
                rounded-xl shadow-md
              "
            />

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="
                border border-orange-600 text-sm p-3 mt-4 w-full max-w-xs 
                rounded-lg text-center text-lg
                focus:outline-none focus:ring-2 focus:ring-orange-500
              "
            />

            <button
              onClick={verifyOTP}
              className="
                mt-4 bg-orange-600 hover:bg-orange-700 
                text-white px-6 py-3 rounded-lg 
                text-sm sm:text-base transition
              "
            >
              Verify OTP
            </button>
          </div>
        )}</div>

        {/*Show Modal */}
        {showDisableModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
            
            <div className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-sm text-center">
              <p className="text-sm text-red-500 flex justify-center mb-4 font-medium">
                <FaExclamationTriangle size={24}/>
              </p>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Disable 2FA?
              </h3>


              <p className="text-sm text-gray-500 mb-4">
                This will remove an extra layer of security from your account.<br/> Do you reallly want to continue?
              </p>

              <div className="flex justify-center gap-3 mt-4">

                {/* Cancel */}
                <button
                  onClick={() => setShowDisableModal(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>

                {/* Confirm */}
                <button
                  onClick={async () => {
                    try {
                      await apiFetch("/2fa/disable/", { method: "POST" });
                      setTwoFAEnabled(false);

                      toast.success("2FA disabled ✅");
                    } catch {
                      toast.error("Failed to disable ❌");
                    } finally {
                      setShowDisableModal(false);
                    }
                  }}
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Disable
                </button>

              </div>
            </div>
          </div>
        )}


        {/* Logout of all sessions */}
        <div className="bg-white p-6 mt-6 rounded border border-gray-300">
          <h2 className="text-lg font-semibold text-gray-500">Active Sessions</h2>

          <ul className="mt-4 space-y-3">
            {sessions.map((s) => (
              <li key={s.id} className="flex justify-between items-center border border-gray-300 p-3 rounded">
                <div className="">
                  <p className="text-sm font-medium">{s.device}</p>
                  <p className="text-xs text-gray-500">
                    {s.location} • {s.last_active}
                  </p>
                </div>

                <button
                  onClick={() => logoutSession(s.id)}
                  className="text-red-500 text-xs lg:max-w-20 hover:underline"
                >
                  Logout
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={logoutAllSessions}
            className="mt-4 w-full bg-red-600 text-white py-2 rounded"
          >
            Logout from all devices
          </button>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 mt-6 rounded shadow-sm border border-gray-300  flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-500">Notifications</h2>
            <p className="text-gray-500 text-sm">
              Receive updates and alerts
            </p>
          </div>

          <button
          disabled 
          className="px-5 py-2 rounded bg-orange-600 text-white">
            Enabled
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;