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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Mane Farm
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Contact no</label>
            <input
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter your Number"
              maxLength={10}
              className="w-full px-4 bg-white border text-black border-gray-500 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 bg-white border text-black border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {error && (
            <p className="text-red-500 text-center mt-2">
              {error?.data?.message || "Invalid credentials"}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
