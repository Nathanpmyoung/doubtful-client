import styles from "./styles.module.css";

interface PillButtonProps {
  onClick(): void;
  label: string;
  disabled: boolean;
  isActive: boolean;
}

export const PillButton = ({
  label,
  onClick,
  disabled,
  isActive,
}: PillButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${styles.pillButton} ${
        isActive ? styles.activePillButton : ""
      }`}
    >
      {label}
    </button>
  );
};
