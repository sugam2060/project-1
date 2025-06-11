// components/ui/UniversalLoader.tsx
import { Loader2 } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface UniversalLoaderProps {
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const UniversalLoader: React.FC<UniversalLoaderProps> = ({
  text = "Loading...",
  fullScreen = false,
  className = "",
}) => {
  const containerClass = cn(
    "flex flex-col items-center justify-center gap-4",
    fullScreen && "fixed inset-0 z-50 bg-white/80",
    className
  );

  return (
    <div className={containerClass}>
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="text-lg text-gray-800">{text}</p>
    </div>
  );
};

export default UniversalLoader;
