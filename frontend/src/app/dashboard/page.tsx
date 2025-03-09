"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface User {
    id: string;
    email: string;
    role: string;
}

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const res = await fetch(`${BASE_URL}/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    localStorage.removeItem("access_token");
                    router.push("/login");
                    return;
                }

                const data = await res.json();
                setUser(data);
            } catch (error) {
                console.error("Error fetching user:", error);
                localStorage.removeItem("access_token");
                router.push("/login");
            }
        };

        fetchUser();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        router.push("/login")
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div>
            <h1 className="text-2xl">Welcome, {user.email}!</h1>
            <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
                Logout
            </button>
        </div>
    );
}
