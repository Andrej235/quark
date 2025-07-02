import React from "react";
import ReactDOM from "react-dom/client";
import "./globals.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div className="h-full w-full bg-yellow-400">
      <h1 className="text-3xl font-bold underline">Hello World!</h1>
    </div>
  </React.StrictMode>,
);
