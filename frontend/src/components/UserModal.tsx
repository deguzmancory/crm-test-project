import { useEffect, useState } from "react";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateUser: (userData: {
    id?: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    roles: string[];
  }) => Promise<void>;
  user?: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
  } | null;
}

export default function UserModal({ isOpen, onClose, onCreateUser, user }: UserModalProps) {
  const [formData, setFormData] = useState({
    id: user?.id ?? undefined,
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roles: ["SALES_REP"],
  });
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset error when modal is opened
    setError(null);
    if (isOpen && user) {
      setFormData({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: "",
        roles: user.roles,
      });
    } else {
      setFormData({
        id: undefined,
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        roles: ["SALES_REP"],
      });
    }
  }, [isOpen, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Optionally clear error when the user starts modifying the form again
    setError(null);

    if (name === "roles" && e.target instanceof HTMLSelectElement) {
      const selectedRoles = Array.from(e.target.selectedOptions, (option) => option.value);
      setFormData((prev) => ({ ...prev, roles: selectedRoles }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Prepare payload; remove password when updating
      const userPayload = user ? { ...formData, password: undefined } : formData;
      await onCreateUser(userPayload);
      onClose();
    } catch (err: any) {
      // Capture and set error message to display to the user
      setError(err.message || "An unexpected error occurred. Please try again.");
      console.error("Error in creating/updating user:", err);
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center ${isOpen ? "block" : "hidden"}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-black">{user ? "Update User" : "Create New User"}</h2>
        
        {/* Display error message if one exists */}
        {error && (
          <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
            {error}
          </div>
        )}
        
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
          {!user && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 mb-2 border rounded text-black"
              required
            />
          )}
          <label className="text-black block mb-2">Roles:</label>
          <select
            name="roles"
            multiple
            value={formData.roles}
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded text-black"
          >
            <option value="SALES_REP">Sales Representative</option>
            <option value="ADMIN">Admin</option>
          </select>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              {user ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
