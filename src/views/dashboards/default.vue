<template>
  <Layout>
    <PageHeader title="Dashboard" pageTitle="Overview" />

    <div class="dashboard-wrapper">
      <div class="dashboard-grid">
        <div class="chart-card">
          <h3>Total Sales</h3>
          <div v-if="hasTotalSalesData">
            <apexchart type="area" :options="totalSales" :series="totalSalesSeries" />
          </div>
          <div v-else class="no-data">No data available</div>
        </div>

        <div class="chart-card">
          <h3>New Users</h3>
          <div v-if="hasNewUsersData">
            <apexchart type="line" :options="newUsers" :series="newUsersSeries"></apexchart>
          </div>
          <div v-else class="no-data">No data available</div>
        </div>

        <div class="chart-card full-width">
          <h3>Orders</h3>
          <div v-if="hasOrdersData">
            <apexchart type="bar" :options="orders" :series="ordersSeries"></apexchart>
          </div>
          <div v-else class="no-data">No data available</div>
        </div>

        <div class="chart-card full-width">
          <h3>Revenue Distribution</h3>
          <div v-if="hasRevenueData">
            <apexchart type="pie" :options="revenue" :series="revenueSeries"></apexchart>
          </div>
          <div v-else class="no-data">No data available</div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import { useDashboardStore } from "@/state/pinia";

import { useProgress } from "@/helpers/progress"; // Import custom progress function
import {
  showErrorToast,
} from "@/helpers/alert.js";

const dashboardStore = useDashboardStore();

const { startProgress, finishProgress, failProgress } = useProgress();

// Option chart
const getDefaultChartOptions = () => ({
  chart: {
    toolbar: { show: false },
    zoom: { enabled: false },
    animations: { enabled: true },
  },
});

// label helper function
const formatMonth = (monthStr) => {
  if (!monthStr || !monthStr.includes('-')) return 'Unknown';

  const [year, month] = monthStr.split('-');
  const date = new Date(`${year}-${month}-01`);

  return date.toLocaleString('default', { month: 'short', year: 'numeric' });
};

const hasTotalSalesData = computed(() => totalSalesSeries.value[0].data.length > 0);
const hasNewUsersData = computed(() => newUsersSeries.value[0].data.length > 0);
const hasOrdersData = computed(() => ordersSeries.value[0].data.length > 0);
const hasRevenueData = computed(() => revenueSeries.value.length > 0);

// Total Sales - Area Chart
const totalSales = ref({
  ...getDefaultChartOptions(),
  xaxis: { categories: [] },
});
const totalSalesSeries = ref([{ name: "Sales", data: [] }]);

// New Users - Line Chart
const newUsers = ref({
  ...getDefaultChartOptions(),
  xaxis: { categories: [] },
  yaxis: {
    labels: {
      formatter: (val) => Math.round(val), // y-axis jadi whole number
    },
  },

});
const newUsersSeries = ref([{ name: "Users", data: [] }]);

// Orders - Full Width Bar Chart
const orders = ref({
  ...getDefaultChartOptions(),
  xaxis: { categories: [] },
});
const ordersSeries = ref([{ name: "Orders", data: [] }]);

// Revenue - Full Width Pie Chart
const revenue = ref({
  ...getDefaultChartOptions(),
  labels: [],
});
const revenueSeries = ref([]);

var dashboardData = ref([]);

const getDashboardData = async () => {
  try {
    startProgress();
    await dashboardStore.getDashboardData();
    if (dashboardStore.dashboard) {
      finishProgress();
      dashboardData.value = dashboardStore.dashboard || [];

      const data = dashboardData.value;

      // Total Sales - Area Chart
      totalSales.value.xaxis.categories = data.total_sales?.map((_, idx) => `Data ${idx + 1}`) || [];
      totalSalesSeries.value[0].data = data.total_sales || [];

      // New Users - Line Chart
      newUsers.value.xaxis.categories = data.new_users.map(item => item.month ? formatMonth(item.month) : 'Unknown');
      newUsersSeries.value[0].data = data.new_users.map(item => item.value);

      /**
       * TODO: Check backend format
       */
      // Orders - Bar Chart
      orders.value.xaxis.categories = data.orders?.map(item => formatMonth(item.month));
      ordersSeries.value[0].data = data.orders.map(item => item.value);

      // Revenue - Pie Chart
      revenue.value.labels = data.revenue_distribution?.map((_, idx) => `Item ${idx + 1}`) || [];
      revenueSeries.value = data.revenue_distribution || [];

    } else {
      failProgress();
      dashboardData.value = [];
    }

    console.log(`Dashboard Data:`, dashboardData.value);
  } catch (error) {
    failProgress();
    showErrorToast("Something went wrong.");
    console.error("Error fetching dashboard data:", error);
  }
};

onMounted(() => {
  getDashboardData();
});

</script>

<style scoped>
.dashboard-wrapper {
  padding: 20px;
}

.no-data {
  padding: 20px;
  color: #888;
  font-style: italic;
}


.dashboard-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(2, 1fr);
}

.chart-card {
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.full-width {
  grid-column: span 2;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: span 1;
  }
}
</style>