<template>
    <Layout>
        <PageHeader title="My Orders" pageTitle="Orders" />

        <BRow class="gx-4 gy-4">

            <!-- Sidebar Filters (Status Filter) -->
            <BCol lg="3" class="d-none d-lg-block">
                <BCard class="shadow-sm border-0 rounded-3 p-3">
                    <BCardBody>
                        <h5 class="mb-3 fw-bold">Filter Orders</h5>

                        <!-- Order Status Filter -->
                        <h6 class="mt-3 fw-semibold">Status</h6>
                        <div>
                            <div v-for="status in orderStatuses" :key="status.value" class="form-check">
                                <input class="form-check-input" type="checkbox" :id="'status-' + status.value"
                                    :value="status.value" v-model="selectedStatuses" />
                                <label class="form-check-label" :for="'status-' + status.value">
                                    {{ status.label }}
                                </label>
                            </div>
                        </div>

                        <!-- Apply Filters -->
                        <BButton @click="applyFilters" variant="primary" class="mt-3 w-100 fw-bold">
                            Apply Filters
                        </BButton>

                        <a href="#" class="mt-2 d-block text-muted fst-italic" @click.prevent="resetFilters">
                            Reset filters
                        </a>

                    </BCardBody>
                </BCard>
            </BCol>

            <!-- Order List -->
            <BCol lg="9">
                <BCard class="shadow-sm border-0 rounded-3 bg-white p-4">
                    <BCardBody>
                        <a href="#" class="d-inline-block mb-3 fw-bold hover-underline"
                            @click.prevent="$router.push('/products')">
                            ← Back to Marketplace
                        </a>


                        <BRow class="g-4">
                            <BCol v-if="filteredOrders.length === 0" class="text-center py-5">
                                <h4 class="text-muted">No Orders Found</h4>
                                <p>Try adjusting the filters.</p>
                            </BCol>

                            <BCol v-for="order in filteredOrders" :key="order.id" xs="12">
                                <BCard class="border-2 rounded-3 overflow-hidden order-card">
                                    <BCardBody>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <h6 class="fw-bold">Order #{{ order.id }}</h6>
                                            <span class="badge bg-info text-dark">{{ order.status }}</span>
                                        </div>
                                        <p class="text-muted">{{ order.date }}</p>
                                        <p class="fw-bold">Total: RP. {{ formatIDR(order.total_price) }}</p>

                                        <BButton variant="outline-primary" @click="viewOrderDetails(order)"
                                            class="w-100 fw-semibold">
                                            View Details
                                        </BButton>
                                    </BCardBody>
                                </BCard>
                            </BCol>
                        </BRow>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </Layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Layout from "@/layouts/main";
import PageHeader from "@/components/page-header";
import { useOrderStore } from "@/state/pinia";
import { useProgress } from "@/helpers/progress";
import { showSuccessToast, showErrorToast } from "@/helpers/alert.js";
import { useRouter } from "vue-router";

const { startProgress, finishProgress, failProgress } = useProgress();
const orderStore = useOrderStore();
const router = useRouter();

const orders = ref([]);
const filteredOrders = ref([]);
const selectedStatuses = ref([]);

const orderStatuses = ref([
    { label: "Pending", value: "pending" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
]);

const formatIDR = (value) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

const getOrders = async () => {
    startProgress();
    try {
        await orderStore.fetchOrders();
        orders.value = orderStore.orders || [];
        filteredOrders.value = [...orders.value];
        finishProgress();
    } catch (error) {
        failProgress();
        showErrorToast("Failed to fetch orders.");
    }
};

const applyFilters = () => {
    startProgress();
    filteredOrders.value = orders.value.filter(order =>
        selectedStatuses.value.length === 0 || selectedStatuses.value.includes(order.status)
    );
    showSuccessToast("Filters applied successfully.");
    finishProgress();
};

const resetFilters = () => {
    selectedStatuses.value = [];
    filteredOrders.value = [...orders.value];
    showSuccessToast("Filters reset successfully.");
};

const viewOrderDetails = (order) => {
    // alert("Order ID: " + order.id);
    router.push({ name: "my-order-detail", params: { id: order.id } });
};

onMounted(getOrders);
</script>

<style scoped>
.order-card {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    background-color: #fff;
    border-radius: 12px;
    overflow: hidden;
}

.order-card:hover {
    transform: translateY(-5px);
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15);
}

.hover-underline {
    transition: color 0.2s ease-in-out, text-decoration 0.2s ease-in-out;
}

.hover-underline:hover {
    color: #0a58ca !important;
    text-decoration: underline !important;
}
</style>
