import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
        <Icon className="size-10 text-indigo-500" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mb-6 max-w-sm text-center text-sm text-gray-500">{description}</p>
      {action}
    </div>
  );
}
