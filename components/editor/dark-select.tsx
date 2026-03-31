"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type Option = {
  label: string;
  value: string | number;
};

type DarkSelectProps = {
  value: string | number;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
};

export function DarkSelect({
  value,
  options,
  onChange,
  className = "",
  buttonClassName = "",
  menuClassName = "",
}: DarkSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <div ref={rootRef} className={`dark-select ${className}`.trim()}>
      <button
        type="button"
        className={`dark-select-trigger ${buttonClassName}`.trim()}
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="dark-select-value">{selected?.label ?? value}</span>
        <ChevronDown size={14} className={`dark-select-chevron${open ? " open" : ""}`} />
      </button>

      {open && (
        <div className={`dark-select-menu ${menuClassName}`.trim()} role="listbox">
          {options.map((option) => {
            const isActive = option.value === value;
            return (
              <button
                key={String(option.value)}
                type="button"
                role="option"
                aria-selected={isActive}
                className={`dark-select-option${isActive ? " active" : ""}`}
                onClick={() => {
                  onChange(String(option.value));
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
