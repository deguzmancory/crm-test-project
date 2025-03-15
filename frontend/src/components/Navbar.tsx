// frontend/src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold">
          CRM Application
        </Link>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <span>Menu</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg">
              <Link
                href="/dashboard"
                className="block px-4 py-2 hover:bg-blue-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="block px-4 py-2 hover:bg-blue-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/users"
                className="block px-4 py-2 hover:bg-blue-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Users
              </Link>
              <Link
                href="/accounts" // ✅ Added Accounts page
                className="block px-4 py-2 hover:bg-blue-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Accounts
              </Link>
              <Link
                href="/contacts" // ✅ Added Contacts page
                className="block px-4 py-2 hover:bg-blue-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Contacts
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-blue-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
