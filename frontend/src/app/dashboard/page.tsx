"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface User {
    id: string;
    email: string;
    firstName: string;
    role: string;
}

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            let accessToken = localStorage.getItem("access_token");
            let refreshToken = localStorage.getItem("refresh_token");

            if (!accessToken) {
                router.push("/login");
                return;
            }

            try {
                let res = await fetch(`${BASE_URL}/users/profile`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                if (res.status === 401 && refreshToken) {
                    // Attempt to refresh token
                    const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ refreshToken }),
                    });

                    if (refreshRes.ok) {
                        const refreshData = await refreshRes.json();
                        localStorage.setItem("access_token", refreshData.accessToken);
                        accessToken = refreshData.accessToken;

                        res = await fetch(`${BASE_URL}/users/profile`, {
                            headers: { Authorization: `Bearer ${accessToken}` },
                        });
                    } else {
                        localStorage.removeItem("access_token");
                        localStorage.removeItem("refresh_token");
                        router.push("/login");
                        return;
                    }
                }

                if (!res.ok) {
                    throw new Error("Failed to fetch user");
                }

                const data = await res.json();
                setUser(data);
            } catch (error) {
                console.error("Error fetching user:", error);
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        router.push("/login");
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <Navbar />
            <h1 className="text-2xl">Welcome, {user?.firstName}!</h1>
            <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
                Logout
            </button>
        </div>
    );
}
