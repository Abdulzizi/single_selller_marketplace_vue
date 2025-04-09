import { showConfirmationDialog, showErrorToast } from "@/helpers/alert";
import { useAuthStore } from "@/state/pinia";
import axios from "axios";

export function axiosInterceptors() {
  const auth = useAuthStore();

  const forceLogout = async () => {
    await auth.logout();
    window.location.href = "/login";
  };

  axios.interceptors.request.use(
    (config) => {
      const token = auth.getToken(); // Mengakses Pinia store dari globalProperties

      // if (['GET', 'PUT', 'POST', 'DELETE'].includes(config.method.toUpperCase())) {
      // }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        // Menambahkan token ke header
      }

      if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json"; // Menetapkan Content-Type jika tidak ada
      }

      config.headers["Accept"] = "application/json"; // Menetapkan Accept header

      return config;
    },
    (error) => {
      showErrorToast("Request Error", "Terjadi kesalahan pada request");
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;
      console.log("🔄 Refreshing token...");

      // Token kadaluarsa
      if (
        error.response &&
        error.response.status === 403 &&
        error.response.data.errors
      ) {
        if (!originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshed = await auth.refresh();
            console.log("✅ Refresh success?", refreshed);

            if (refreshed) {
              originalRequest.headers.Authorization = `Bearer ${auth.getToken()}`;
              return axios(originalRequest);
            } else {
              await forceLogout();
            }
          } catch (refreshError) {
            console.log("❌ Refresh failed", refreshError);

            await forceLogout();
          }
        } else {
          // Already retried once, force logout
          await forceLogout();
        }
      }

      // General 403/401 (maybe user tampered token or session expired)
      else if (error.response && [403, 401].includes(error.response.status)) {
        const errors = error.response?.data?.errors;
        const message = Array.isArray(errors)
          ? errors[0]
          : typeof errors === "string"
          ? errors
          : "Saatnya Login Lagi!";

        const confirmed = await showConfirmationDialog(
          "Ooops",
          message,
          "Login Lagi",
          "Tutup"
        );

        if (confirmed) {
          await auth.logout();
          window.location.href = "/login";
        }
      } else {
        showErrorToast("Error", "Something went wrong");
      }

      return Promise.reject(error);
    }
  );
}
