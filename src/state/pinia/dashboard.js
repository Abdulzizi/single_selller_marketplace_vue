import { defineStore } from "pinia";
import axios from "axios";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    apiUrl: import.meta.env.VITE_APP_APIURL || "http://127.0.0.1:8000",
    dashboard: [],
    response: {
      status: null,
      message: null,
      error: [],
    },
    totalData: 0,
  }),
  actions: {
    // * Fetch user data
    async getDashboardData() {
      try {
        const url = `${this.apiUrl}/api/v1/dashboard/data`;

        const res = await axios.get(url);
        const dashboardDataList = res.data.data.list;
        // console.log(`Dashboard Data:`, dashboardDataList);

        this.dashboard = dashboardDataList;
        this.totalData = res.data.data.meta.total;
      } catch (error) {
        this.response = {
          status: error.response?.status,
          message: error.message,
        };
      }
    },

    resetState() {
      this.dashboard = [];
      this.response = {
        status: null,
        message: null,
        error: [],
      };

      this.totalData = 0;
    },
  },
});
