<template>
    <Layout>
        <PageHeader title="Orders" pageTitle="Admin Orders" />
        <BRow>
            <BCol lg="12">
                <BCard no-body>
                    <BCardBody class="border-bottom">
                        <div class="d-flex align-items-center">
                            <BCardTitle class="mb-0 flex-grow-1">Order List</BCardTitle>
                            <div class="flex-shrink-0">
                                <BLink href="#!" class="btn btn-light me-1" @click="getOrders"><i
                                        class="mdi mdi-refresh"></i></BLink>
                            </div>
                        </div>
                    </BCardBody>

                    <BCardBody class="border-bottom">
                        <BRow class="g-3">
                            <BCol xxl="10" lg="8">
                                <BFormInput type="text" class="form-control search" placeholder="Search by User Name..."
                                    v-model="orderStore.searchQuery" @keydown.enter="searchData" />
                            </BCol>
                            <BCol xxl="2" lg="4">
                                <BButton variant="soft-secondary" @click="searchData" class="w-100">
                                    <i class="mdi mdi-magnify align-middle"></i>
                                    Search
                                </BButton>
                            </BCol>
                        </BRow>
                    </BCardBody>

                    <BCardBody>
                        <div class="table-responsive">
                            <BTableSimple class="align-middle dt-responsive nowrap w-100 table-check" id="order-list">
                                <BThead>
                                    <BTr>
                                        <!-- <BTh scope="col">Order ID</BTh> -->
                                        <BTh scope="col">User</BTh>
                                        <BTh scope="col">Total Price</BTh>
                                        <BTh scope="col">Status</BTh>
                                        <BTh scope="col">Created At</BTh>
                                        <BTh scope="col">Details</BTh>
                                        <BTh scope="col">Actions</BTh>
                                    </BTr>
                                </BThead>
                                <BTbody>
                                    <BTr v-for="order in orders" :key="order.id">
                                        <!-- <BTd>{{ order.id }}</BTd> -->
                                        <BTd>{{ order.user_name }}</BTd>
                                        <BTd>{{ formatPrice(order.total_price) }}</BTd>
                                        <BTd>
                                            <BBadge :variant="statusVariant(order.status)">
                                                {{ order.status }}
                                            </BBadge>
                                        </BTd>
                                        <BTd>{{ formatDate(order.created_at) }}</BTd>
                                        <BTd>
                                            <ul class="list-unstyled">
                                                <li v-if="order.details.length === 0">No details</li>
                                                <li v-for="detail in order.details" :key="detail.id">
                                                    {{ detail.product_name }} (x{{ detail.quantity }}) - {{
                                                        formatPrice(detail.total) }}
                                                </li>
                                            </ul>
                                        </BTd>

                                        <BTd class="text-center">
                                            <ul class="list-unstyled hstack gap-1 mb-0 justify-content-start">
                                                <li v-if="nextStatusMap[order.status]" data-bs-toggle="tooltip"
                                                    data-bs-placement="top"
                                                    :aria-label="`Move to ${nextStatusMap[order.status]}`"
                                                    @click="updateStatus({ ...order, user_id: order.user_id })">
                                                    <BButton variant="info" class="btn-sm">
                                                        <i class="mdi mdi-arrow-right"></i>
                                                    </BButton>
                                                </li>
                                                <li v-if="order.status !== 'completed'" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" aria-label="Cancel Order"
                                                    @click="updateStatus({ id: order.id, user_id: order.user_id, status: 'cancelled' })">
                                                    <BButton variant="danger" class="btn-sm">
                                                        <i class="mdi mdi-cancel"></i>
                                                    </BButton>
                                                </li>
                                            </ul>
                                        </BTd>

                                    </BTr>
                                </BTbody>
                            </BTableSimple>
                        </div>
                        <Pagination :currentPage="orderStore.current" :totalRows="orderStore.totalData"
                            :perPage="orderStore.perPage" @update:currentPage="updatePage" />
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </Layout>
</template>

<script setup>
import Layout from "@/layouts/main";
import PageHeader from "@/components/page-header";
import Pagination from "@/components/widgets/pagination";
import { useOrderStore } from "@/state/pinia";
import { onMounted, ref } from "vue";
import { useProgress } from "@/helpers/progress";
import { showSuccessToast, showErrorToast, showConfirmationDialog } from "@/helpers/alert.js";

const orderStore = useOrderStore();
const { startProgress, finishProgress, failProgress } = useProgress();
const orders = ref([]);

const nextStatusMap = {
    pending: "processing",
    processing: "shipped",
    shipped: "completed",
};


const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(price);
};

const formatDate = (date) => {
    return new Date(date).toLocaleString();
};

const statusVariant = (status) => {
    switch (status) {
        case 'pending': return 'warning';
        case 'completed': return 'success';
        case 'cancelled': return 'danger';
        case 'processing': return 'primary';
        case 'shipped': return 'info';
        default: return 'secondary';
    }
};

const getOrders = async () => {
    startProgress();
    try {
        await orderStore.fetchOrders();
        if (orderStore.orders) {
            orders.value = orderStore.orders;
            finishProgress();
        }
    } catch (error) {
        failProgress();
        orders.value = [];
    }
};

const updateStatus = async (order) => {
    if (!order.id || !order.user_id) {
        showErrorToast("Invalid order data.");
        return;
    }

    const nextStatus = nextStatusMap[order.status] || null;
    if (!nextStatus) {
        showErrorToast("No further status update possible.");
        return;
    }

    const confirm = await showConfirmationDialog(
        "Update Order?",
        `Move order from "${order.status}" to "${nextStatus}"?`,
        "Yes, update it!"
    );

    if (!confirm) return;

    startProgress();
    try {
        const payload = {
            id: order.id,
            user_id: order.user_id,
            status: nextStatus,
        };

        await orderStore.updateOrder(payload);
        showSuccessToast(`Order status updated to ${nextStatus}`);
        await getOrders();
    } catch (error) {
        console.error("Error updating order:", error);
        showErrorToast("Failed to update order.");
    } finally {
        finishProgress();
    }
};

const updatePage = async (page) => {
    await orderStore.changePage(page);
    await getOrders();
};

const searchData = async () => {
    await orderStore.changePage(1);
    await getOrders();
};

onMounted(async () => {
    await getOrders();
});
</script>
