import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Plus, Bell } from "lucide-react";

export function Layout() {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col bg-gray-50 max-w-md mx-auto">
      
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t px-6 py-3">
        <div className="flex justify-around">

          {/* HOME */}
          <Link
            to="/dashboard"
            className={
              location.pathname === "/dashboard"
                ? "text-blue-600"
                : "text-gray-500"
            }
          >
            <Home size={24} />
          </Link>

          {/* CREATE */}
          <Link
            to="/dashboard/create"
            className={
              location.pathname === "/dashboard/create"
                ? "text-blue-600"
                : "text-gray-500"
            }
          >
            <Plus size={24} />
          </Link>

          {/* NOTIFICATIONS */}
          <Link
            to="/dashboard/notifications"
            className={
              location.pathname === "/dashboard/notifications"
                ? "text-blue-600"
                : "text-gray-500"
            }
          >
            <Bell size={24} />
          </Link>

        </div>
      </nav>

    </div>
  );
}