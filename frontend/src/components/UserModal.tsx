"use client";

import { useEffect, useState } from "react";

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateUser: (userData: {
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: "USER" | "MANAGER" | "ADMIN";
    }) => void;
}

export default function UserModal({ isOpen, onClose, onCreateUser }: UserModalProps) {
    const initialFormState: {
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: "USER" | "MANAGER" | "ADMIN";
    } = {
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "USER",
    };

    const [formData, setFormData] = useState(initialFormState);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData(initialFormState);
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "role" ? (value as "USER" | "MANAGER" | "ADMIN") : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreateUser(formData);
        onClose();
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${isOpen ? "block" : "hidden"}`}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4 text-black">Create New User</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-2 mb-2 border rounded text-black"
                        required
                    />
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full p-2 mb-2 border rounded text-black"
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full p-2 mb-2 border rounded text-black"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 mb-2 border rounded text-black"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 mb-2 border rounded text-black"
                        required
                    />
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full p-2 mb-2 border rounded text-black"
                    >
                        <option value="USER">User</option>
                        <option value="MANAGER">Manager</option>
                        <option value="ADMIN">Admin</option>
                    </select>

                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
