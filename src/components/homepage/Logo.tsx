import { Sparkles } from "lucide-react";
import { colors } from "@/styles/colors";

interface LogoProps {
  appName: string;
  className?: string;
}

export function Logo({ appName, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="rounded-xl p-3 flex items-center justify-center"
        style={{ backgroundColor: colors.primary }}
      >
        <Sparkles className="w-6 h-6 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900">{appName}</h1>
    </div>
  );
}
