<template>
    <Layout>
        <PageHeader title="My Orders" pageTitle="Orders" />

        <BRow class="gx-4 gy-4">
            <BCol lg="12">
                <BCard class="shadow-sm border-0 rounded-3 bg-white p-4">
                    <BCardBody>
                        <a href="#" class="d-inline-block mb-3 fw-bold hover-underline"
                            @click.prevent="$router.push({ name: 'products' })">
                            ← Back to Marketplace
                        </a>

                        <BRow class="g-4">
                            <BCol v-if="filteredOrders.length === 0" class="text-center py-5">
                                <h4 class="text-muted">No Orders Found</h4>
                                <p>Try placing an order.</p>
                            </BCol>

                            <BCol v-for="order in filteredOrders" :key="order.id" cols="12" class="d-flex">
                                <BCard class="border-2 rounded-3 overflow-hidden order-card p-3 w-100">
                                    <BCardBody class="d-flex flex-column">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <h6 class="fw-bold">Order #{{ order.id }}</h6>
                                            <span class="badge" :class="statusBadge(order.status)">{{ order.status
                                            }}</span>
                                        </div>
                                        <p class="text-muted">{{ formatDate(order.created_at) }}</p>

                                        <div class="order-details">
                                            <p class="fw-bold">Total: {{ formatIDR(order.total_price) }}</p>
                                            <p v-if="order.payment_method" class="text-muted small">Paid via: {{
                                                order.payment_method }}</p>
                                            <p v-if="order.street" class="text-muted small">Delivery: {{ order.street
                                            }}, {{ order.city }}</p>
                                        </div>

                                        <ul v-if="order.details.length" class="list-unstyled small">
                                            <li v-for="item in order.details" :key="item.id" class="text-muted">
                                                {{ item.quantity }}x {{ item.product_name }} ({{ formatIDR(item.price)
                                                }})
                                            </li>
                                        </ul>

                                        <BButton variant="outline-primary" @click="viewOrderDetails(order)"
                                            class="w-100 fw-semibold mt-2">
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
import { showErrorToast } from "@/helpers/alert.js";
import { useRouter } from "vue-router";

const { startProgress, finishProgress, failProgress } = useProgress();
const orderStore = useOrderStore();
const router = useRouter();

const orders = ref([]);
const filteredOrders = ref([]);

const formatIDR = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
};

const statusBadge = (status) => {
    const statusClasses = {
        pending: "bg-warning text-dark",
        processing: "bg-primary text-white",
        shipped: "bg-info text-dark",
        delivered: "bg-success text-white",
        cancelled: "bg-danger text-white"
    };
    return statusClasses[status] || "bg-secondary text-white";
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

const viewOrderDetails = (order) => {
    router.push({ name: "my-order-detail", params: { id: order.id } });
};

onMounted(getOrders);
</script>

<style scoped>
.hover-underline:hover {
    color: #0a58ca !important;
    text-decoration: underline !important;
}

.order-card {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    background-color: #fff;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.order-card:hover {
    transform: translateY(-3px);
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
}

.order-card .card-body {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.order-card .order-details {
    flex-grow: 1;
}

.order-card .btn {
    margin-top: auto;
    align-self: flex-end;
}
</style>
