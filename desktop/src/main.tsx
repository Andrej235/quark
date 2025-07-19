import Homepage from "@/components/homepage";
import Login from "@/components/login";
import Signup from "@/components/signup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./app";
import ErrorPage from "./components/error-page";
import NotificationSettingsPage from "./components/notification-settings-page";
import SidebarContainer from "./components/sidebar-container";
import TeamSettingsPage from "./components/team-settings-page";
import UserSettingsPage from "./components/user-settings-page";
import "./globals.css";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
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
          {
            path: "*",
            element: <ErrorPage />,
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
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
