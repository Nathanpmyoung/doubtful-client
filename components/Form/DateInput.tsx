import { format } from "date-fns";
import { useRef, useState } from "react";
import { PillButton } from "./PillButton";
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
    <div style={{ position: "relative" }}>
      <PillButton
        label={
          value ? format(new Date(value), "dd MMMM yyyy @ HH:mm") : placeholder
        }
        onClick={() => {
          (inputRef as any)?.showPicker();
        }}
        disabled={!!disabled}
        isActive={!!value}
      />
      <input
        ref={(el) => setInputRef(el)}
        type="datetime-local"
        name={name}
        defaultValue={value}
        placeholder={placeholder}
        style={{ visibility: "hidden", position: "absolute", left: 0 }}
        onChange={(ev: any) => {
          onChange(ev.target.value);
        }}
      />
    </div>
  );
};
