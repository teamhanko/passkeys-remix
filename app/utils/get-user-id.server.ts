import * as jose from "jose";

export async function getUserID(token: string) {
  const payload = jose.decodeJwt(token ?? "");

  const userID = payload.sub;
  return userID;
}
