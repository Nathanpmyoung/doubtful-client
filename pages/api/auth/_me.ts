import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironConfig } from "../_utils/ironConfig";
import * as jwt from "jsonwebtoken";

export default withIronSessionApiRoute(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { access_token } = req.session as any; // Types??
  if (access_token) {
    const user = jwt.verify(access_token, process.env.JWT_SECRET as string);
    return res.status(200).json({ user });
  } else {
    return res.status(200).json({});
  }
},
ironConfig);
