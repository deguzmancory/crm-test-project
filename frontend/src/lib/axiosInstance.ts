import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toUpperCase();
    // Use resourceName if provided; default to "Resource"
    const resource = response.config.resourceName || "Resource";

    // Only show success messages for non-GET requests (or add GET if needed)
    if (method !== 'GET') {
      let successMessage = response.data?.message;
      switch (method) {
        case 'POST':
          successMessage = successMessage || `${resource} created successfully.`;
          break;
        case 'PUT':
          successMessage = successMessage || `${resource} updated successfully.`;
          break;
        case 'DELETE':
          successMessage = successMessage || `${resource} deleted successfully.`;
          break;
        default:
          successMessage = successMessage || 'Operation successful.';
      }
      toast.success(`Success: ${successMessage}`, { position: "bottom-right" });
    }
    
    return response;
  },
  (error) => {
    let finalErrorMessage =
      error.response?.data?.message || error.message || 'An unexpected error occurred.';
    const status = error.response?.status;

    if (status === 401) {
      finalErrorMessage = 'Unauthorized. Please log in again.';
      toast.error(`Error: ${finalErrorMessage}`, { position: "bottom-right" });
      window.location.href = '/login';
    } else if (status === 403) {
      finalErrorMessage = 'Forbidden. You do not have permission to access this resource.';
    } else if (status === 404) {
      finalErrorMessage = 'Resource not found.';
    } else if (status === 500) {
      finalErrorMessage = 'Server error. Please try again later.';
    }

    if (status !== 401) {
      toast.error(`Error: ${finalErrorMessage}`, { position: "bottom-right" });
    }

    console.error('Axios error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
