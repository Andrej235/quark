import React from "react";
import ReactDOM from "react-dom/client";
import "./globals.css";
import Authentication from "./components/authentication/authentication";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div className="bg-background grid size-full min-h-svh place-items-center">
    <Authentication />
    </div>
  </React.StrictMode>,
);
