import { defineStore } from "pinia";
import axios from "axios";

export const useOrderStore = defineStore("order", {
  state: () => ({
    apiUrl: import.meta.env.VITE_APP_APIURL,
    orders: [],
    totalData: 0,
    current: 1,
    perpage: 5,
    response: {
      status: null,
      message: null,
      list: [],
    },
  }),

  actions: {
    async fetchOrders() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
          console.error("User not found");
          return;
        }

        // ambil nama role
        const userRole = user.user_role_name;

        let url = `${this.apiUrl}/api/v1/orders?page=${this.current}&per_page=${this.perpage}`;

        // If the user is NOT a Super Admin, filter by user_id
        if (userRole !== "Super Admin" && userRole !== "Seller") {
          url += `&user_id=${user.id}`;
        }

        const res = await axios.get(url);
        this.orders = res.data.data.list;
        this.totalData = res.data.data.meta.total;
      } catch (error) {
        this.response = {
          status: error.response?.status || 500,
          message: error.response?.data?.message || "Failed to fetch orders.",
          list: error.response?.data?.errors || [],
        };
      }
    },

    async fetchOrderById(id) {
      try {
        const res = await axios.get(`${this.apiUrl}/api/v1/orders/?id=${id}`);
        this.orders = res.data.data.list;
        this.totalData = res.data.data.meta.total;
      } catch (error) {
        this.response = {
          status: error.response?.status || 500,
          message:
            error.response?.data?.message || "Failed to fetch order by id.",
          list: error.response?.data?.errors || [],
        };
      }
    },

    async addOrder(item) {
      try {
        const res = await axios.post(`${this.apiUrl}/api/v1/orders`, item);
        this.response = { status: res.status, message: res.data.message };

        await this.fetchOrders();
      } catch (error) {
        this.response = {
          status: error.response?.status || 500,
          message: error.response?.data?.message || "Failed to add order.",
          list: error.response?.data?.errors || [],
        };
      }
    },

    async removeOrder(id) {
      try {
        await axios.delete(`${this.apiUrl}/api/v1/orders/${id}`);
        await this.fetchOrders();
      } catch (error) {
        this.response = {
          status: error.response?.status || 500,
          message: error.response?.data?.message || "Failed to remove order.",
          list: error.response?.data?.errors || [],
        };
      }
    },

    async updateOrder(payload) {
      try {
        if (!payload.id || !payload.status) {
          throw new Error("Missing required fields: id or status.");
        }

        const res = await axios.put(`${this.apiUrl}/api/v1/orders`, payload);

        this.response = {
          status: res.status,
          message: res.data.message,
        };
      } catch (error) {
        console.error("Error updating order:", error);

        this.response = {
          status: error.response?.status || 500,
          message: error.response?.data?.message || "Failed to update order.",
          list: error.response?.data?.errors || [],
        };
      }
    },

    async changePage(newPage) {
      this.current = newPage;
      await this.fetchOrders();
    },

    resetOrders() {
      this.orders = [];
      this.totalData = 0;
      this.current = 1;
      this.response = {
        status: null,
        message: null,
        list: [],
      };
    },
  },
});
