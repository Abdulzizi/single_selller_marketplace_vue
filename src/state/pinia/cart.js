import { defineStore } from "pinia";
import axios from "axios";

export const useCartStore = defineStore("cart", {
  state: () => ({
    apiUrl: import.meta.env.VITE_APP_APIURL,
    cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
    cartTotal: 0,
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
    async fetchCartItems() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const url = `${this.apiUrl}/api/v1/carts?page=${this.current}&per_page=${this.perpage}&user_id=${user.id}`;
        const res = await axios.get(url);

        this.cartItems = res.data.data.list;
        // console.log(this.cartItems);
        this.totalData = res.data.data.meta.total;

        localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
      } catch (error) {
        this.response = {
          status: error.response?.status || 500,
          message:
            error.response?.data?.message || "Failed to fetch cart items.",
          list: error.response?.data?.errors || [],
        };
      }
    },

    async addCartItem(item) {
      try {
        const res = await axios.post(`${this.apiUrl}/api/v1/carts`, item);
        this.response = { status: res.status, message: res.data.message };

        await this.fetchCartItems();

        localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
      } catch (error) {
        this.response = {
          status: error.response?.status || 500,
          message:
            error.response?.data?.message || "Failed to add item to cart.",
          list: error.response?.data?.errors || [],
        };
      }
    },

    async removeCartItem(id) {
      try {
        await axios.delete(`${this.apiUrl}/api/v1/carts/${id}`);
        await this.fetchCartItems();

        localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
      } catch (error) {
        this.response = {
          status: error.response?.status || 500,
          message:
            error.response?.data?.message || "Failed to remove item from cart.",
          list: error.response?.data?.errors || [],
        };
      }
    },

    async updateCartItem(item) {
      try {
        const res = await axios.put(`${this.apiUrl}/api/v1/carts`, item);
        this.response = { status: res.status, message: res.data.message };

        await this.fetchCartItems();

        localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
      } catch (error) {
        this.response = {
          status: error.response?.status || 500,
          message:
            error.response?.data?.message || "Failed to update cart item.",
          list: error.response?.data?.errors || [],
        };
      }
    },

    async clearCart() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          throw new Error("User ID is required");
        }

        // Fetch current cart items from the store
        await this.fetchCartItems(); // Ensure you have the latest cart data

        if (this.cartItems.length === 0) {
          this.response = { status: 404, message: "No cart items to clear." };
          return;
        }

        // Iterate over cart items and remove each
        for (const item of this.cartItems) {
          await this.removeCartItem(item.id);
        }

        // Clear local storage and update the cart state
        localStorage.removeItem("cartItems");
        this.cartItems = [];

        this.response = {
          status: 200,
          message: "All cart items removed successfully.",
        };
      } catch (error) {
        this.response = {
          status: error.response?.status || 500,
          message: error.response?.data?.message || "Failed to clear cart.",
          list: error.response?.data?.errors || [],
        };
      }
    },

    async changePage(newPage) {
      this.current = newPage;
      await this.fetchCartItems();
    },

    resetCart() {
      this.cartItems = [];
      this.cartTotal = 0;
      this.totalData = 0;
      this.current = 1;
      this.response = {
        status: null,
        message: null,
        list: [],
      };

      localStorage.removeItem("cartItems");
    },
  },
});
