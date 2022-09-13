import { useState } from "react";
import styles from "./styles.module.css";

interface DateInputProps {
  value: string;
  placeholder: string;
  onChange(val: string): void;
  name: string;
  disabled?: boolean;
}

export const DateInput = ({
  value,
  placeholder,
  onChange,
  name,
  disabled,
}: DateInputProps) => {
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);

  return (
    <input
      ref={(el) => setInputRef(el)}
      type="datetime-local"
      name={name}
      defaultValue={value}
      placeholder={placeholder}
      className={styles.dateTimePicker}
      onChange={(ev: any) => {
        onChange(ev.target.value);
      }}
    />
  );
};
