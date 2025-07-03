import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TypingAreaProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  placeholder: string;
  onFocus: () => void;
}

const TypingArea = forwardRef<HTMLInputElement, TypingAreaProps>(
  ({ value, onChange, disabled, placeholder, onFocus }, ref) => {
    return (
      <div className="flex justify-center">
        <Input
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={onFocus}
          className={cn(
            "text-center text-lg font-mono max-w-md",
            "focus:ring-2 focus:ring-primary focus:border-primary",
            "transition-all duration-200"
          )}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    );
  }
);

TypingArea.displayName = "TypingArea";

export default TypingArea;