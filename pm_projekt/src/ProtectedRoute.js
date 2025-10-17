import React from "react";
import { Navigate } from "react-router-dom";

// Chránené komponenty
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  if (!isAuthenticated) {
    // ak nie je nikto prihlásený redirect na login stránku
    return <Navigate to="/" />;
  }

  // Ak je autentizácia správna returne stránku namiesto redirect na login
  return children;
};

export default ProtectedRoute;
