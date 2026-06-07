import React, { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";
import { toast } from "sonner";
import placeHolder from "../../assets/placeHolder.png";
import ProfileSidePanel from "../../components/ProfileSidePanel";
import { ACCESS_TOKEN_KEY } from "../../utils/authKeys";
import { useAuth } from "../../utils/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const {user, setUser} = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0)

  const fileInputRef = React.useRef(null);

  const validateImage = (file) => {
    if (!file) return false;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return false;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Max file size is 2MB");
      return false;
    }

    return true;
  };

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

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  useEffect(() => {
    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener("dragover", preventDefaults);
    window.addEventListener("drop", preventDefaults);

    return () => {
      window.removeEventListener("dragover", preventDefaults);
      window.removeEventListener("drop", preventDefaults);
    };
  }, []);

  // ✅ Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if(!file) return;

    if (!validateImage(file)) return;

    const objectUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(objectUrl); 
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!validateImage(file)) return;

    const objectUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(objectUrl);
  };  
  
  // ✅ Save profile
  const handleSave = async () => {
    try {
      if (!formData.username.trim() || !formData.email.trim()) {
        toast.error("Username and email are required");
        return;
      }

      const hasChanges =
        formData.username !== user.username ||
        formData.email !== user.email ||
        formData.image;

      if (!hasChanges) {
        toast.info("No changes to save");
        return;
      }

      setSaving(true);


      const form = new FormData();
      form.append("username", formData.username);
      form.append("email", formData.email);
      if (formData.image) {
        form.append("image", formData.image);
      }

      const xhr = new XMLHttpRequest();
      xhr.open("PATCH", `${API_BASE}/profile/`); 

      // ✅ Auth header with token from localStorage
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }
      
      // ✅ Track upload progress
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.response);

          setProgress(100); 

          localStorage.setItem("user", JSON.stringify(data));
          window.dispatchEvent(new Event("userUpdated"));


          setTimeout(() => {   
            setSaving(false);

            setUser(data);

            const resetForm = (data) => {
              setFormData({
                username: data.username,
                email: data.email,
                image: null,
              });
            };

            setPreview(data.imageUrl || null);
            setIsEditing(false);
            setProgress(0);

            toast.success("Profile updated ✅");
          }, 1000);

        } else {
          setSaving(false);
          toast.error("Failed to update profile");
        }
      };


      xhr.onerror = () => {
        setSaving(false);
        toast.error("Upload failed");
      };

      xhr.send(form);

    } catch (err) {
      console.log(err);
      setSaving(false);
      toast.error("Something went wrong");
    }
  };  

    useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(0);
    }, 2000);

    // ✅ cleanup (VERY IMPORTANT)
    return () => clearTimeout(timer);
  }, [progress]);


  return (

    <div className="flex min-h-screen overflow-x-hidden">
        <ProfileSidePanel />      
      <div className="flex-1 p-6 transition-all duration-300">
        <div className="rounded lg:max-w-4xl mx-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 h-screen">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-500">Loading profile...</p>
            </div>

          ) : (
            <>
          {/* ✅ HEADER */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="font-bold text-2xl">
                {isEditing ? (
                  <>
                    Editing{" "}
                    <span className="text-orange-600">
                      {user?.username || "User"}
                    </span>
                    's profile
                  </>
                ) : (
                  <>
                    <span className="text-orange-600">
                      {user?.username || "User"}
                    </span>{" "}
                    's profile
                  </>
                )}
              </h1>
            </div>
            {/* Profile Image */}
            <div className="relative flex flex-col items-center justify-center">

              {/* Drag & Drop Area */}
              <div
                onDragOver={isEditing ? handleDragOver : undefined}
                onDragLeave={isEditing ?  handleDragLeave : undefined}
                onDrop={isEditing ? handleDrop : undefined}
                className={`border relative w-28 h-28 rounded-full border-2 flex items-center justify-center overflow-hidden cursor-pointer transition
                  ${isDragging ? "border border-orange-600 bg-orange-50" : "border-gray-300 border"}
                  ${isEditing ? "hover:border-orange-400" : ""}
                `}
              >
                <img
                  src={preview || placeHolder}
                  alt="profile"
                  className="w-full h-full object-cover"
                />

                {/* Overlay when editing */}
                {isEditing && (
                  <div className="absolute inset-0 pointer-events-none bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-xs text-center px-2">
                    Drop image or click
                  </div>
                )}

                {/* Hidden file input */}
                {isEditing && (
                  <input
                  ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                )}
              </div>
            </div>
          </div>

          {/* ✅ PROGRESS BAR */}
          <div>
          {saving && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-orange-600 h-full transition-[width] duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* ✅ Percentage BELOW bar */}
              <p className="text-xs text-gray-500 mt-1 text-right">
                Uploading: {progress}%
              </p>
            </div>
          )}
          </div>

          <div className="flex flex-col items-center mt-4">
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
                className="cursor-pointer rounded bg-linear-to-b from-orange-600 to-orange-800 text-orange-100 transition hover:from-orange-700 hover:to-orange-900 py-3 px-2"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => { 
                    setFormData({
                      username: user.username,
                      email: user.email,
                      image: null,
                    });
                    setPreview(user.imageUrl || null);
                    setIsEditing(false)}}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={!isEditing || saving}
                  className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  {saving && (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  { saving ? "" : "Save" }
                </button>
              </>
            )}

          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;