import { tenant } from "@teamhanko/passkeys-sdk";
import { db } from "~/db";

const passkeyApi = tenant({
  apiKey: process.env.PASSKEYS_API_KEY!,
  tenantId: process.env.PASSKEYS_TENANT_ID!,
});

export async function startServerPasskeyRegistration(userID: string) {
  const user = db.users.find((user) => user.id === userID);

  const createOptions = await passkeyApi.registration.initialize({
    userId: user!.id,
    username: user!.email || "",
  });

  return createOptions;
}

export async function finishServerPasskeyRegistration(credential: any) {
  await passkeyApi.registration.finalize(credential);
}

export async function startServerPasskeyLogin() {
  const options = await passkeyApi.login.initialize();
  return options;
}

export async function finishServerPasskeyLogin(options: any) {
  const response = await passkeyApi.login.finalize(options);
  return response;
}
