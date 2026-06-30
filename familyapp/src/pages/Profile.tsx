import { useAuth } from "@/context/AuthContext";
import { User, Mail, Shield } from "lucide-react";

export function Profile() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Profile</h1>

      <div className="rounded-2xl border bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-3xl font-bold text-white shadow-lg">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
        <p className="text-gray-500">{user?.email}</p>
      </div>

      <div className="divide-y rounded-2xl border bg-white">
        <div className="flex items-center gap-4 px-6 py-5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100">
            <User className="size-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Name</p>
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 px-6 py-5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-purple-100">
            <Mail className="size-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm font-medium text-gray-900">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 px-6 py-5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-green-100">
            <Shield className="size-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">User ID</p>
            <p className="text-sm font-medium text-gray-900">{user?.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
