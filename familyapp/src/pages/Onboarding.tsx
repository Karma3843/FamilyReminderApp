import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Bell, Calendar, Mail, AlertTriangle } from "lucide-react";

export function Onboarding() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (tab === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { detail?: string; error?: string } } };
        setError(axiosErr.response?.data?.detail || axiosErr.response?.data?.error || "An error occurred");
      } else {
        setError("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 p-12 text-white lg:flex">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Bell className="size-6" />
            <span className="text-xl font-bold">FamilyReminder</span>
          </div>
        </div>

        <div className="max-w-lg">
          <div className="mb-8 inline-flex items-center justify-center rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
            <Bell className="size-16 text-white/90" />
          </div>
          <h1 className="mb-4 text-4xl font-bold leading-tight">
            Never miss important family moments.
          </h1>
          <p className="mb-8 text-lg text-white/80">
            Keep your family organized with shared reminders, recurring tasks, and instant email notifications.
          </p>

          <div className="grid gap-4">
            {[
              { icon: Bell, title: "Shared Family Reminders", desc: "Create and tag family members in reminders" },
              { icon: Calendar, title: "Recurring Reminders", desc: "Daily, weekly, or monthly repeat options" },
              { icon: Mail, title: "Email Notifications", desc: "Get notified when reminders are due" },
              { icon: AlertTriangle, title: "Priority Tracking", desc: "High, medium, and low priority levels" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <Icon className="mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-white/70">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-white/50">Family Reminder App &copy; 2026</p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <Bell className="mx-auto mb-2 size-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">FamilyReminder</h1>
          </div>

          <div className="mb-8 flex items-center gap-3">
            <div className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 p-3">
              <Bell className="size-9 text-indigo-600" />
            </div>
            <div className="flex flex-1 rounded-xl bg-gray-100 p-1">
              <button
                onClick={() => { setTab("login"); setError(""); }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  tab === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => { setTab("register"); setError(""); }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  tab === "register" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "register" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={4}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {tab === "login" ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                tab === "login" ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
