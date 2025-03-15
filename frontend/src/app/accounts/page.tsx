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

interface User {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    roles: string[];
}

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const router = useRouter();

    // Fetch user profile
    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                router.push("/login");
                return;
            }

            const res = await fetch(`${BASE_URL}/users/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                if (res.status === 401) router.push("/login");
                throw new Error(`Error ${res.status}: Failed to fetch profile.`);
            }

            const userData = await res.json();

            if (userData?.roles) {
                setUser(userData);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setError("Failed to load user profile.");
        }
    };

    // Fetch accounts
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

            if (!res.ok) {
                if (res.status === 401) router.push("/login");
                throw new Error(`Error ${res.status}: Failed to fetch accounts.`);
            }

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
        fetchUserProfile();
        fetchAccounts();
    }, []);

    // Handle account creation/updating
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

            if (!res.ok) {
                throw new Error(`Failed to ${selectedAccount ? "update" : "create"} account.`);
            }

            setIsModalOpen(false);
            fetchAccounts(); // Refresh data after successful update
        } catch (error) {
            console.error(error);
            setError("Error creating/updating account. Please try again.");
        }
    };

    return (
        <div className="p-6">
            <Navbar />
            <h1 className="text-2xl font-bold mb-4">Accounts</h1>
            {user ? <p>Welcome, {user.firstName}!</p> : <p>Loading profile...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {/* Show button ONLY if user has "ADMIN" in roles */}
                    {user?.roles.includes("ADMIN") && (
                        <button
                            onClick={() => {
                                setSelectedAccount(null);
                                setIsModalOpen(true);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
                        >
                            Create Account
                        </button>
                    )}
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
                                        onClick={() => router.push(`/accounts/${account.id}`)}
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
