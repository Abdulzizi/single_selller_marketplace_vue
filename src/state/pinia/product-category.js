import { defineStore } from "pinia";
import axios from "axios";

export const useProductCategoryStore = defineStore("category", {
  state: () => ({
    apiUrl: import.meta.env.VITE_APP_APIURL || "http://127.0.0.1:8000",
    categories: [],
    category: null,
    error: {
      status: null,
      message: null,
      list: [],
    },
    modalAction: {
      action: "",
      modal_title: "",
      modal_button: "",
    },
    totalData: 0,
    current: 1,
    perPage: 5,
    searchQuery: "",
    totalPage: 0,
  }),

  actions: {
    openForm(newAction, category) {
      this.modalAction.action = newAction;
      this.category = category;
    },
    async changePage(newPage) {
      this.current = newPage;
      await this.getCategories();
    },

    async getCategories() {
      try {
        const url = `${this.apiUrl}/api/v1/categories?page=${this.current}&per_page=${this.perPage}&name=${this.searchQuery}`;
        const res = await axios.get(url);

        this.categories = res.data.data.list;
        this.totalData = res.data.data.meta.total;
        this.totalPage = Math.ceil(this.totalData / this.perPage);
      } catch (error) {
        console.log(error);
      }
    },

    async updateCategory(category) {
      try {
        const res = await axios.put(
          `${this.apiUrl}/api/v1/categories`,
          category
        );

        console.log(res);

        this.error = {
          status: res.status,
          message: res.data.message,
        };
      } catch (error) {
        this.error = {
          status: error.response?.status,
          message: error.message,
          list: error.response.data.errors,
        };
      }
    },

    async addCategory(category) {
      try {
        const res = await axios.post(
          `${this.apiUrl}/api/v1/categories`,
          category
        );

        this.error = {
          status: res.status,
          message: res.data.message,
        };
      } catch (error) {
        this.error = {
          status: error.response?.status,
          message: error.message,
          list: error.response.data.errors,
        };
      }
    },

    async deleteCategory(id) {
      try {
        const res = await axios.delete(
          `${this.apiUrl}/api/v1/categories/${id}`
        );
        this.error = {
          status: res.status,
          message: res.data.message,
        };
      } catch (error) {
        console.log(error);
        this.error = {
          status: error.response?.status,
          message: error.message,
          list: error.response.data.errors,
        };
      }
    },

    resetState() {
      this.categories = [];
      (this.error = {
        status: null,
        message: null,
        list: [],
      }),
        (this.modalAction = {
          action: "",
          modal_title: "",
          modal_button: "",
        });
      this.searchQuery = "";
      this.current = 1;
      this.perPage = 5;
      this.totalData = 0;
    },
  },
});
