<template>
    <Layout>
        <PageHeader title="Order Details" pageTitle="Orders" />

        <BRow class="gx-4 gy-4">
            <BCol lg="9">
                <BCard class="shadow-sm border-0 rounded-3 bg-white p-4">
                    <BCardBody>
                        <a href="#" class="d-inline-block mb-3 fw-bold hover-underline"
                            @click.prevent="$router.push('/orders')">
                            ← Back to Orders
                        </a>

                        <h5 class="fw-bold">Order #{{ order?.id }}</h5>
                        <p class="text-muted">Status: <span class="fw-bold">{{ order?.status }}</span></p>
                        <p class="text-muted">Date: {{ formatDate(order?.created_at) }}</p>

                        <h6 class="fw-bold mt-4">Shipping Address</h6>
                        <p class="text-muted">John Doe, 123 Main St, Jakarta, Indonesia</p>

                        <h6 class="fw-bold mt-4">Payment Method</h6>
                        <p class="text-muted">Bank Transfer - BCA 123-456-7890</p>

                        <h6 class="fw-bold mt-4">Order Items</h6>
                        <BRow class="g-3">
                            <BCol v-for="item in order?.details" :key="item.id" xs="12">
                                <BCard class="border rounded-3 p-3">
                                    <BCardBody class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 class="fw-bold">{{ item.product_name }}</h6>
                                            <p class="text-muted mb-0">Quantity: {{ item.quantity }}</p>
                                        </div>
                                        <p class="fw-bold">RP. {{ formatIDR(item.total) }}</p>
                                    </BCardBody>
                                </BCard>
                            </BCol>
                        </BRow>

                        <h5 class="fw-bold mt-4">Total Price: RP. {{ formatIDR(order?.total_price) }}</h5>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </Layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useOrderStore } from "@/state/pinia";
import Layout from "@/layouts/main";
import PageHeader from "@/components/page-header";

const orderStore = useOrderStore();
const route = useRoute();
const order = ref(null);

const formatIDR = (value) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
};

const getOrderDetails = async () => {
    await orderStore.fetchOrderById(route.params.id);
    order.value = orderStore.orders[0] || null;
};

onMounted(getOrderDetails);
</script>

<style scoped>
.hover-underline {
    transition: color 0.2s ease-in-out, text-decoration 0.2s ease-in-out;
}

.hover-underline:hover {
    color: #0a58ca !important;
    text-decoration: underline !important;
}
</style>
