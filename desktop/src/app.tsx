import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Authentication from "./components/authentication/authentication";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Authentication></Authentication>} />
      </Routes>
    </BrowserRouter>
  );
}
