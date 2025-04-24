import React, { useState, useRef, useEffect, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Search, Loader2 } from "lucide-react";

export const Input = forwardRef(
  (
    {
      className = "",
      containerClassName = "w-full flex items-center space-x-2 flex-col md:flex-row",
      showSearchBtn = true,
      searchButtonText = "Search",
      onSearch,
      loading = false,
      showClearButton = false,
      onClear,
      borderColor = "border-yellow-500",
      placeholder = "Search...",
      minLength = 2,
      maxLength = 100,
      validationPattern,
      errorMessage = "Please enter valid input",
      debounceMs = 300,
      type = "text",
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState(value || "");
    const [error, setError] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = ref || useRef(null);
    const debounceTimer = useRef(null);

    const hasGroup = showSearchBtn || showClearButton;
    const inputRadius = hasGroup
      ? "rounded-l-[24px]"
      : "rounded-l-[24px] rounded-r-[24px]";
    const searchButtonRadius = showClearButton
      ? "rounded-none"
      : "rounded-r-[50%]";

    useEffect(() => {
      return () => {
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }
      };
    }, []);

    const handleInputChange = (e) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      setError("");

      if (validationPattern && !validationPattern.test(newValue)) {
        setError(errorMessage);
        return;
      }

      if (newValue.length < minLength) {
        setError(`Please enter at least ${minLength} characters`);
        return;
      }

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        if (onSearch && !error) {
          onSearch(newValue);
        }
      }, debounceMs);

      if (onChange) {
        onChange(e);
      }
    };

    const handleClear = () => {
      setInputValue("");
      setError("");
      inputRef.current?.focus();
      if (onClear) onClear();
    };

    return (
      <div className={cn(containerClassName, "relative mx-auto")}>
        <div className="relative flex w-full md:w-[40vw] group">
          <input
            ref={inputRef}
            type={type}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "flex-grow h-12 " +
                inputRadius +
                " " +
                borderColor +
                " bg-black/50 backdrop-blur-sm px-4 py-2 text-white text-base placeholder-gray-400",
              "border-2 transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent",
              "hover:bg-black/60 hover:border-orange-400",
              isFocused && "shadow-lg shadow-orange-500/20",
              error && "border-red-500 focus:ring-red-500",
              className
            )}
            placeholder={placeholder}
            maxLength={maxLength}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "input-error" : undefined}
            {...props}
          />

          {error && (
            <div
              id="input-error"
              className="absolute -bottom-6 left-1/2 text-xs text-red-500 animate-fadeIn bg-red-100 border border-red-400 rounded-md px-2 py-1 shadow-sm -translate-x-1/2 translate-y-[-5px]"
              role="alert"
            >
              {error}
            </div>
          )}

          

          {showClearButton && inputValue && (
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={handleClear}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";