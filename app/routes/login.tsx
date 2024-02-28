import { ActionFunction, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
// import { Form, Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { createUserSession, verifyLogin } from "~/utils/session.server";
import { get } from "@github/webauthn-json";

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const user = await verifyLogin(email, password);

    if (!user) {
        return new Response("Invalid email or password", {
            status: 401,
            headers: {
                "Content-Type": "text/plain",
            },
        });
    }

    return createUserSession({
        request,
        userId: user.id,
    });
}

export default function LoginPage() {

    async function signInWithPasskey() {
        const createOptionsResponse = await fetch("/api/passkeys/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ start: true, finish: false, credential: null }),
        });

        const { loginOptions } = await createOptionsResponse.json();

        // Open "register passkey" dialog
        const options = await get(
            loginOptions as any,
        );

        const response = await fetch("/api/passkeys/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ start: false, finish: true, options }),
        });

        if (response.ok) {
            console.log("user logged in with passkey")
            // redirect("/dashboard");
            return;
        }
    }
    return (
        <div>
            <div className="w-screen h-screen flex items-center justify-center">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription className="">Choose your preferred sign in method</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col">
                            <Form method="POST">
                                <div className="flex flex-col gap-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        id="email"
                                        required
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                    />
                                    <Label>Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                    />
                                </div>
                                <Button type="submit" className="mt-4 w-full">Sign in with Email</Button>
                            </Form>
                            <div className="relative mt-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>
                            <Button className="mt-4 w-full" onClick={() => signInWithPasskey()}>Passkey</Button>
                        </div>
                        {/* <div className="mt-4 flex justify-center">
                            <Link to="/signup" className="text-sm text-muted-foreground hover:text-muted-foreground-hover">Don&apos;t have an account? Sign up</Link>
                        </div> */}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}