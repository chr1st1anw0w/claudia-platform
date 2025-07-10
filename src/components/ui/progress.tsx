import React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
  max?: number;
}

export const Progress: React.FC<ProgressProps> = ({ 
  value, 
  className, 
  max = 100 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className={cn("w-full bg-gray-200 rounded-full h-2", className)}>
      <div 
        className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
