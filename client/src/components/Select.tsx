/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react";
import Select from "react-select";

// Define the type for the props of InputSelect component
interface InputSelectProps {
  options: Array<{
    label: string;
    value: string;
  }>;
  label: string | boolean;
  field?: { onBlur: () => void; value: any; onChange: (val: any) => void };
  errorMessage?: string;
  disabled?: boolean;
  onChange?: (val: any) => void;
  placeholder?: string;
  required?: boolean;
}

const InputSelect: React.FC<InputSelectProps> = ({
  options,
  label,
  field,
  errorMessage,
  disabled = false,
  onChange,
  placeholder,
  required = false,
  ...rest
}) => {
  const selectRef = useRef<HTMLDivElement>(null);

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderRadius: "10px",
      paddingBlock: "2px",
      paddingLeft: "4px",
      cursor: disabled ? "not-allowed" : "pointer",
      backgroundColor: disabled ? "#e5e7eb" : "#fff",
      borderColor:
        state.isFocused && !errorMessage
          ? "#FFA033"
          : errorMessage
            ? "#ef4444"
            : "#E0DEF7",

      boxShadow: state.isFocused ? "0px 0px 14px rgba(0,0,0,0.15)" : "none",

      "&:hover": {
        borderColor: errorMessage ? "#ef4444" : "#FFA033",
        backgroundColor: disabled ? "#e5e7eb" : "#fff",
        cursor: disabled ? "not-allowed" : "pointer",
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: disabled ? "grey" : "#000",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#FFE3C4"
        : state.isFocused
          ? "#f3f4f6"
          : null,
      color: state.isSelected ? "#FFA033" : "#000",
      "&:hover": {
        backgroundColor: "#FFE3C4",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      padding: "0px 4px 0px 1px",
    }),
    menuList: (provided: any) => ({
      ...provided,
      maxHeight: "200px",
      overflowY: "auto",
      scrollbarWidth: "thin",
      "&::-webkit-scrollbar": {
        width: "6px",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#ccc",
        borderRadius: "10px",
      },
      "&::-webkit-scrollbar-track": {
        background: "transparent",
      },
    }),
    menuPortal: (provided: any) => ({
      ...provided,
      zIndex: 10050,
    }),
  };

  return (
    <div className="flex flex-col gap-1.5 w-full pt-0 select-none">
      {!!label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div ref={selectRef}>
        <Select
          options={options}
          placeholder={placeholder ?? "Select..."}
          styles={customStyles}
          className="w-full"
          classNamePrefix="react-select"
          isDisabled={disabled}
          menuPlacement={"bottom"}
          menuPosition="fixed"
          menuPortalTarget={document.body}
          {...field}
          {...rest}
          onChange={(val) => {
            if (onChange) {
              onChange(val);
            } else {
              field?.onChange(val);
            }
          }}
        />
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm break-words">{errorMessage}</p>
      )}
    </div>
  );
};

export default InputSelect;
