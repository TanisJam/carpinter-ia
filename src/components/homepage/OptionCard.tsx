"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Ruler, FolderOpen, LucideIcon } from "lucide-react";

interface OptionCardProps {
  icon: string;
  title: string;
  description: string;
  route: string;
}

const iconMap: Record<string, LucideIcon> = {
  ruler: Ruler,
  "folder-open": FolderOpen,
};

export function OptionCard({
  icon,
  title,
  description,
  route,
}: OptionCardProps) {
  const router = useRouter();
  const IconComponent = iconMap[icon] || Ruler;

  const handleClick = () => {
    router.push(route);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group text-left"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
        <IconComponent className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
      </div>

      <div className="flex-1 min-w-0">
        <h3
          className="font-medium text-[14px] leading-[20px] tracking-[-0.15px]"
          style={{ color: "#0F172B" }}
        >
          {title}
        </h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
    </button>
  );
}
