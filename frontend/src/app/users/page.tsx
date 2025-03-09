"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL; 

interface User {
    id: number;
    name: string;
    email: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchUsers() {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    router.push("/login");
                    return;
                }

                const response = await fetch(`${BASE_URL}/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch users.");
                
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError("Failed to load users. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, [router]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">User List</h1>

            {error && <p className="text-red-500">{error}</p>}
            {loading && <p>Loading...</p>}

            {!loading && !error && (
                <ul className="list-disc pl-6">
                    {users.map((user) => (
                        <li key={user.id} className="text-lg">
                            {user.name} ({user.email})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
