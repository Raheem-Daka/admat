import React from "react";
import ProfileSidePanel from "../components/ProfileSidePanel";

const AccountPage = () => {
  return (
    <div className="flex min-h-screen">
      
      {/* LEFT SIDEBAR */}
      <ProfileSidePanel />

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Account Dashboard</h1>

        <p className="mt-4 text-gray-600">
          Welcome to your account page. Here you can manage your orders,
          addresses, and settings.
        </p>
      </div>

    </div>
  );
};

export default AccountPage;