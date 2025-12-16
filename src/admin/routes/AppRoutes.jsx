import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Dashboard from "../pages/Dashboard";
import AdminLogin from "../pages/Login";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const [searchQuery, setSearchQuery] = useState(""); 

  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Header setSearchQuery={setSearchQuery} />
           </ProtectedRoute>
        }
      >
        <Route
          index
          element={<Dashboard searchQuery={searchQuery} />}
        />
        <Route
          path="dashboard"
          element={<Dashboard searchQuery={searchQuery} />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
