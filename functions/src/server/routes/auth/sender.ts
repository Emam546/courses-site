import nodemailer, { SentMessageInfo } from "nodemailer";
import EnvVars from "@/server/declarations/major/EnvVars";
import { decode, sign } from "@/server/utils/jwt";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: EnvVars.email_sender.EMAIL_USERNAME,
    pass: EnvVars.email_sender.PASSWORD,
  },
});
export interface UserData {
  email: string;
  displayName: string;
  teacherId: string;
  password: string;
  levelId: string;
  phone: string;
  redirectUrl: string;
}
export function verifyEmail(data: UserData) {
  const token = sign(
    data,
    { expiresIn: "10m" },
    EnvVars.email_sender.jwt.secret,
  );
  const url = new URL(data.redirectUrl);
  url.searchParams.set("token", token);
  const mailConfigurations = {
    // It should be a string of sender/server email
    from: EnvVars.email_sender.EMAIL,
    to: data.email,
    // Subject of Email
    subject: "Email Verification",
    // This would be the text of email body
    text: `Hi! There, You have recently visited
            our website and entered your email.
            Please follow the given link to verify your email
            <a href="${url.toString()}">${url.toString()}</a>
            Thanks`,
  };
  return new Promise<SentMessageInfo>((res, rej) => {
    transporter.sendMail(mailConfigurations, function (error, info) {
      if (error) return rej(error);
      res(info);
    });
  });
}
export function decodeEmail(token: string): UserData {
  return decode(token, EnvVars.email_sender.jwt.secret);
}
export default transporter;
