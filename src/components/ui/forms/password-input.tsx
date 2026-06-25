"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  labelClassName,
  inputClassName,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1">
      <Label className={labelClassName}>{label}</Label>
      <div className="relative">
        <Input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn("pr-10", inputClassName)}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          tabIndex={-1}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
