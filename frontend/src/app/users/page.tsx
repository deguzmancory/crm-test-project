"use client";
import { useEffect, useState } from "react";

interface User {
    id: number;
    name: string;
    email: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch("/api/users");
                if (!response.ok) throw new Error("Failed to fetch users.");
                
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.log("Error fetching users:", error);
                setError("Failed to load users. Please try again.")
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">User List</h1>
    
          {/* Display Error Message */}
          {error && <p className="text-red-500">{error}</p>}
    
          {/* Loading State */}
          {loading && <p>Loading...</p>}
    
          {/* Render Users if No Error */}
          {!loading && !error && (
            <ul className="list-disc pl-6">
              {users.map((user) => (
                <li key={user.id} className="text-lg">
                  {user.name} ({user.email})
                </li>
              ))}
            </ul>
          )}
        </div>
      );
}