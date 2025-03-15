import { useEffect, useState } from "react";

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateAccount: (accountData: {
        id?: string;
        name: string;
        industry?: string;
        category: "A" | "B" | "C" | "D";
        salesRepId?: string;
    }) => Promise<void>;
    account?: {
        id: string;
        name: string;
        industry?: string;
        category: "A" | "B" | "C" | "D";
        salesRepId?: string;
    } | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function AccountModal({ isOpen, onClose, onCreateAccount, account }: AccountModalProps) {
    const [formData, setFormData] = useState({
        id: account?.id ?? undefined,
        name: "",
        industry: "",
        category: "C" as "A" | "B" | "C" | "D",
        salesRepId: "",
    });
    const [salesReps, setSalesReps] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        if (isOpen && account) {
            setFormData({
                id: account.id,
                name: account.name,
                industry: account.industry ?? "",
                category: account.category as "A" | "B" | "C" | "D",
                salesRepId: account.salesRepId ?? "",
            });
        } else {
            setFormData({ id: undefined, name: "", industry: "", category: "C", salesRepId: "" });
        }
    }, [isOpen, account]);

    // Fetch Sales Reps when modal opens
    useEffect(() => {
        async function fetchSalesReps() {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) return;
                
                const res = await fetch(`${BASE_URL}/users/sales-reps`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch sales reps.");
                
                const data = await res.json();
                setSalesReps(data);
            } catch (error) {
                console.error("Error fetching sales reps:", error);
            }
        }

        if (isOpen) {
            fetchSalesReps();
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onCreateAccount(formData);
        onClose();
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center ${isOpen ? "block" : "hidden"}`}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4 text-black">{account ? "Update Account" : "Create New Account"}</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Account Name" value={formData.name} onChange={handleChange} className="w-full p-2 mb-2 border rounded text-black" required />
                    <input type="text" name="industry" placeholder="Industry (Optional)" value={formData.industry} onChange={handleChange} className="w-full p-2 mb-2 border rounded text-black" />
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 mb-2 border rounded text-black">
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                    
                    {/* Sales Rep Dropdown */}
                    <label className="text-black block mb-2">Sales Rep:</label>
                    <select 
                        name="salesRepId" 
                        value={formData.salesRepId} 
                        onChange={handleChange} 
                        className="w-full p-2 mb-2 border rounded text-black"
                    >
                        <option value="">Select a Sales Rep</option>
                        {salesReps.map(rep => (
                            <option key={rep.id} value={rep.id}>
                                {rep.name}
                            </option>
                        ))}
                    </select>

                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{account ? "Update" : "Create"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
