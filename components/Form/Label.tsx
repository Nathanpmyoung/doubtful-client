import styles from "./styles.module.css";

interface LabelProps {
  name: string;
  label: string;
}

export const Label = ({ name, label }: LabelProps) => {
  return (
    <label htmlFor={name} className={styles.label}>
      {label}
    </label>
  );
};
