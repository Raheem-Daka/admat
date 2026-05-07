import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

const ProfileSidePanel = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken")
        navigate("/", {replace: true})
    }

    const profileLinks = [
        {label: "Account", path: "/profile"},
        {label: "Settings", path: "/settings"},
    ]

  return (
    <div className="hidden lg:relative lg:block lg:w-1/4 min-h-screen bg-indigo-700">
        {profileLinks.map((link, i) => (
            <NavLink
                key={i}
                to={link.path}
                className={({ isActive }) =>
                    `flex items-center px-5 py-3 transition ${
                isActive
                    ? " bg-white  text-indigo-700 font-semibold"
                    : " text-white py-3 my-1 hover:bg-indigo-400"
                    }`
                }
            >
                {link.label}
            </NavLink>
        ))}

        <div className="border-t border-white pt-5 mt-10">
            <button 
            className="bg-red-600 w-full py-3 text-white" 
            onClick={logout}
>Logout</button>
        </div>
    </div>
  )
}

export default ProfileSidePanel