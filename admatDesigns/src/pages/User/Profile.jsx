import React, { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";
import { toast } from "sonner";
import placeHolder from "../../assets/placeHolder.png";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiFetch("/profile/");

        setUser(data);
        setFormData({
          username: data.username,
          email: data.email,
          image: null,
        });
        setPreview(data.imageUrl);

      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000)
      }
    };

    fetchProfile();
  }, []);

  // ✅ Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;
    const objectUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(objectUrl); 

    return () => URL.revokeObjectURL(objectUrl);
  };

  // ✅ Save profile
  const handleSave = async () => {
  try {  setSaving(true);
      if (
        formData.username === user.username &&
        formData.email === user.email &&
        !formData.image
      ) {
        toast.info("No changes to save");
        return;
      }

      const form = new FormData();
      form.append("username", formData.username);
      form.append("email", formData.email);

      if (formData.image) {
        form.append("image", formData.image);
      }

      const data = await apiFetch("/profile/", {
        method: "PATCH",
        body: form,
      });

      setUser(data);
      setFormData({
        username: data.username,
        email: data.email,
        image: null,
      });

      setPreview(data.imageUrl);
      setIsEditing(false);

      toast.success("Profile updated ✅");

    } catch (err) {
      console.log("Error updating profile:", err);

      const message =
        err?.error ||
        err?.detail ||
        "Failed to update profile";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">

        {/* ✅ HEADER */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="font-bold text-2xl">Editing <span className="text-indigo-600">{user?.username}</span>'s profile</h1>
          </div>

          {/* Profile Image */}
          <div className="relative flex flex-col items-center justify-center">
            <img
              src={preview || placeHolder}
              alt="profile"
              className="w-28 h-28 rounded-full object-cover border"
            />

            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 text-sm"
              />
            )}
          </div>

          <h2 className="text-xl font-bold mt-3">
            {user.username}
          </h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

        {/* ✅ FORM */}
        <div className="mt-6 space-y-4">

          <div>
            <label className="text-sm text-gray-500">Username</label>
            <input
              type="text"
              name="username"
              disabled={!isEditing}
              value={formData.username}
              onChange={handleChange}
              className="w-full mt-1 border p-2 rounded disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Email</label>
            <input
              type="email"
              name="email"
              disabled={!isEditing}
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 border p-2 rounded disabled:bg-gray-100"
            />
          </div>

        </div>

        {/* ✅ ACTION BUTTONS */}
        <div className="flex justify-between mt-6">

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                {saving && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                Save
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
``