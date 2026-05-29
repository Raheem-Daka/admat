import React, { useState, useEffect } from "react";
import ProfileSidePanel from "../../components/ProfileSidePanel";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/api";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);

  // ✅ Fetch user
  useEffect(() => {

    const fetchUser = async () => {
      try {
        const res = await apiFetch(`/account/profile/`, {
          method: "GET"
        });

        const data = await res.json();

        setUser({
          username: data.username,
          email: data.email,
          image: data.image || null,
        });

        setPreview(data.imageUrl || null);
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchUser();
  }, []);

  //save profile
  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();

      formData.append("username", user.username);
      formData.append("email", user.email);

      if (user.image instanceof File) {
        formData.append("image", user.image);
      }

      const res = await apiFetch("/account/profile/", {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = errorData.detail || "Failed to update profile";
        throw new Error(errorMessage);
      }

      const data = await res.json();

      setPreview(data.imageUrl || preview);

      toast.message("Profile updated ✅");
    } catch (err) {
      console.error(err);
      toast.message("Failed to update profile ❌");
    } finally {
      setSaving(false)
    }
  };

  // handleImageChange
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Handle input change
  const handleUserChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };


  return (
    <div className="flex min-h-screen bg-gray-50">
      <ProfileSidePanel />

      <div className="flex-1 p-8 space-y-8">
        {loading ? (
          <div className="flex items-center justify-center py-auto gap-4">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-500">Loading your settings...</p>
          </div> 
          ) : (
          <>
            {/* HEADER */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
              <p className="text-gray-500 mt-1">Manage your account</p>
            </div>

            {/* PROFILE CARD */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h2 className="text-lg font-semibold mb-6">Profile</h2>

              <div className="flex flex-col items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={
                      preview ||
                      "https://via.placeholder.com/100?text=User"
                    }
                    alt="profile"
                    loading="eager"
                    className="w-24 h-24 rounded-full object-cover border "
                  />

                  <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700">
                    ✏️
                    <input
                      type="file"
                      hidden
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                {/* User Info */}
                <div className="xl:w-5xl lg:w-3xl flex-1 grid gap-3">
                  <input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleUserChange}
                    placeholder="Username"
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />

                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleUserChange}
                    placeholder="Email"
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>

            {/* PASSWORD CARD */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">Security</h2>

              <div className="xl:w-5xl lg:w-3xl grid gap-3 max-w-md">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="border p-3 rounded-lg"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="border p-3 rounded-lg"
                />

                <button className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">
                  Update Password
                </button>
              </div>
            </div>

            {/* PREFERENCES CARD */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Notifications</h2>
                <p className="text-gray-500 text-sm">
                  Receive updates and alerts
                </p>
              </div>

              <button className="px-5 py-2 rounded-full bg-indigo-600 text-white">
                Enabled
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;