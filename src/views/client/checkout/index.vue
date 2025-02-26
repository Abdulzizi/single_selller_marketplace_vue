<template>
    <Layout>
        <PageHeader title="Checkout" pageTitle="Your Cart" />

        <BRow class="g-4">
            <!-- Delivery & Payment Form -->
            <BCol lg="8">
                <BCard class="shadow-sm border-0 rounded-4 mb-4 p-4">
                    <BCardBody>
                        <h5 class="mb-4 fw-bold text-primary">Delivery Information</h5>
                        <BForm>
                            <BRow class="mb-3">
                                <BCol md="3" class="fw-semibold">Full Name</BCol>
                                <BCol md="9">
                                    <BFormInput id="form-name" v-model="formModel.fullName"
                                        placeholder="Enter your full name" />
                                </BCol>
                            </BRow>
                            <BRow class="mb-3">
                                <BCol md="3" class="fw-semibold">Street Address</BCol>
                                <BCol md="9">
                                    <BFormInput id="form-street" v-model="formModel.street"
                                        placeholder="Enter your street address" />
                                </BCol>
                            </BRow>
                            <BRow class="mb-3">
                                <BCol md="3" class="fw-semibold">Apartment/Unit</BCol>
                                <BCol md="9">
                                    <BFormInput id="form-apartment" v-model="formModel.apartment"
                                        placeholder="Apartment, suite, unit, etc. (optional)" />
                                </BCol>
                            </BRow>
                            <BRow class="mb-3">
                                <BCol md="3" class="fw-semibold">City</BCol>
                                <BCol md="9">
                                    <BFormInput id="form-city" v-model="formModel.city" placeholder="Enter your city" />
                                </BCol>
                            </BRow>
                            <BRow class="mb-3">
                                <BCol md="3" class="fw-semibold">Postcode</BCol>
                                <BCol md="9">
                                    <BFormInput id="form-postcode" v-model="formModel.postcode"
                                        placeholder="Enter your postcode" />
                                </BCol>
                            </BRow>
                            <BRow class="mb-3">
                                <BCol md="3" class="fw-semibold">Country</BCol>
                                <BCol md="9">
                                    <BFormInput id="form-postcode" v-model="formModel.country"
                                        placeholder="Enter your country" />
                                </BCol>

                                <!-- <BCol md="9">
                                    <BFormSelect id="form-country" v-model="formModel.country"
                                        :options="countryOptions" />
                                </BCol> -->
                            </BRow>
                        </BForm>
                    </BCardBody>
                </BCard>

                <BCard class="shadow-sm border-0 rounded-4 p-4">
                    <BCardBody>
                        <h5 class="mb-4 fw-bold text-primary">Payment Method</h5>
                        <BForm>
                            <BFormRadioGroup v-model="formModel.paymentMethod">
                                <BFormRadio value="Credit Card">Credit Card</BFormRadio>
                                <BFormRadio value="Bank Transfer">Bank Transfer</BFormRadio>
                                <BFormRadio value="E-Wallet">E-Wallet</BFormRadio>
                            </BFormRadioGroup>

                            <div v-if="formModel.paymentMethod === 'Credit Card'" class="mt-3">
                                <BFormInput id="card-number" v-model="formModel.cardNumber" placeholder="Card Number" />
                                <BRow class="mt-3">
                                    <BCol md="6">
                                        <BFormInput id="card-expiry" v-model="formModel.cardExpiry"
                                            placeholder="MM/YY" />
                                    </BCol>
                                    <BCol md="6">
                                        <BFormInput id="card-cvv" v-model="formModel.cardCVV" placeholder="CVV" />
                                    </BCol>
                                </BRow>
                            </div>

                            <div v-if="formModel.paymentMethod === 'Bank Transfer'" class="mt-3">
                                <BFormInput id="bank-name" v-model="formModel.bankName" placeholder="Bank Name" />
                                <BFormInput id="account-number" class="mt-3" v-model="formModel.accountNumber"
                                    placeholder="Account Number" />
                            </div>
                        </BForm>
                    </BCardBody>
                </BCard>
            </BCol>

            <!-- Order Summary -->
            <BCol lg="4">
                <BCard class="shadow-sm border-0 rounded-4 p-4">
                    <h5 class="mb-4 fw-bold text-success">Order Summary</h5>
                    <div v-for="item in cartItems" :key="item.id" class="d-flex align-items-center mb-3">
                        <BImg :src="item.product.photo_desktop_url" alt="Product" class="rounded me-3" width="60"
                            height="60" />
                        <div class="flex-grow-1">
                            <h6 class="fw-bold mb-1">{{ item.product.name }}</h6>
                            <p class="text-muted small mb-0">{{ item.product.product_category_name }}</p>
                        </div>
                        <span class="fw-bold">{{ formatIDR(item.product.price * item.quantity) }}</span>
                    </div>
                    <BCol class="mt-3 border-top pt-3">
                        <BCol class="d-flex justify-content-between"><span>Subtotal:</span><span class="fw-bold">{{
                            formatIDR(subtotal) }}</span></BCol>
                        <BCol class="d-flex justify-content-between"><span>Tax (12%):</span><span class="fw-bold">{{
                            formatIDR(tax) }}</span></BCol>
                        <BCol class="d-flex justify-content-between border-top pt-3 mt-3"><span
                                class="fw-bold">Total:</span><span class="fw-bold text-danger">{{ formatIDR(total)
                                }}</span></BCol>
                    </BCol>
                    <BButton variant="success" class="mt-4 w-100 fw-bold py-2" @click="checkout"
                        :disabled="!cartItems.length || !formModel.paymentMethod">
                        Confirm & Pay
                    </BButton>

                </BCard>
            </BCol>
        </BRow>
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
import { showErrorToast, showSuccessToast, showConfirmationDialog } from "@/helpers/alert.js";

const { startProgress, finishProgress, failProgress } = useProgress();

const cartItems = ref([]);
const orderStore = useOrderStore();
const cartStore = useCartStore();

const getCartItemsFromLocalStorage = () => {
    const localStorageCartItems = localStorage.getItem("cartItems");
    cartItems.value = localStorageCartItems ? JSON.parse(localStorageCartItems) : [];
};


const formModel = ref({
    fullName: "",
    street: "",
    apartment: "",
    city: "",
    postcode: "",
    country: "",
    paymentMethod: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: ""
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
        product_detail_id: cartItems.value.length > 0 ? cartItems.value[0].product.product_detail_id : null,
        delivery_details: {
            full_name: formModel.value.fullName,
            street: formModel.value.street,
            apartment: formModel.value.apartment,
            city: formModel.value.city,
            postcode: formModel.value.postcode,
            country: formModel.value.country,
        },
        payment_method: formModel.value.paymentMethod,
        payment_details: formModel.value.paymentMethod === "Credit Card"
            ? {
                card_number: formModel.value.cardNumber,
                card_expiry: formModel.value.cardExpiry,
                card_cvv: formModel.value.cardCVV,
            }
            : formModel.value.paymentMethod === "Bank Transfer"
                ? {
                    bank_name: formModel.value.bankName,
                    account_number: formModel.value.accountNumber,
                }
                : {},
        details: cartItems.value.map(item => ({
            product_id: item.product.id,
            product_detail_id: item.product.product_detail_id,
            quantity: item.quantity,
            total_price: item.product.price * item.quantity,
        })),
        total_price: total.value,
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

    const confirmed = await showConfirmationDialog(
        "Confirm Order",
        "Are you sure you want to place this order?",
        "Yes, Order it!"
    );
    if (!confirmed) {
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
