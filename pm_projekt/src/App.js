import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Main from "./Main";
import ProtectedRoute from "./ProtectedRoute";
import Dokumenty from "./Dokumenty";
import Settings from "./Settings";

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
      <Route
        path="/Settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
