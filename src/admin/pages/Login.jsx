import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/authSlice";
import { useLoginAdminMutation } from "../redux/authApi/authApi";

const AdminLogin = () => {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // RTK Query mutation hook
  const [loginAdmin, { isLoading, error }] = useLoginAdminMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginAdmin({
        contact,
        password,
      }).unwrap();

      console.log("Login successful:", result);
      dispatch(setToken(result.token));
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="">
      <div className="min-h-screen flex bg-[#0e2202]">
        {/* LEFT IMAGE SECTION */}
        <div className="hidden md:block w-full md:w-1/2">
          <img
            src="/farn.avif"
            alt="Buffelo"
            className="
      w-full
    h-full
    object-cover
    "
          />
        </div>

        {/* RIGHT LOGIN SECTION */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6">
          <div className="w-full max-w-lg text-white">
            <h1 className="text-5xl font-serif mb-2">Login</h1>
            <p className="text-xl text-gray-400 mb-10">
              Welcome back! Please login to your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* CONTACT */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-white mb-2">
                  Contact No
                </label>
                <input
                  type="tel"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  maxLength={10}
                  placeholder="Enter contact number"
                  className="w-full bg-transparent border-b border-green-600 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-white mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-transparent border-b border-green-600 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-gradient-to-r from-[#2D461D] to-[#A9FF67] 
             text-black font-semibold py-3 rounded-full 
             transition hover:opacity-90 disabled:opacity-60"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>


              {/* ERROR */}
              {error && (
                <p className="text-red-400 text-center text-sm mt-4">
                  {error?.data?.message || "Invalid credentials"}
                </p>
              )}
            </form>


          </div>
        </div>
      </div>
    </div>
  );

};

export default AdminLogin;
