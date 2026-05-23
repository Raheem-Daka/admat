import React, { useState } from 'react';
import ProfileSidePanel from '../../components/ProfileSidePanel';

const Settings = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
  });

  const [preferences, setPreferences] = useState({
    notifications: true,
  });

  // Handle profile change
  const handleUserChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  // Handle preferences toggle
  const togglePreference = () => {
    setPreferences({
      ...preferences,
      notifications: !preferences.notifications,
    });
  };

  return (
    <div className="flex min-h-screen">
      <ProfileSidePanel />

      <div className="p-6 w-full space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        {/* PROFILE INFO */}
        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">
            Profile Information
          </h2>

          <div className="grid gap-3">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={user.name}
              onChange={handleUserChange}
              className="border p-2 rounded"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={handleUserChange}
              className="border p-2 rounded"
            />

            <button className="bg-blue-600 text-white p-2 rounded">
              Save Changes
            </button>
          </div>
        </div>

        {/* PASSWORD */}
        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">
            Change Password
          </h2>

          <div className="grid gap-3">
            <input
              type="password"
              name="current"
              placeholder="Current Password"
              value={passwords.current}
              onChange={handlePasswordChange}
              className="border p-2 rounded"
            />

            <input
              type="password"
              name="new"
              placeholder="New Password"
              value={passwords.new}
              onChange={handlePasswordChange}
              className="border p-2 rounded"
            />

            <button className="bg-green-600 text-white p-2 rounded">
              Update Password
            </button>
          </div>
        </div>

        {/* PREFERENCES */}
        <div className="bg-white p-5 rounded shadow flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">
              Notifications
            </h2>
            <p className="text-sm text-gray-500">
              Enable or disable email notifications
            </p>
          </div>

          <button
            onClick={togglePreference}
            className={`px-4 py-2 rounded text-white ${
              preferences.notifications
                ? 'bg-green-600'
                : 'bg-gray-400'
            }`}
          >
            {preferences.notifications ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
