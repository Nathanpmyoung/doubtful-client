import styles from "./styles.module.css";

interface TitleInputProps {
  name: string;
  placeholder: string;
  defaultValue: string;
  onChange(val: string): void;
  disabled: boolean;
}

export const TitleInput = ({
  name,
  placeholder,
  defaultValue,
  onChange,
  disabled,
}: TitleInputProps) => {
  return (
    <input
      className={styles.titleInput}
      type="text"
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={(ev: any) => onChange(ev.target.value)}
      disabled={disabled}
    />
  );
};
