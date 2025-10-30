import React, { ChangeEvent, useRef, useState } from "react";
import { LegacyForms } from "@grafana/ui";
import { debounce } from "lodash";

const { FormField } = LegacyForms;

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value"> {
  value?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  inputWidth?: number;
  tooltip?: string;
  type?: string;
  debounce?: number;
}

export const GCInput: React.FC<InputProps> = ({
  value: initialValue = "",
  onChange,
  debounce: delay = 500,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);
  const debouncedChange = useRef(debounce((e: ChangeEvent<HTMLInputElement>) => onChange(e), delay)).current;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.persist();
    setValue(e.target.value);
    debouncedChange(e);
  };

  return <FormField {...props} value={value} onChange={handleChange} />;
};
