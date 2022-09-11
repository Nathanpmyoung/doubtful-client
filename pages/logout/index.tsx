import type { NextPage } from "next";
import { ironConfig } from "../api/_utils/ironConfig";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";

export const getServerSideProps = withIronSessionSsr(async function ({ req }) {
  req.session.destroy();
  return { props: {} };
}, ironConfig);

const LogOut: NextPage = () => {
  const router = useRouter();
  if (typeof window !== "undefined") {
    delete localStorage["doubtful:jwt"];
    router.replace("/");
  }
  return <></>;
};

export default LogOut;
