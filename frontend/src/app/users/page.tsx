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
	roles: string[];
}

export default function UsersPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
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

	const handleCreateUser = async (userData: { id?: number; username: string; firstName: string; lastName: string; email: string; password?: string; roles: string[] }) => {
		if (!currentUser || !currentUser.roles.includes("ADMIN")) return;

		try {
			const token = localStorage.getItem("access_token");

			const endpoint = userData.id ? `${BASE_URL}/users/${userData.id}` : `${BASE_URL}/users`;
			const method = userData.id ? "PUT" : "POST";

			const res = await fetch(endpoint, {
				method,
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});

			if (!res.ok) {
				const errorMessage = await res.text();
				throw new Error(`Failed to ${userData.id ? "update" : "create"} user: ${errorMessage}`);
			}

			await fetchUsers();
			setIsModalOpen(false);
		} catch (error) {
			console.error("Error creating/updating user:", error);
		}
	};

	const handleUpdateUser = (user: User) => {
		setSelectedUser({ ...user, id: user.id });
		setIsModalOpen(true);
	};

	const handleDeleteUser = async (id: number) => {
		if (!currentUser || !currentUser.roles.includes("ADMIN")) return;

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
					{currentUser?.roles.includes("ADMIN") && (
						<button
							onClick={() => {
								setSelectedUser(null);
								setIsModalOpen(true);
							}}
							className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
						>
							Create User
						</button>
					)}
					<div className="overflow-x-auto">
						<table className="w-full border-collapse border border-gray-700 text-white">
							<thead>
								<tr className="bg-gray-800">
									<th className="border border-gray-700 px-4 py-2">Username</th>
									<th className="border border-gray-700 px-4 py-2">First Name</th>
									<th className="border border-gray-700 px-4 py-2">Last Name</th>
									<th className="border border-gray-700 px-4 py-2">Email</th>
									<th className="border border-gray-700 px-4 py-2">Roles</th>
									{currentUser?.roles.includes("ADMIN") && (
										<th className="border border-gray-700 px-4 py-2">Actions</th>
									)}
								</tr>
							</thead>
							<tbody>
								{users.map((user) => (
									<tr
										key={user.id}
										className="bg-gray-900 hover:bg-gray-800 cursor-pointer"
										onClick={() => router.push(`/users/${user.id}`)}
									>
										<td className="border border-gray-700 px-4 py-2">
											<a
												href={`/users/${user.id}`}
												className="text-blue-400 hover:underline"
												onClick={(e) => e.stopPropagation()}
											>
												{user.username}
											</a>
										</td>
										<td className="border border-gray-700 px-4 py-2">{user.firstName}</td>
										<td className="border border-gray-700 px-4 py-2">{user.lastName}</td>
										<td className="border border-gray-700 px-4 py-2">{user.email}</td>
										<td className="border border-gray-700 px-4 py-2">{user.roles.join(", ")}</td>
										{currentUser?.roles.includes("ADMIN") && (
											<td className="border border-gray-700 px-4 py-2 flex center">
												<button
													onClick={(e) => {
														e.stopPropagation();
														handleDeleteUser(user.id);
													}}
													className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
												>
													Delete
												</button>
											</td>
										)}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			<UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreateUser={handleCreateUser} user={selectedUser} />
		</div>
	);
}
