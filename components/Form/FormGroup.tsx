import styles from "./styles.module.css";

interface FormGroupProps {
  children: React.ReactNode;
}

export const FormGroup = ({ children }: FormGroupProps) => {
  return <section className={styles.formGroup}>{children}</section>;
};
