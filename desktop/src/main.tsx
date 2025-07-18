import Homepage from "@/components/homepage";
import Login from "@/components/login";
import Signup from "@/components/signup";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./app";
import NotificationSettingsPage from "./components/notification-settings-page";
import TeamSettingsPage from "./components/team-settings-page";
import UserSettingsPage from "./components/user-settings-page";
import "./globals.css";
import SidebarContainer from "./components/sidebar-container";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <SidebarContainer />,
        children: [
          {
            path: "/",
            element: <Homepage />,
          },
          {
            path: "/settings/team",
            element: <TeamSettingsPage />,
          },
          {
            path: "/settings/notifications",
            element: <NotificationSettingsPage />,
          },
          {
            path: "/settings/user",
            element: <UserSettingsPage />,
          },
        ],
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
