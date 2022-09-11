import styles from "./styles.module.css";

interface InputProps {
  name: string;
  placeholder: string;
  defaultValue: string;
  onChange(val: string): void;
  disabled: boolean;
  required?: boolean;
  type?: string;
}

export const Input = ({
  name,
  placeholder,
  defaultValue,
  onChange,
  disabled,
  required,
  type,
}: InputProps) => {
  return (
    <input
      className={styles.input}
      type={type || "text"}
      name={name}
      id={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={(ev: any) => onChange(ev.target.value)}
      disabled={disabled}
      required={required}
    />
  );
};
