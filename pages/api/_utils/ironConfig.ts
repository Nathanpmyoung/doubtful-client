export const ironConfig = {
  cookieName: "nebulous",
  password: "keyboardcat".repeat(10), // TODO
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
