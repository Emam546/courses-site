export default {
  nodeEnv: process.env.NODE_ENV ?? "",
  jwt: {
    secret: process.env.JWT_SECRET ?? "",
    refreshTokenExp: Number(process.env.JWT_EXP ?? 0), // exp at the same time as the cookie
    accessTokenExp: Number(process.env.JWT_ACCESS_EXP ?? 0), // exp at the same time as the cookie
  },
  email_sender: {
    EMAIL_USERNAME: process.env.EMAIL_USERNAME ?? "",
    PASSWORD: process.env.EMAIL_PASSWORD ?? "",
    EMAIL: process.env.EMAIL ?? "",
    jwt: {
      secret: process.env.JWT_SECRET_EMAIL ?? "secret_email",
    },
  },
} as const;
