"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Account {
    id: string;
    name: string;
    industry?: string;
    category: string;
}

export default function SalesRepAccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        async function fetchAccounts() {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    router.push("/login");
                    return;
                }

                const res = await fetch(`${BASE_URL}/users/${id}/accounts`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Failed to fetch accounts.");

                const data = await res.json();
                setAccounts(data);
            } catch (error) {
                console.error("Error fetching accounts:", error);
                setError("Failed to load accounts.");
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchAccounts();
    }, [id, router]);

    return (
        <div className="p-6">
            <Navbar />
            <h1 className="text-2xl font-bold mb-4">Sales Rep's Accounts</h1>
            {error && <p className="text-red-500">{error}</p>}
            {loading ? <p>Loading...</p> : (
                <table className="w-full border border-gray-700 text-white mt-4">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">Industry</th>
                            <th className="border px-4 py-2">Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.length > 0 ? accounts.map((account) => (
                            <tr 
                                key={account.id} 
                                className="bg-gray-900 hover:bg-gray-800 cursor-pointer"
                                onClick={() => router.push(`/accounts/${account.id}/contacts`)}
                            >
                                <td className="border px-4 py-2">{account.name}</td>
                                <td className="border px-4 py-2">{account.industry || "N/A"}</td>
                                <td className="border px-4 py-2">{account.category}</td>
                            </tr>
                        )) : <tr><td colSpan={3} className="text-center py-2">No accounts assigned.</td></tr>}
                    </tbody>
                </table>
            )}
        </div>
    );
}
