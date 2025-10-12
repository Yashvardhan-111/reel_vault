"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("passwords do not match");
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",     //Tells the server we're sending JSON data.
                },
                body: JSON.stringify({                      //the request body must be plain text or binary.Converts your JS object into a JSON string.JS object not directly sendable over HTTP.
                    email,
                    password,
                }),
            });
            const data = await res.json();              //Converts the response body (which is in JSON format) into a JavaScript object.

            if (!res.ok) {                              //Checks if the response status code is not OK (i.e., not in the 200–299 range).
                throw new Error(data.error || "Registration failed");
            }

            console.log(data);
            router.push("/login");                     //redirects the user to the login page.
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit">Register</button>
            </form>
            <div>
                <p>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
