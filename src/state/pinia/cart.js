import { defineStore } from "pinia";
import axios from "axios";

export const useCartStore = defineStore("cart", {
  state: () => ({
    apiUrl: import.meta.env.VITE_APP_APIURL,
    cartItems: [],
    cartTotal: 0,
    response: {
      status: null,
      message: null,
      list: [],
    },
  }),

  actions: {
    async addCartItem(item) {
      try {
        const res = await axios.post(`${this.apiUrl}/api/v1/cart-items`, item);
        this.response = {
          status: res.status,
          message: res.data.message,
        };
        await this.fetchCartItems();
      } catch (error) {
        console.log(error);
        this.response = {
          status: error.response.status,
          message: error.message,
          list: error.response.data.errors,
        };
      }
    },

    async removeCartItem(id) {
      try {
        await axios.delete(`${this.apiUrl}/api/v1/cart-items/${id}`);
        await this.fetchCartItems();
      } catch (error) {
        console.log(error);
        this.response = {
          status: error.response.status,
          message: error.message,
          list: error.response.data.errors,
        };
      }
    },

    async updateCartItem(item) {
      try {
        const res = await axios.put(`${this.apiUrl}/api/v1/cart-items`, item);
        this.response = {
          status: res.status,
          message: res.data.message,
        };
        await this.fetchCartItems();
      } catch (error) {
        console.log(error);
      }
    },

    resetCart() {
      this.cartItems = [];
      this.cartTotal = 0;
      this.response = {
        status: null,
        message: null,
        list: [],
      };
    },
  },
});
