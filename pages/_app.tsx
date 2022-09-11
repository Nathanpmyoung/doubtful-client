import "../styles/globals.css";
import type { AppProps } from "next/app";
import styles from "./styles.module.css";
import { LeftNav } from "../components/LeftNav/LeftNav";

function MyApp({ Component, pageProps }: AppProps) {
  const user = (pageProps as any).user;
  return (
    <main className={styles.pageWrapper}>
      {user ? <LeftNav user={user} /> : null}
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;
