import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { CreateReminder } from "./components/CreateReminder";
import { Notifications } from "./components/Notifications";
import { Layout } from "./components/Layout";
import { Onboarding } from "./components/Onboarding";
import { CreateFamily } from "./components/CreateFamily";
import { Members } from "./components/MembersPage";
import { EditReminders } from "./components/EditReminders";

export const router = createBrowserRouter([
  { path: "/", element: <Onboarding /> },
  { path: "/create-family", element: <CreateFamily /> },

  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "create", element: <CreateReminder /> },
      { path: "notifications", element: <Notifications /> },
      { path: "members", element: <Members /> },
      { path: "edit-reminders", element: <EditReminders /> },
    ],
  },
]);