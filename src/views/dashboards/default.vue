<script setup>
import { ref } from "vue";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

// Shared Chart Options (No Interactions)
const getDefaultChartOptions = () => ({
  chart: {
    toolbar: { show: false },
    zoom: { enabled: false },
    animations: { enabled: false },
  },
});

// Total Sales - Area Chart
const totalSales = ref({ ...getDefaultChartOptions(), xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] } });
const totalSalesSeries = ref([{ name: "Sales", data: [5000000, 4500000, 6000000, 7000000, 5500000, 6500000] }]);

// New Users - Line Chart
const newUsers = ref({ ...getDefaultChartOptions(), xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] } });
const newUsersSeries = ref([{ name: "Users", data: [250, 300, 400, 500, 450, 600] }]);

// Orders - Full Width Bar Chart
const orders = ref({ ...getDefaultChartOptions(), xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] } });
const ordersSeries = ref([{ name: "Orders", data: [120, 140, 180, 200, 170, 210] }]);

// Revenue - Full Width Pie Chart
const revenue = ref({ ...getDefaultChartOptions(), labels: ["Product A", "Product B", "Product C", "Product D"] });
const revenueSeries = ref([40, 25, 20, 15]);
</script>

<template>
  <Layout>
    <PageHeader title="Dashboard" pageTitle="Overview" />

    <div class="dashboard-wrapper">
      <div class="dashboard-grid">
        <div class="chart-card">
          <h3>Total Sales</h3>
          <apexchart type="area" :options="totalSales" :series="totalSalesSeries"></apexchart>
        </div>

        <div class="chart-card">
          <h3>New Users</h3>
          <apexchart type="line" :options="newUsers" :series="newUsersSeries"></apexchart>
        </div>

        <div class="chart-card full-width">
          <h3>Orders</h3>
          <apexchart type="bar" :options="orders" :series="ordersSeries"></apexchart>
        </div>

        <div class="chart-card full-width">
          <h3>Revenue Distribution</h3>
          <apexchart type="pie" :options="revenue" :series="revenueSeries"></apexchart>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
/* Wrapper for spacing */
.dashboard-wrapper {
  padding: 20px;
}

/* Main Grid Layout */
.dashboard-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(2, 1fr);
}

/* Chart Card */
.chart-card {
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Make Orders and Revenue charts full width */
.full-width {
  grid-column: span 2;
}

/* Responsive: Single column on small screens */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: span 1;
  }
}
</style>