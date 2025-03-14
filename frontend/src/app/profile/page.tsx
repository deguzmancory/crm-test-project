"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface User {
  id: string;
  email: string;
  roles: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      let accessToken = localStorage.getItem("access_token");
      let refreshToken = localStorage.getItem("refresh_token");

      if (!accessToken) {
        router.push("/login");
        return;
      }

      try {
        let res = await fetch(`${BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.status === 401 && refreshToken) {
          // Attempt to refresh token
          const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            localStorage.setItem("access_token", refreshData.accessToken);
            accessToken = refreshData.accessToken;

            res = await fetch(`${BASE_URL}/users/profile`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
          } else {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            router.push("/login");
            return;
          }
        }

        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl">Profile</h1>
        <p>Email: {user.email}</p>
        <p>Role: {user.roles}</p>
      </div>
    </div>
  );
}
