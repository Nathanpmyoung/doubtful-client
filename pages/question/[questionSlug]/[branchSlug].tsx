import { config } from "../../../config";
import { ironConfig } from "../../api/_utils/ironConfig";
import { QuestionPage } from "../_QuestionPage";
import { withIronSessionSsr } from "iron-session/next";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({
    params,
    req,
  }: {
    params: Record<string, string>;
    req: any;
  }) {
    const [user, question] = await Promise.all([
      fetch(`${config.origin}/auth/me`, {
        headers: {
          authorization: `Bearer ${(req.session as any).access_token}`,
        },
      })
        .then((res) => res.json())
        .catch(() => null),
      fetch(
        `${config.origin}/question/${params.questionSlug}__${params.branchSlug}`,
        {
          headers: {
            authorization: `Bearer ${(req.session as any).access_token}`,
          },
        }
      ).then((res) => res.json()),
    ]);

    return { props: { user, question, branchSlug: params.branchSlug } };
  },
  ironConfig
);

export default QuestionPage;
