"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ContactModal } from "@/components/ContactsModal";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Account {
    id: string;
    name: string;
}

interface Contact {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    accountId?: string;
    account?: Account;
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    router.push("/login");
                    return;
                }

                const res = await fetch(`${BASE_URL}/contacts?includeAccount=true`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Failed to fetch contacts.");

                const data = await res.json();
                setContacts(data);
            } catch (error) {
                console.error("Error fetching contacts:", error);
                setError("Failed to load contacts. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleCreateContact = async (contactData: {
        id?: string;
        accountId: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
    }) => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                router.push("/login");
                return;
            }

            const endpoint = contactData.id ? `${BASE_URL}/contacts/${contactData.id}` : `${BASE_URL}/contacts`;
            const method = contactData.id ? "PUT" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(contactData),
            });

            if (!res.ok) throw new Error(`Failed to ${contactData.id ? "update" : "create"} contact`);

            // Refresh contact list after adding/updating
            const updatedContacts = await fetch(`${BASE_URL}/contacts?includeAccount=true`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => res.json());

            setContacts(updatedContacts);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error creating/updating contact:", error);
            setError("Failed to process request.");
        }
    };

    return (
        <div className="p-6">
            <Navbar />
            <h1 className="text-2xl font-bold mb-4">Contacts</h1>
            {error && <p className="text-red-500">{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                    >
                        Create Contact
                    </button>
                    <table className="w-full border border-gray-700 text-white mt-4">
                        <thead>
                            <tr className="bg-gray-800">
                                <th className="border px-4 py-2">First Name</th>
                                <th className="border px-4 py-2">Last Name</th>
                                <th className="border px-4 py-2">Email</th>
                                <th className="border px-4 py-2">Phone</th>
                                <th className="border px-4 py-2">Account</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map((contact) => (
                                <tr
                                    key={contact.id}
                                    className="bg-gray-900 hover:bg-gray-800 cursor-pointer"
                                    onClick={() => router.push(`/contacts/${contact.id}`)}
                                >
                                    <td className="border px-4 py-2">{contact.firstName}</td>
                                    <td className="border px-4 py-2">{contact.lastName}</td>
                                    <td className="border px-4 py-2">{contact.email}</td>
                                    <td className="border px-4 py-2">{contact.phone || "N/A"}</td>
                                    <td className="border px-4 py-2">
                                        {contact.account ? contact.account.name : "Unassigned"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreateContact={handleCreateContact} />
        </div>
    );
}
