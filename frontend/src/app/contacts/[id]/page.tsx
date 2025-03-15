"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Account {
    id: string;
    name: string;
}

interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    account?: Account | null;
}

export default function ContactDetailsPage() {
    const params = useParams();  // ✅ Unwrap `params`
    const router = useRouter();
    const [contact, setContact] = useState<Contact | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchContact() {
            if (!params?.id) return; // ✅ Ensure params are available before fetching data

            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    router.push("/login");
                    return;
                }

                const res = await fetch(`${BASE_URL}/contacts/${params.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Failed to fetch contact details.");

                const data = await res.json();
                setContact(data);
            } catch (error) {
                console.error("Error fetching contact:", error);
                setError("Failed to load contact details. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        fetchContact();
    }, [params.id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <Navbar />
            <h1 className="text-2xl font-bold mb-4">Contact Details</h1>

            <div className="bg-gray-900 p-4 rounded">
                <p><strong>First Name:</strong> {contact?.firstName}</p>
                <p><strong>Last Name:</strong> {contact?.lastName}</p>
                <p><strong>Email:</strong> {contact?.email}</p>
                <p><strong>Phone:</strong> {contact?.phone || "N/A"}</p>
                <p>
                    <strong>Account:</strong>{" "}
                    {contact?.account ? (
                        <a href={`/accounts/${contact.account.id}`} className="text-blue-500 hover:underline">
                            {contact.account.name}
                        </a>
                    ) : (
                        "Unassigned"
                    )}
                </p>
            </div>

            <button
                onClick={() => router.push("/contacts")}
                className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
                Back to Contacts
            </button>
        </div>
    );
}
