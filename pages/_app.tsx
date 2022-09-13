import "../styles/globals.css";
import LogRocket from "logrocket";
import type { AppProps } from "next/app";
import styles from "./styles.module.css";
import { LeftNav } from "../components/LeftNav/LeftNav";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";
import cn from "classnames";
import { TopNav } from "../components/TopNav/TopNav";

function MyApp({ Component, pageProps }: AppProps) {
  const user = (pageProps as any).user;

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (
        window.innerWidth < 800 &&
        !window.location.pathname.includes("/mobile")
      ) {
        router.replace("/mobile");
      } else {
        if (process.env.NODE_ENV === "production") {
          LogRocket.init("eydrav/doubtful");
          if (user) {
            LogRocket.identify(user.id, {
              name: user.name,
              email: user.email,
            });
          }
        }
      }
    }
  }, []);

  return (
    <main
      className={cn(styles.pageWrapper, { [styles.pageWithSidebar]: user })}
    >
      {user ? <LeftNav user={user} /> : <TopNav />}
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;
