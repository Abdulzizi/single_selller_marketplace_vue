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

        // if (!user || !user.user_id) {
        //   console.error("User ID not found");
        //   return;
        // }

        const url = `${this.apiUrl}/api/v1/orders?page=${this.current}&per_page=${this.perpage}&user_id=${user.id}`;
        const res = await axios.get(url);

        this.orders = res.data.data.list;
        // console.log(this.orders);
        this.totalData = res.data.data.meta.total;
      } catch (error) {
        this.response = {
          status: error.response?.status || 500,
          message: error.response?.data?.message || "Failed to fetch orders.",
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

    async updateOrder(item) {
      try {
        const res = await axios.put(`${this.apiUrl}/api/v1/orders`, item);
        this.response = { status: res.status, message: res.data.message };

        await this.fetchOrders();
      } catch (error) {
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
