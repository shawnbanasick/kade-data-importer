import { useState, useRef, useCallback } from "react";

interface NumberInputProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  disabled?: boolean;
  onChange?: (value: number) => void;
}

export default function NumberInput({
  value: controlledValue,
  defaultValue = 0,
  min = -Infinity,
  max = Infinity,
  step = 1,
  label,
  disabled = false,
  onChange,
}: NumberInputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const [inputStr, setInputStr] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const value = controlledValue ?? internalValue;
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const setValue = useCallback(
    (v: number | ((prev: number) => number)) => {
      const raw = typeof v === "function" ? v(value) : v;
      const clamped = clamp(Math.round(raw / step) * step);
      if (controlledValue === undefined) setInternalValue(clamped);
      onChange?.(clamped);
    },
    [controlledValue, step, clamp, onChange, value],
  );

  const startContinuous = (dir: "up" | "down") => {
    setValue(value + (dir === "up" ? step : -step));
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setValue((prev) => prev + (dir === "up" ? step : -step));
      }, 80);
    }, 380);
  };

  const stopContinuous = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const commitInput = () => {
    const parsed = parseFloat(inputStr);
    if (!isNaN(parsed)) setValue(parsed);
    setIsEditing(false);
  };

  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <div
      className={`flex flex-col w-18.75 items-center gap-px min-w-0 ${disabled ? "opacity-40" : ""}`}
    >
      {label && (
        <span className="text-[8px] sm:text-[18px] font-semibold tracking-wider uppercase text-slate-800 select-none truncate max-w-full px-0.5 text-center leading-tight">
          {label}
        </span>
      )}

      <div
        className={[
          "flex items-stretch rounded overflow-hidden border transition-all duration-150 w-full",
          focused
            ? "border-sky-400 shadow-[0_0_0_2px_rgba(56,189,248,0.15)]"
            : "border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:border-slate-300",
        ].join(" ")}
      >
        {/* Decrement */}
        <button
          type="button"
          disabled={disabled || atMin}
          onMouseDown={() => !disabled && !atMin && startContinuous("down")}
          onMouseUp={stopContinuous}
          onMouseLeave={stopContinuous}
          onTouchStart={(e) => {
            e.preventDefault();
            !disabled && !atMin && startContinuous("down");
          }}
          onTouchEnd={stopContinuous}
          className={[
            "flex items-center justify-center shrink-0 bg-white text-slate-400",
            "w-4 sm:w-5 border-r border-slate-200 transition-colors duration-100 select-none",
            atMin || disabled
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-slate-50 hover:text-slate-600 active:bg-slate-100 cursor-pointer",
          ].join(" ")}
          aria-label="Decrease"
        >
          <svg
            width="7"
            height="7"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="2" y1="5" x2="8" y2="5" />
          </svg>
        </button>

        {/* Value */}
        <div className="flex items-center justify-center bg-white flex-1 min-w-0">
          {isEditing ? (
            <input
              autoFocus
              type="text"
              inputMode="numeric"
              value={inputStr}
              onChange={(e) => setInputStr(e.target.value)}
              onBlur={commitInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitInput();
                if (e.key === "Escape") setIsEditing(false);
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setValue(value + step);
                }
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setValue(value - step);
                }
              }}
              className="w-full text-center bg-transparent text-slate-800 font-mono text-[10px] sm:text-xs font-semibold outline-none caret-sky-500 py-0.5 sm:py-1 px-0.5"
            />
          ) : (
            <button
              type="button"
              disabled={disabled}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onClick={() => {
                if (!disabled) {
                  setInputStr(String(value));
                  setIsEditing(true);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setValue(value + step);
                }
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setValue(value - step);
                }
              }}
              className="w-full text-slate-800 font-mono text-[10px] sm:text-xs font-semibold text-center select-none focus:outline-none cursor-text py-0.5 sm:py-1 px-0.5 leading-none"
            >
              {value}
            </button>
          )}
        </div>

        {/* Increment */}
        <button
          type="button"
          disabled={disabled || atMax}
          onMouseDown={() => !disabled && !atMax && startContinuous("up")}
          onMouseUp={stopContinuous}
          onMouseLeave={stopContinuous}
          onTouchStart={(e) => {
            e.preventDefault();
            !disabled && !atMax && startContinuous("up");
          }}
          onTouchEnd={stopContinuous}
          className={[
            "flex items-center justify-center shrink-0 bg-white text-slate-400",
            "w-4 sm:w-5 border-l border-slate-200 transition-colors duration-100 select-none",
            atMax || disabled
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-slate-50 hover:text-slate-600 active:bg-slate-100 cursor-pointer",
          ].join(" ")}
          aria-label="Increase"
        >
          <svg
            width="7"
            height="7"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="5" y1="2" x2="5" y2="8" />
            <line x1="2" y1="5" x2="8" y2="5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
