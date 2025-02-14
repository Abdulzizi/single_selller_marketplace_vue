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
                                <img :src="item.image" alt="Product" class="rounded me-3 order-summary-image" width="60"
                                    height="60" />
                                <div class="flex-grow-1">
                                    <h6 class="fw-bold mb-1">{{ item.name }}</h6>
                                    <p class="text-muted small mb-0">{{ item.category }}</p>
                                </div>
                                <span class="fw-bold">RP.{{ item.price.toLocaleString() }}</span>
                            </div>
                            <div class="d-flex justify-content-between mt-3 border-top pt-3">
                                <span>Subtotal:</span>
                                <span class="fw-bold">RP.{{ subtotal.toLocaleString() }}</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span>Tax (10%):</span>
                                <span class="fw-bold">RP.{{ tax.toLocaleString() }}</span>
                            </div>
                            <div class="d-flex justify-content-between border-top pt-3 mt-3">
                                <span class="fw-bold">Total:</span>
                                <span class="fw-bold text-danger">RP.{{ total.toLocaleString() }}</span>
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
import { ref, computed } from "vue";
import Layout from "@/layouts/main";
import PageHeader from "@/components/page-header";

const cartItems = ref([
    { id: 1, name: "Gaming Mouse", category: "Accessories", price: 250000, image: "https://via.placeholder.com/80" },
    { id: 2, name: "Mechanical Keyboard", category: "Accessories", price: 600000, image: "https://via.placeholder.com/80" },
]);

const formModel = ref({
    address: "",
    city: "",
    postcode: "",
    paymentMethod: ""
});

const subtotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.price, 0));
const tax = computed(() => subtotal.value * 0.1);
const total = computed(() => subtotal.value + tax.value);

const checkout = () => {
    alert(`Proceeding with payment method: ${formModel.value.paymentMethod}`);
};
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
