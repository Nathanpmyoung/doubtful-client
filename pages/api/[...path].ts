// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { config } from "../../config";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironConfig } from "./_utils/ironConfig";

export default withIronSessionApiRoute(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiPath = [req.query.path].flat().join("/");
  const newUrl = `${config.apiUrl}/${apiPath}`;
  const method = req.method;

  let access_token;
  if (req.headers.authorization) {
    access_token = req.headers.authorization.replace("Bearer ", "");
  } else {
    access_token = (req.session as any).access_token;
  }

  const ret = await fetch(newUrl, {
    method,
    body: method === "POST" ? JSON.stringify(req.body) : undefined,
    headers: {
      authorization:
        req.headers.authorization ||
        (access_token ? `Bearer ${access_token}` : ""),
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((r) => r.json());

  if (ret.access_token) {
    (req.session as any).access_token = ret.access_token;
    await req.session.save();
  }

  // TODO: better statuses
  if (ret.statusCode && ret.statusCode !== 200) {
    res.status(400).end();
  } else {
    res.status(200).json(ret);
  }
},
ironConfig);
