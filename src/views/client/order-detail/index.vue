<template>
    <Layout>
        <PageHeader title="Order Details" pageTitle="Orders" />

        <BRow class="gx-4 gy-4">
            <BCol lg="9">
                <BCard v-if="order" class="shadow-sm border-0 rounded-3 bg-white p-4">
                    <a href="#" class="d-inline-block mb-3 fw-bold hover-underline"
                        @click.prevent="$router.push({ name: 'my-orders' })">
                        ← Back to Orders
                    </a>

                    <h5 class="fw-bold text-primary">{{ generateInvoiceId(order) }}</h5>
                    <p class="text-muted">
                        Status:
                        <span :class="getStatusClass(order?.status)">
                            {{ order?.status || '-' }}
                        </span>
                    </p>
                    <p class="text-muted">Date: {{ formatDate(order?.created_at) }}</p>

                    <h6 class="fw-bold mt-4">Shipping Address</h6>
                    <p class="text-muted">{{ formattedAddress }}</p>


                    <h6 class="fw-bold mt-4">Payment Method</h6>
                    <p class="text-muted">{{ formatPaymentMethod(order?.payment_method) }}</p>

                    <h6 class="fw-bold mt-4">Order Items</h6>
                    <div class="table-responsive">
                        <table class="table table-bordered border-2 table-hover">
                            <thead class="bg-dark text-white">
                                <tr>
                                    <th>#</th>
                                    <th>Product Name</th>
                                    <th class="text-center">Quantity</th>
                                    <th class="text-end">Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in order?.details" :key="item.id">
                                    <td class="text-center">{{ index + 1 }}</td>
                                    <td>{{ item.product_name }}</td>
                                    <td class="text-center">{{ item.quantity }}</td>
                                    <td class="text-end">{{ formatIDR(item.total) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="invoice-summary mt-4 p-3 shadow-sm border-2 rounded">
                        <p><strong>Subtotal:</strong> {{ order?.subtotal ? formatIDR(order.subtotal) : '-' }}</p>
                        <p><strong>Tax (10%):</strong> {{ order?.tax ? formatIDR(order.tax) : '-' }}</p>
                        <p><strong>Shipping:</strong> {{ order?.shipping_fee ? formatIDR(order.shipping_fee) : '-' }}
                        </p>
                        <h5 class="fw-bold mt-3 text-success">Total: {{ order?.total_price ?
                            formatIDR(order.total_price) : '-' }}
                        </h5>
                    </div>


                    <div class="invoice-footer text-muted text-center mt-5">
                        <p>Thank you for your order!</p>
                        <p>For support, contact us at support@skote.com</p>
                    </div>

                </BCard>

                <BCard v-else class="shadow-sm border-0 rounded-3 bg-white p-4 text-center">
                    <h5 class="fw-bold">Order Not Found</h5>
                    <p class="text-muted">We couldn't find your order. Please check again later.</p>
                </BCard>
            </BCol>
        </BRow>
    </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
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
        minimumFractionDigits: 0
    }).format(value);
};

// 🔹 Hardcoded values
// const subtotal = 500000;
// const tax = subtotal * 0.1;
// const shipping_fee = 20000;

const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric', month: 'long', day: 'numeric'
    }) : '-';
};

const generateInvoiceId = (order) => {
    return `INV-${String(order.id).slice(0, 8)}`;
};

const formattedAddress = computed(() => {
    if (!order.value) return "-";
    const { street, apartment, city, postcode, country } = order.value;
    return [street, apartment, city, postcode, country]
        .filter(Boolean) // Removes empty/null values
        .join(", ") || "-";
});

const formatPaymentMethod = (method) => {
    if (!method) return "-";
    return method
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ") || "-";
};

const getOrderDetails = async () => {
    await orderStore.fetchOrderById(route.params.id);
    order.value = orderStore.orders?.[0] ?? null;
    // console.log("Fetched Order:", order.value);
};

const getStatusClass = (status) => {
    switch (status) {
        case "Pending":
            return "badge bg-warning text-dark";
        case "Shipped":
            return "badge bg-info";
        case "Delivered":
            return "badge bg-success";
        case "Cancelled":
            return "badge bg-danger";
        default:
            return "badge bg-secondary";
    }
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
