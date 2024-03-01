import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner"

import {
    create,
    type CredentialCreationOptionsJSON,
} from "@github/webauthn-json";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { getUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
    const userId = await getUserId(request);
    console.log(userId)
    if (!userId) return redirect("/login");
    return json({});
  }

export default function DashboardPage() {
    async function registerPasskey() {
        const createOptionsResponse = await fetch("https://passkeys-remix.vercel.app/api/passkeys/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ start: true, finish: false, credential: null }),
        });

        const { createOptions } = await createOptionsResponse.json();

        // Open "register passkey" dialog
        const credential = await create(
            createOptions as CredentialCreationOptionsJSON,
        );

        const response = await fetch("https://passkeys-remix.vercel.app/api/passkeys/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ start: false, finish: true, credential }),
        });

        if (response.ok) {
            toast.success("Registered passkey successfully!");
            return;
        }
    }
    return (
        <div className="p-4">
            <Form action="/logout" method="post">
                <Button type="submit" variant="link">
                    Logout
                </Button>
            </Form>
            <div>
                <Button
                    onClick={() => registerPasskey()}
                    className="flex justify-center items-center space-x-2"
                >
                    Register a new passkey
                </Button>
            </div>
        </div>
    );
}