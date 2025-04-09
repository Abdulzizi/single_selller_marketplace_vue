// src/stores/authStore.js
import { defineStore } from "pinia";
import axios from "axios";
// import {router}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    apiUrl: import.meta.env.VITE_APP_APIURL,
    userLogin: {},
    csrfToken: "",
    bearerToken: "",
    response: {
      status: null,
      message: null,
      error: [],
    },
  }),
  actions: {
    async login(credential) {
      try {
        const res = await axios.post(
          `${this.apiUrl}/api/v1/auth/login`,
          credential
        );

        this.response = {
          status: res.status,
          message: res.data.message,
        };

        this.saveToken(res.data.data.access_token);
        this.saveUser(res.data.data.user);
      } catch (error) {
        let errors = error.response?.data?.errors || {};

        if (Array.isArray(errors)) {
          errors = { general: errors }; // Store as { general: ["Error message here"] }
        }

        this.response = {
          status: error.response?.status,
          message: error.response?.data?.message || "Something went wrong",
          list: errors,
        };
      }
    },
    async logout() {
      await this.removeToken();
      await this.removeUser();
      this.userLogin = {};
    },
    async saveUserLogin() {
      try {
        const response = await axios.get("/v1/auth/profile");
        this.userLogin = response.data.data;
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    },
    async saveToken(token) {
      localStorage.setItem("token", token);
    },
    async removeToken() {
      localStorage.removeItem("token");
    },
    getToken() {
      return localStorage.getItem("token") || "";
    },
    async saveUser(user) {
      localStorage.setItem("user", JSON.stringify(user));

      if (user.user_role_name === "Client") {
        window.location.href = "/";
      }
    },
    async removeUser() {
      localStorage.removeItem("user");
    },
    getUser() {
      return JSON.parse(localStorage.getItem("user") || "");
    },
    async refresh() {
      try {
        console.log("🔄 Refreshing token...");

        const token = this.getToken();

        if (!token) return;

        const res = await axios.post(
          `${this.apiUrl}/api/v1/auth/refresh`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.saveToken(res.data.data.access_token);
        this.saveUser(res.data.data.user);
      } catch (error) {
        this.logout();
      }
    },

    async forgotPassword(email) {
      try {
        const res = await axios.post(`${this.apiUrl}/api/v1/forgot-password`, {
          email,
        });

        this.response = {
          status: res.status,
          message: res.data.message,
        };
      } catch (error) {
        this.response = {
          status: error.response?.status,
          message: error.message,
          error: error.response?.data?.errors || [],
        };
      }
    },
  },
});
