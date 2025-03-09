const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    try {
        const res = await fetch(`${BASE_URL}${url}`, {
            ...options,
            headers: {
                ...(options.headers || {}), // Ensure headers exist
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (res.status === 401) {
            // Token expired, attempt to refresh
            const newAccessToken = await refreshTokenRequest(refreshToken);
            if (!newAccessToken) {
                logoutUser();
                return null;
            }

            return await fetch(`${BASE_URL}${url}`, {
                ...options,
                headers: {
                    ...(options.headers || {}),
                    Authorization: `Bearer ${newAccessToken}`,
                },
            });
        }

        return res;
    } catch (error) {
        console.error("API fetch error:", error);
        return null;
    }
}

// Function to refresh token
async function refreshTokenRequest(refreshToken: string | null) {
    if (!refreshToken) return null;

    try {
        const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!res.ok) return null;

        const data = await res.json();
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        return data.access_token;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
    }
}

// Function to log out user
function logoutUser() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
}
