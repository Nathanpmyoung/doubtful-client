import { config } from "../../config";
import { ironConfig } from "../api/_utils/ironConfig";
import { QuestionPage } from "./_QuestionPage";
import { withIronSessionSsr } from "iron-session/next";

export const getServerSideProps = withIronSessionSsr(async function ({
  params,
  req,
}) {
  const [user, question] = await Promise.all([
    fetch(`${config.origin}/auth/me`, {
      headers: { authorization: `Bearer ${(req.session as any).access_token}` },
    })
      .then((res) => res.json())
      .catch(() => null),
    fetch(`${config.origin}/question/${params?.questionSlug}`, {
      headers: { authorization: `Bearer ${(req.session as any).access_token}` },
    }).then((res) => res.json()),
  ]);

  return { props: { user, question } };
},
ironConfig);

export default QuestionPage;
