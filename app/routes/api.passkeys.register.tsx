import { json } from "@remix-run/node";
import { finishServerPasskeyRegistration, startServerPasskeyRegistration } from "~/utils/passkey.server";
import { getSession } from "~/utils/session.server";



export const action = async ({ request }: { request: Request }) => {

    const sessionData = await getSession(request);
    const userID = sessionData.get("userId");
    console.log(userID)

    if (!userID) {
        return json({ message: "Unauthorized" }, 401);
    }
    console.log(userID)
    const { start, finish, credential } = await request.json();

    try {
        if (start) {
            const createOptions = await startServerPasskeyRegistration(userID);
            return json({ createOptions });
        }
        if (finish) {
            await finishServerPasskeyRegistration(credential);
            return json({ message: "Registered Passkey" });
        }
    } catch (error) {
        return json(error, 500);
    }
};

