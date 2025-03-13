"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import UserModal from "@/components/UserModal";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface User {
	id: number;
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	role: "USER" | "MANAGER" | "ADMIN";
}

export default function UsersPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const router = useRouter();

	useEffect(() => {
		async function fetchData() {
			try {
				const token = localStorage.getItem("access_token");
				if (!token) {
					router.push("/login");
					return;
				}

				// Fetch current user profile
				const userRes = await fetch(`${BASE_URL}/users/profile`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				if (!userRes.ok) {
					localStorage.removeItem("access_token");
					router.push("/login");
					return;
				}

				const userData = await userRes.json();
				setCurrentUser(userData);

				// Fetch all users
				const usersRes = await fetch(`${BASE_URL}/users`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				if (!usersRes.ok) throw new Error("Failed to fetch users.");

				const usersData = await usersRes.json();
				setUsers(usersData);
			} catch (error) {
				console.error("Error fetching users:", error);
				setError("Failed to load users. Please try again.");
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [router]);

	const fetchUsers = async () => {
		try {
			const token = localStorage.getItem("access_token");
			if (!token) {
				router.push("/login");
				return;
			}

			const usersRes = await fetch(`${BASE_URL}/users`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (!usersRes.ok) throw new Error("Failed to fetch users.");

			const usersData = await usersRes.json();
			setUsers(usersData);
		} catch (error) {
			console.error("Error fetching users:", error);
			setError("Failed to load users. Please try again.");
		}
	};

	// ✅ Corrected Create User function
	const handleCreateUser = async (
		userData: Omit<User, "id"> & { password: string }
	) => {
		if (!currentUser || currentUser.role === "USER") return;

		try {
			const token = localStorage.getItem("access_token");
			const res = await fetch(`${BASE_URL}/users`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});

			if (!res.ok) {
				const errorMessage = await res.text();
				throw new Error(`Failed to create user: ${errorMessage}`);
			}

			// ✅ User successfully created
			await fetchUsers(); // 🔄 Refetch user list from backend
			setIsModalOpen(false); // Close modal after creation
		} catch (error) {
			console.error("Error creating user:", error);
		}
	};

	// ✅ Delete User function remains unchanged
	const handleDeleteUser = async (id: number) => {
		if (!currentUser || currentUser.role !== "ADMIN") return;

		try {
			const token = localStorage.getItem("access_token");
			await fetch(`${BASE_URL}/users/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});

			setUsers(users.filter((user) => user.id !== id));
		} catch (error) {
			console.error("Error deleting user:", error);
		}
	};

	return (
		<div className="p-6">
			<Navbar />
			<h1 className="text-2xl font-bold mb-4">User List</h1>

			{error && <p className="text-red-500">{error}</p>}
			{loading && <p>Loading...</p>}

			{!loading && !error && (
				<div>
					{/* ✅ Show "Create User" button only for MANAGER or ADMIN */}
					{currentUser?.role !== "USER" && (
						<button
							onClick={() => setIsModalOpen(true)}
							className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
						>
							Create User
						</button>
					)}
					<ul className="list-disc pl-6">
						{users.map((user, index) => (
							<li
								key={user.id || `temp-key-${index}`}
								className="text-lg flex justify-between items-center"
							>
								<span>
									{user.username} ({user.email}) - {user.role}
								</span>

								{currentUser?.role === "ADMIN" && (
									<button
										onClick={() =>
											handleDeleteUser(user.id)
										}
										className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ml-4"
									>
										Delete
									</button>
								)}
							</li>
						))}
					</ul>
				</div>
			)}

			{/* ✅ User Modal for creating new users */}
			<UserModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onCreateUser={handleCreateUser}
			/>
		</div>
	);
}
