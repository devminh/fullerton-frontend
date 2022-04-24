import React from "react";

import { Select } from "antd";

const { Option } = Select;

interface SelectFieldProps {
  options: { label: string; value: string }[];
  defaultValue?: string;
  placeholder?: string;
  setValue?: (value: { label: string; value: string }) => void;
  onSelect?: (value: string) => void;
}

function SelectField({
  options,
  placeholder,
  defaultValue,
  onSelect,
}: SelectFieldProps) {
  return (
    <>
      <Select
        placeholder={placeholder || ""}
        defaultValue={defaultValue}
        onSelect={(val: string) => {
          onSelect && onSelect(val);
        }}
        style={{ minWidth: "200px" }}
      >
        {options.map((item, index) => {
          return (
            <Option value={item.value} key={index}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    </>
  );
}

export default SelectField;
