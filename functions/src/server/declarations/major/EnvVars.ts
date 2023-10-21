export default {
  nodeEnv: process.env.NODE_ENV ?? "",
  port: process.env.PORT ?? 0,
  DOMAIN_URL: process.env.DOMAIN_URL ?? "https://localhost:3000",
  cookieProps: {
    key: "ExpressGeneratorTs",
    secret: process.env.COOKIE_SECRET ?? "",
    options: {
      httpOnly: true,
      signed: true,
      path: process.env.COOKIE_PATH ?? "",
      maxAge: Number(process.env.COOKIE_EXP ?? 0),
      domain: process.env.COOKIE_DOMAIN ?? "",
      secure: process.env.SECURE_COOKIE === "true",
    },
  },
  session: {
    secret: process.env.SESSION_SECRET ?? "",
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? "",
    exp: process.env.COOKIE_EXP ?? "", // exp at the same time as the cookie
  },
  MONGODB_URL: process.env.MONGODB_URL ?? "",
  facebook: {
    APP_ID: process.env.FaceBook_APP_ID ?? "",
    APP_SECRET: process.env.FaceBook_APP_SECRET ?? "",
  },
  google: {
    APP_ID: process.env.GOOGLE_APP_ID ?? "",
    APP_SECRET: process.env.GOOGLE_APP_SECRET ?? "",
  },
  APPLY_LOCAL: process.env.APPLY_LOCAL == "true",
  cloudinary: {
    cloud_name: process.env.cloudinary_cloud_name ?? "",
    api_key: process.env.cloudinary_api_key ?? "",
    api_secret: process.env.cloudinary_api_secret ?? "",
  },
} as const;
