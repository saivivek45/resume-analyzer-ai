import type { InputHTMLAttributes } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  registration: UseFormRegisterReturn;
}

export function FormField({
  label,
  error,
  registration,
  id,
  ...inputProps
}: FormFieldProps) {
  const inputId = id ?? registration.name;

  return (
    <label className="block" htmlFor={inputId}>
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>
      <input
        aria-describedby={error ? `${inputId}-error` : undefined}
        aria-invalid={Boolean(error)}
        className="form-input"
        id={inputId}
        {...registration}
        {...inputProps}
      />
      {error && (
        <span className="mt-1.5 block text-xs text-rose-300" id={`${inputId}-error`}>
          {error.message}
        </span>
      )}
    </label>
  );
}
