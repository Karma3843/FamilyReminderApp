import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  gradient: string;
}

export function StatsCard({ icon: Icon, label, value, gradient }: StatsCardProps) {
  return (
    <div className={`rounded-2xl p-5 text-white shadow-lg transition-transform hover:scale-[1.02] ${gradient}`}>
      <div className="mb-3 flex items-center justify-between">
        <Icon className="size-6 opacity-80" />
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="mt-1 text-sm opacity-90">{label}</p>
    </div>
  );
}
