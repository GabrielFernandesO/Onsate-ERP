import styles from "./Dropdown.module.css";
import Image from "next/image";

interface DropdownProps {
  title: string;
  icon: string;
  title2: string;
  icon2: string;
  leftOptions: string[];
  rightOptions: string[];
  onOptionClick: (option: string) => void;
}

export default function Dropdown({
  title,
  icon,
  title2,
  icon2,
  leftOptions,
  rightOptions,
  onOptionClick,
}: DropdownProps) {
  return (
    <div className={styles.expandDiv}>
      <div className={styles.containerLeft}>
        <div className={styles.headerOptions}>
          <h1>{title}</h1>
          <div>
            {icon && (
              <Image src={icon} width={24} height={24} alt="icon-header" />
            )}
          </div>
        </div>
        <div className={styles.links}>
          {leftOptions.map((option) => (
            <div
              key={option}
              className={styles.option}
              onClick={() => onOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.containerRight}>
        <div className={styles.headerOptions}>
          <h1>{title2}</h1>
          <div>
            {icon2 && (
              <Image src={icon2} width={24} height={24} alt="icon-header" />
            )}
          </div>
        </div>
        <div className={styles.links}>
          {rightOptions.map((option) => (
            <div
              key={option}
              className={styles.option}
              onClick={() => onOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
