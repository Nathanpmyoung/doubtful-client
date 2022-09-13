import styles from "./styles.module.css";
import Link from "next/link";
import cn from "classnames";
import { useRouter } from "next/router";

export const TopNav = () => {
  const router = useRouter();

  return (
    <div className={styles.navLinks}>
      <div className={styles.wrapper}>
        <Link href={"/"}>
          <a className={styles.logo} />
        </Link>
        <Link href={"/"}>Doubtful.</Link>
      </div>

      <div className={styles.wrapper}>
        <Link href="/">
          <a
            className={cn(styles.navItem, {
              [styles.navItemActive]: router.pathname === "/",
            })}
          >
            Questions
          </a>
        </Link>
        <Link href="/mission">
          <a
            className={cn(styles.navItem, {
              [styles.navItemActive]: router.pathname === "/mission",
            })}
          >
            Mission
          </a>
        </Link>
        <Link href="/login">
          <a className={styles.loginFloater}>Sign Up / Log In</a>
        </Link>
      </div>
    </div>
  );
};
