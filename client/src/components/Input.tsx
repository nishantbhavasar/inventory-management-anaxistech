import clsx from "clsx";
import React from "react";
import { type ControllerRenderProps } from "react-hook-form";

interface InputFieldProps extends React.InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
> {
  type?: string;
  label?: string | boolean;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field?: ControllerRenderProps<any, any> | null; // Proper typing for react-hook-form field
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  type = "text",
  label,
  placeholder,
  field,
  errorMessage,
  disabled = false,
  required = false,
  ...rest
}) => {

  return (
    <div className={clsx("flex flex-col gap-1.5 w-full relative select-none")}>
      {/* Label & Info Icon */}
      {label && (
        <div className="flex items-center">
          {label && (
            <label className={clsx("text-sm font-medium text-left")}>
              {typeof label === "string" ? label : ""}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
        </div>
      )}

      <div
        className={clsx(
          "flex items-center flex-1 border rounded-[10px] border-b-primary focus-within:shadow-primary-0 py-2 px-3",
          disabled
            ? "bg-[#e5e7eb] cursor-not-allowed focus-within:border-b-primary hover:border-b-primary"
            : "bg-white hover:border-primary-100 focus-within:border-primary-100",
          errorMessage &&
            "border-red-500 focus-within:border-red-500 focus-within:shadow-red-200 shadow-red-200 hover:border-red-500",
        )}
      >
        <input
          {...field}
          {...rest}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={clsx(
            "w-full flex-1 border-none outline-none appearance-none disabled:bg-[#e5e7eb] disabled:cursor-not-allowed text-base",
          )}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <p className="text-red-500 text-sm break-words">{errorMessage}</p>
      )}
    </div>
  );
};

export default InputField;
