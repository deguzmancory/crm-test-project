import { useEffect, useState } from "react";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateContact: (contactData: {
        id?: string;
        accountId: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
    }) => Promise<void>;
    contact?: {
        id: string;
        accountId: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
    } | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Account {
    id: string;
    name: string;
}

export function ContactModal({ isOpen, onClose, onCreateContact, contact }: ContactModalProps) {
    const [formData, setFormData] = useState({
        id: contact?.id ?? undefined,
        accountId: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAccounts() {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) return;
                const res = await fetch(`${BASE_URL}/accounts`, {
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

        if (isOpen) {
            fetchAccounts();
            if (contact) {
                setFormData({
                    id: contact.id,
                    accountId: contact.accountId,
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    email: contact.email,
                    phone: contact.phone ?? "",
                });
            } else {
                setFormData({ id: undefined, accountId: "", firstName: "", lastName: "", email: "", phone: "" });
            }
        }
    }, [isOpen, contact]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onCreateContact(formData);
        onClose();
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center ${isOpen ? "block" : "hidden"}`}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4 text-black">{contact ? "Update Contact" : "Create New Contact"}</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit}>
                    {/* Dropdown for Account ID */}
                    <label className="text-black font-semibold block mb-1">Account</label>
                    <select
                        name="accountId"
                        value={formData.accountId}
                        onChange={handleChange}
                        className="w-full p-2 mb-2 border rounded text-black bg-white"
                        required
                    >
                        <option value="">Select an Account</option>
                        {accounts.map((account) => (
                            <option key={account.id} value={account.id}>
                                {account.name}
                            </option>
                        ))}
                    </select>

                    <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="w-full p-2 mb-2 border rounded text-black" required />
                    <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="w-full p-2 mb-2 border rounded text-black" required />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 mb-2 border rounded text-black" required />
                    <input type="text" name="phone" placeholder="Phone (Optional)" value={formData.phone} onChange={handleChange} className="w-full p-2 mb-2 border rounded text-black" />
                    
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{contact ? "Update" : "Create"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
