"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { AccountModal } from "@/components/AccountsModal";
import axiosInstance from "@/lib/axiosInstance";

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
//   const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const router = useRouter();

  // Fetch user profile using axios
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }
      const response = await axiosInstance.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  // Fetch accounts using axios
  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }
      const response = await axiosInstance.get("/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchAccounts();
  }, []);

  // Handle account creation/updating using axios
  const handleCreateAccount = async (accountData: Omit<Account, "id">) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }
      const endpoint = selectedAccount
        ? `/accounts/${selectedAccount.id}`
        : "/accounts";
      const method = selectedAccount ? "put" : "post";

      await axiosInstance[method](endpoint, accountData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setIsModalOpen(false);
      fetchAccounts(); // Refresh data after successful update
    } catch (err) {
      console.error("Error creating/updating account:", err);
    }
  };

  return (
    <div className="p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Accounts</h1>
      {user ? <p>Welcome, {user.firstName}!</p> : <p>Loading profile...</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
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
              {accounts.length > 0 ? (
                accounts.map((account) => (
                  <tr
                    key={account.id}
                    className="bg-gray-900 hover:bg-gray-800 cursor-pointer"
                    onClick={() => router.push(`/accounts/${account.id}`)}
                  >
                    <td className="border px-4 py-2">{account.name}</td>
                    <td className="border px-4 py-2">
                      {account.industry || "N/A"}
                    </td>
                    <td className="border px-4 py-2">{account.category}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-2">
                    No accounts found.
                  </td>
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
