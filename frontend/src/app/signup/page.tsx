"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${BASE_URL}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                setError("User already exists");
                return;
            }

            router.push("/login");
        } catch (error) {
            console.error("Signup error:", error);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Sign Up</h2>
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 w-full mb-2 text-gray-700"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 w-full mb-4 text-gray-700"
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                    Sign Up
                </button>
                <p className="mt-4 text-center text-gray-700">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-500">
                        Log in
                    </a>
                </p>
            </form>
        </div>
    );
}
