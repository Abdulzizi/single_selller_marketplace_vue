import { defineStore } from "pinia";
import axios from "axios";

export const useProductStore = defineStore("product", {
  state: () => ({
    apiUrl: import.meta.env.VITE_APP_APIURL,
    products: [],
    productById: {},
    productBySlug: {},
    response: {
      status: null,
      message: null,
      list: [],
    },
    formAction: {
      action: "",
      form_title: "",
      form_button: "",
    },
    totalData: 0,
    current: 1,
    perpage: 6,
    productCategoryId: "",
    minPrice: 0,
    maxPrice: 0,
    maxImageSize: 3 * 1024 * 1024,
    searchQuery: "",
  }),

  actions: {
    openForm(newAction) {
      this.formAction.action = newAction;
    },
    async getProducts(isLoadMore = false) {
      try {
        const productCategoryParam = this.productCategoryId.length
          ? this.productCategoryId.join(",")
          : "";

        const url = `${this.apiUrl}/api/v1/products?page=${this.current}&per_page=${this.perpage}&product_category_id=${productCategoryParam}&min_price=${this.minPrice}&max_price=${this.maxPrice}&name=${this.searchQuery}`;
        const res = await axios.get(url);

        if (isLoadMore) {
          this.products = [...this.products, ...res.data.data.list]; // Append new products
        } else {
          this.products = res.data.data.list; // Replace when not loading more
          this.currentPage = 1; // reset page
        }

        this.products = res.data.data.list;
        this.totalData = res.data.data.meta.total;
      } catch (error) {
        this.response = {
          status: error.response?.status || 500,
          message: error.response?.data?.message || "Failed to fetch products.",
          list: error.response?.data?.errors || [],
        };

        throw this.response;
      }
    },

    async deleteProduct(id) {
      try {
        const res = await axios.delete(`${this.apiUrl}/api/v1/products/${id}`);
        this.error = {
          status: res.status,
          message: res.data.message,
        };
      } catch (error) {
        console.log(error);
        this.response = {
          status: error.response.status,
          message: error.message,
          list: error.response.data.errors,
        };
      }
    },

    async changePage(newPage) {
      this.current = newPage;
    },
    async searchProduct(query) {
      try {
        // console.log("Search Query in state:", query);

        this.searchQuery = query;
        this.current = 1;

        await this.getProducts();
      } catch (error) {
        console.error("Error Response:", error.response);
      }
    },

    async addProduct(product) {
      try {
        const res = await axios.post(`${this.apiUrl}/api/v1/products`, product);
        this.response = {
          status: res.status,
          message: res.data.message,
        };
      } catch (error) {
        console.log(error);
        this.response = {
          status: error.response.status,
          message: error.message,
          list: error.response.data.errors,
        };
      }
    },

    async getProductById(productId) {
      try {
        const res = await axios.get(
          `${this.apiUrl}/api/v1/products/${productId}`
        );
        this.productById = res.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getProductBySlug(slug) {
      try {
        const res = await axios.get(`${this.apiUrl}/api/v1/product/${slug}`);

        this.productBySlug = res.data.data;
      } catch (error) {
        console.log(error);
        this.response = {
          status: error.response?.status || 500,
          message:
            error.response?.data?.message || "Failed to fetch product by slug.",
          list: error.response?.data?.errors || [],
        };
      }
    },

    async updateProduct(product) {
      try {
        console.log(product);
        const res = await axios.put(`${this.apiUrl}/api/v1/products/`, product);

        console.log(res);
        this.response = {
          status: res.status,
          message: res.data.message,
        };
      } catch (error) {
        console.log(error);
      }
    },

    setProductCategories(categories) {
      this.productCategoryId = categories;
    },

    resetState() {
      this.products = [];
      this.productById = "";
      this.response = {
        status: null,
        message: null,
        list: [],
      };
      this.formAction = {
        action: "",
        form_title: "",
        form_button: "",
      };
      this.totalData = 0;
      this.current = 1;
      this.searchQuery = "";
      this.isEmpty = false;
    },
  },
});
