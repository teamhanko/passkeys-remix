import { json } from "@remix-run/node";
import { getUserID } from "~/utils/get-user-id.server";
import { finishServerPasskeyLogin, startServerPasskeyLogin } from "~/utils/passkey.server";
import { createUserSession } from "~/utils/session.server";

export const action = async ({ request }: { request: Request }) => {
    const { start, finish, options } = await request.json();

    try {
        if (start) {
            const loginOptions = await startServerPasskeyLogin();
            return json({ loginOptions });
        }
        if (finish) {
            const jwtToken = await finishServerPasskeyLogin(options);
            const userID = await getUserID(jwtToken?.token ?? '');

            return createUserSession({
                request,
                userId: userID ?? '',
            });
        }
    } catch (error) {
        if(error instanceof Response){
            return error;
        }
        return json(error, 500);
    }
};