"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { AccountModal } from "@/components/AccountsModal";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Account {
    id: string;
    name: string;
    industry?: string;
    category: string;
    salesRepId?: string;
}

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const router = useRouter();

    // Function to fetch accounts
    const fetchAccounts = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                router.push("/login");
                return;
            }
            const res = await fetch(`${BASE_URL}/accounts`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            setAccounts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching accounts:", error);
            setError("Failed to load accounts. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, [router]);

    const handleCreateAccount = async (accountData: Omit<Account, "id">) => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                router.push("/login");
                return;
            }

            const endpoint = selectedAccount
                ? `${BASE_URL}/accounts/${selectedAccount.id}`
                : `${BASE_URL}/accounts`;
            const method = selectedAccount ? "PUT" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(accountData),
            });
            if (!res.ok) throw new Error(`Failed to ${selectedAccount ? "update" : "create"} account.`);

            // Refresh accounts after successful action
            fetchAccounts();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error creating/updating account:", error);
            setError("Error creating/updating account.");
        }
    };

    return (
        <div className="p-6">
            <Navbar />
            <h1 className="text-2xl font-bold mb-4">Accounts</h1>
            {error && <p className="text-red-500">{error}</p>}
            {loading ? <p>Loading...</p> : (
                <div>
                    <button 
                        onClick={() => {
                            setSelectedAccount(null);
                            setIsModalOpen(true);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
                    >
                        Create Account
                    </button>
                    <table className="w-full border border-gray-700 text-white mt-4">
                        <thead>
                            <tr className="bg-gray-800">
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Industry</th>
                                <th className="border px-4 py-2">Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(accounts) && accounts.length > 0 ? (
                                accounts.map((account) => (
                                    <tr 
                                        key={account.id} 
                                        className="bg-gray-900 hover:bg-gray-800 cursor-pointer"
                                        onClick={() => router.push(`/accounts/${account.id}/contacts`)}
                                    >
                                        <td className="border px-4 py-2">{account.name}</td>
                                        <td className="border px-4 py-2">{account.industry || "N/A"}</td>
                                        <td className="border px-4 py-2">{account.category}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center py-2">No accounts found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            <AccountModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onCreateAccount={handleCreateAccount} 
            />
        </div>
    );
}
