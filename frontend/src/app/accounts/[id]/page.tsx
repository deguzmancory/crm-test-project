"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Account {
    id: string;
    name: string;
    industry?: string;
    category: string;
}

export default function AccountDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [account, setAccount] = useState<Account | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAccount() {
            if (!params?.id) return;

            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    router.push("/login");
                    return;
                }

                const res = await fetch(`${BASE_URL}/accounts/${params.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Failed to fetch account details.");

                const data = await res.json();
                setAccount(data);
            } catch (error) {
                console.error("Error fetching account:", error);
                setError("Failed to load account details. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        fetchAccount();
    }, [params.id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <Navbar />
            <h1 className="text-2xl font-bold mb-4">Account Details</h1>

            <div className="bg-gray-900 p-4 rounded">
                <p><strong>Name:</strong> {account?.name}</p>
                <p><strong>Industry:</strong> {account?.industry || "N/A"}</p>
                <p><strong>Category:</strong> {account?.category}</p>
            </div>

            <div className="mt-4">
                <button
                    onClick={() => router.push(`/accounts/${params.id}/contacts`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    View Contacts
                </button>

                <button
                    onClick={() => router.push("/accounts")}
                    className="ml-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                    Back to Accounts
                </button>
            </div>
        </div>
    );
}
