import "../styles/globals.css";
import LogRocket from "logrocket";
import type { AppProps } from "next/app";
import styles from "./styles.module.css";
import { LeftNav } from "../components/LeftNav/LeftNav";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const user = (pageProps as any).user;
  const router = useRouter();
  if (typeof window !== "undefined") {
    if (
      window.innerWidth < 800 &&
      !window.location.pathname.includes("/mobile")
    ) {
      router.replace("/mobile");
    } else {
      LogRocket.init("eydrav/doubtful");
      if (user) {
        LogRocket.identify(user.id, {
          name: user.name,
          email: user.email,
        });
      }
    }
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
