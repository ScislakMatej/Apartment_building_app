import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Main from "./Main";
import ProtectedRoute from "./ProtectedRoute";
import Dokumenty from "./Dokumenty"; // Import the new Dokumenty component

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/Main"
        element={
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Dokumenty"
        element={
          <ProtectedRoute>
            <Dokumenty />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
