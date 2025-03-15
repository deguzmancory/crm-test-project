"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        async function fetchContacts() {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    router.push("/login");
                    return;
                }

                const res = await fetch(`${BASE_URL}/accounts/${id}/contacts`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Failed to fetch contacts.");

                const data = await res.json();
                setContacts(data);
            } catch (error) {
                console.error("Error fetching contacts:", error);
                setError("Failed to load contacts.");
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchContacts();
    }, [id, router]);

    return (
        <div className="p-6">
            <Navbar />
            <h1 className="text-2xl font-bold mb-4">Contacts for Account</h1>
            {error && <p className="text-red-500">{error}</p>}
            {loading ? <p>Loading...</p> : (
                <table className="w-full border border-gray-700 text-white mt-4">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="border px-4 py-2">First Name</th>
                            <th className="border px-4 py-2">Last Name</th>
                            <th className="border px-4 py-2">Email</th>
                            <th className="border px-4 py-2">Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.length > 0 ? contacts.map((contact) => (
                            <tr key={contact.id} className="bg-gray-900 hover:bg-gray-800">
                                <td className="border px-4 py-2">{contact.firstName}</td>
                                <td className="border px-4 py-2">{contact.lastName}</td>
                                <td className="border px-4 py-2">{contact.email}</td>
                                <td className="border px-4 py-2">{contact.phone}</td>
                            </tr>
                        )) : <tr><td colSpan={4} className="text-center py-2">No contacts available.</td></tr>}
                    </tbody>
                </table>
            )}
        </div>
    );
}
