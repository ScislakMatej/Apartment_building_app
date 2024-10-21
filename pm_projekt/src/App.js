import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Main from "./Main";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return ( //hlavná route je v index.js
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
    </Routes>
  );
}

export default App;
