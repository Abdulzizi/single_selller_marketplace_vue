<template>
    <Layout>
        <PageHeader title="Checkout" pageTitle="Your Cart" />

        <div class="container py-5">
            <div class="row g-4">
                <!-- Delivery & Payment Form -->
                <div class="col-lg-8">
                    <div class="card delivery-payment-card shadow-sm border-0 rounded-4 mb-4 p-4">
                        <div class="card-body">
                            <h5 class="mb-4 fw-bold text-primary">Delivery Information</h5>
                            <BForm>
                                <BRow class="mb-3">
                                    <label class="col-md-3 col-form-label fw-semibold"
                                        for="form-address">Address</label>
                                    <BCol md="9">
                                        <input class="form-control" id="form-address" placeholder="Enter your address"
                                            v-model="formModel.address" />
                                    </BCol>
                                </BRow>
                                <BRow class="mb-3">
                                    <label class="col-md-3 col-form-label fw-semibold" for="form-city">City</label>
                                    <BCol md="9">
                                        <input class="form-control" id="form-city" placeholder="Enter your city"
                                            v-model="formModel.city" />
                                    </BCol>
                                </BRow>
                                <BRow class="mb-3">
                                    <label class="col-md-3 col-form-label fw-semibold"
                                        for="form-postcode">Postcode</label>
                                    <BCol md="9">
                                        <input class="form-control" id="form-postcode" placeholder="Enter your postcode"
                                            v-model="formModel.postcode" />
                                    </BCol>
                                </BRow>
                            </BForm>
                        </div>
                    </div>

                    <div class="card delivery-payment-card shadow-sm border-0 rounded-4 p-4">
                        <div class="card-body">
                            <h5 class="mb-4 fw-bold text-primary">Payment Method</h5>
                            <BForm>
                                <BRow>
                                    <BCol md="12">
                                        <BFormRadio v-model="formModel.paymentMethod" value="Credit Card">Credit Card
                                        </BFormRadio>
                                        <BFormRadio v-model="formModel.paymentMethod" value="Bank Transfer">Bank
                                            Transfer</BFormRadio>
                                        <BFormRadio v-model="formModel.paymentMethod" value="E-Wallet">E-Wallet
                                        </BFormRadio>
                                    </BCol>
                                </BRow>
                            </BForm>
                        </div>
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="col-lg-4">
                    <div class="card shadow-lg border-0 rounded-4 p-4">
                        <div class="card-body">
                            <h5 class="mb-4 fw-bold text-success">Order Summary</h5>
                            <div v-for="item in cartItems" :key="item.id" class="d-flex align-items-center mb-3">
                                <img :src="item.product.photo_desktop_url" alt="Product"
                                    class="rounded me-3 order-summary-image" width="60" height="60" />
                                <div class="flex-grow-1">
                                    <h6 class="fw-bold mb-1">{{ item.product.name }}</h6>
                                    <p class="text-muted small mb-0">{{ item.product.product_category_name }}</p>
                                </div>
                                <span class="fw-bold">{{
                                    formatIDR(item.product.price * item.quantity)
                                    }}</span>
                            </div>
                            <div class="d-flex justify-content-between mt-3 border-top pt-3">
                                <span>Subtotal:</span>
                                <span class="fw-bold">{{ formatIDR(subtotal) }}</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span>Tax (12%):</span>
                                <span class="fw-bold">{{ formatIDR(tax) }}</span>
                            </div>
                            <div class="d-flex justify-content-between border-top pt-3 mt-3">
                                <span class="fw-bold">Total:</span>
                                <span class="fw-bold text-danger">{{ formatIDR(total) }}</span>
                            </div>
                            <BButton variant="success" class="mt-4 w-100 fw-bold py-2 checkout-btn" @click="checkout">
                                Confirm & Pay
                            </BButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Layout from "@/layouts/main";
import PageHeader from "@/components/page-header";
import { useRouter } from "vue-router";

const router = useRouter();

import { useOrderStore, useCartStore } from "@/state/pinia";
import { useProgress } from "@/helpers/progress";
import { showErrorToast, showSuccessToast } from "@/helpers/alert.js";

const { startProgress, finishProgress, failProgress } = useProgress();

const cartItems = ref([]);
const orderStore = useOrderStore();
const cartStore = useCartStore();

const getCartItemsFromLocalStorage = () => {
    const localStorageCartItems = localStorage.getItem("cartItems");
    if (localStorageCartItems) {
        cartItems.value = JSON.parse(localStorageCartItems);
        // console.log("Cart items:", cartItems.value);
    }
};

const formModel = ref({
    address: "",
    city: "",
    postcode: "",
    paymentMethod: ""
});

const subtotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.product.price, 0));
const tax = computed(() => subtotal.value * 0.12);
const total = computed(() => subtotal.value + tax.value);
const formatIDR = (number) => IDRFormatter.format(number);

const IDRFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});

// Prepare payload
const orderPayload = computed(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
        console.error("User ID not found");
        return null;
    }

    if (!cartItems.value.length) {
        console.error("Cart is empty");
        return null;
    }

    return {
        user_id: user.id,
        product_detail_id: cartItems.value[0].product.product_detail_id || null,
        details: cartItems.value.map(item => {
            return {
                product_id: item.product.id,
                quantity: item.quantity,
                is_added: true
            };
        })
    };
});

const checkout = async () => {
    if (!formModel.value.paymentMethod) {
        showErrorToast("Please select a payment method.");
        return;
    }

    const payload = orderPayload.value;
    if (!payload) {
        showErrorToast("Failed to create order payload.");
        return;
    }

    console.log("Checkout Payload:", JSON.stringify(payload, null, 2));

    try {
        startProgress();
        await orderStore.addOrder(payload);

        if (orderStore.response.status === 200 || orderStore.response.status === 201) {
            await cartStore.clearCart();

            finishProgress();
            showSuccessToast("Order placed successfully!");

            router.push("/checkout-success");
        } else {
            failProgress();
            showErrorToast("Failed to place order: " + orderStore.response.message);
        }
    } catch (error) {
        failProgress();
        console.error("Checkout error:", error);
        showErrorToast("An error occurred during checkout.");
    }
};

onMounted(() => {
    getCartItemsFromLocalStorage();
});
</script>

<style scoped>
.delivery-payment-card {
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.delivery-payment-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.checkout-btn {
    background: linear-gradient(45deg, #28a745, #218838);
    border: none;
    transition: all 0.3s ease;
}

.checkout-btn:hover {
    background: linear-gradient(45deg, #218838, #1e7e34);
    transform: translateY(-2px);
}

.order-summary-image {
    transition: transform 0.3s ease-in-out;
}

.order-summary-image:hover {
    transform: scale(1.1);
}
</style>
