import EnvVars from "@serv/declarations/major/EnvVars";
import jwt from "jsonwebtoken";

export function sign(
  payload: string | object | Buffer,
  options?: jwt.SignOptions,
  secret?: string,
) {
  return jwt.sign(payload, secret ?? EnvVars.jwt.secret, options);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decode<T = any>(token: string, secret?: string): T {
  return jwt.verify(token, secret ?? EnvVars.jwt.secret) as T;
}
