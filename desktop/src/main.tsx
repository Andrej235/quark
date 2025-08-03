import Homepage from "@/components/dashboard-page";
import Login from "@/components/login-page";
import SignUpPage from "@/components/sign-up-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./app";
import DashboardLayout from "./components/dashboard-layout";
import EditRolePage from "./components/edit-role-page";
import ErrorPage from "./components/error-page";
import FirstTeamPage from "./components/first-team-page";
import NewProspectsPage from "./components/new-prospect-page";
import NewRolePage from "./components/new-role-page";
import NewTeamPage from "./components/new-team-page";
import NotificationSettingsPage from "./components/notification-settings-page";
import ProspectsPage from "./components/prospects-page";
import ProspectsTemplatePage from "./components/prospects-template-page";
import TeamMemberSettingsTab from "./components/team-member-settings-page";
import TeamRolesSettings from "./components/team-roles-settings-page";
import TeamSettingsPage from "./components/team-settings-page";
import UserSettingsPage from "./components/user-settings-page";
import VerifyEmailPage from "./components/verify-email-page";
import "./globals.css";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
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
            path: "/settings/team-members",
            element: <TeamMemberSettingsTab />,
          },
          {
            path: "/settings/team-roles",
            element: <TeamRolesSettings />,
          },
          {
            path: "/settings/team-roles/new",
            element: <NewRolePage />,
          },
          {
            path: "/settings/team-roles/:roleId",
            element: <EditRolePage />,
          },
          {
            path: "/settings/notifications",
            element: <NotificationSettingsPage />,
          },
          {
            path: "/settings",
            element: <UserSettingsPage />,
          },
          {
            path: "/prospects",
            element: <ProspectsPage />,
          },
          {
            path: "/prospects/new",
            element: <NewProspectsPage />,
          },
          {
            path: "/prospects/template",
            element: <ProspectsTemplatePage />,
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
        element: <SignUpPage />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmailPage />,
      },
      {
        path: "/first-team",
        element: <FirstTeamPage />,
      },
      {
        path: "/new-team",
        element: <NewTeamPage />,
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
