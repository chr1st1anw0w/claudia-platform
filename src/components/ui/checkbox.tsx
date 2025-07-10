import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  id?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ 
  checked = false, 
  onCheckedChange, 
  className,
  id 
}) => {
  return (
    <button
      type="button"
      id={id}
      className={cn(
        "flex h-4 w-4 items-center justify-center rounded border border-primary text-primary-foreground",
        checked ? "bg-primary" : "bg-background",
        "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        className
      )}
      onClick={() => onCheckedChange?.(!checked)}
    >
      {checked && <Check className="h-3 w-3" />}
    </button>
  );
};
