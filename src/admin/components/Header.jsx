import React, { useState } from "react";
import { FiUser } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GoHomeFill } from "react-icons/go";
import { useLogoutAdminMutation } from "../redux/authApi/authApi";
import { clearToken } from "../redux/authSlice";

const Header = ({ setSearchQuery }) => {

  const [logoutAdmin, { isLoading }] = useLogoutAdminMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");


  const handleLogout = async () => {
    try {
      await logoutAdmin().unwrap();
      dispatch(clearToken());
      localStorage.removeItem("token");
      setDropdownOpen(false);
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchText);
  };

  return (
    <>
      <header className="bg-[#2D461D] p-4 border-b border-gray-300 
                   fixed top-0 left-0 w-full z-50">
        <div className="flex items-center justify-between">
          <div className="lg:ml-14 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <ul className="flex gap-6 font-bold">
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center text-lg gap-2 hover:text-[#A9FF67] ${isActive ? "text-[#A9FF67] font-semibold" : "text-white"
                    }`
                  }
                >
                  <GoHomeFill className="text-lg mb-1" />
                  <span>Dashboard</span>
                </NavLink>
              </li>
            </ul>

            {/* 🔍 Search */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search by ID / Name / Contact No"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-black text-sm border focus:outline-none focus:ring-2 focus:ring-[#A9FF67]"
              />
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 rounded-lg bg-[#A9FF67] text-black text-sm font-semibold hover:bg-[#8fe34f] transition"
            >
              Search
            </button>
          </div>

          {/* 🟢 Admin / Login */}
          <div className="relative">
            <div
              className="flex items-center gap-3 border px-3 py-1 border-black rounded-xl cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="bg-green-800 rounded-full p-2 text-white">
                <FiUser />
              </div>
              <span className="text-sm text-white font-medium">
                {token ? "Admin" : "Login"}
              </span>
            </div>

            {dropdownOpen && token && (
              <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="pt-20">
        <Outlet />
      </div>

    </>
  );
};

export default Header;
