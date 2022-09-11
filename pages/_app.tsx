import "../styles/globals.css";
import type { AppProps } from "next/app";
import styles from "./styles.module.css";
import { LeftNav } from "../components/LeftNav/LeftNav";
import { useRouter } from "next/router";
import { MobilePage } from "./mobile";

function MyApp({ Component, pageProps }: AppProps) {
  const user = (pageProps as any).user;
  const router = useRouter();
  if (
    typeof window !== "undefined" &&
    window.innerWidth < 800 &&
    !window.location.pathname.includes("/mobile")
  ) {
    router.replace("/mobile");
  }
  return (
    <main className={styles.pageWrapper}>
      {user ? (
        <LeftNav user={user} />
      ) : (
        <a href="/login" className={styles.loginFloater}>
          Sign Up / Log In
        </a>
      )}
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;
