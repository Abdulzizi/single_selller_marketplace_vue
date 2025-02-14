<template>
    <Layout>
        <PageHeader title="Your Basket" pageTitle="Cart" />

        <BContainer class="my-4">

            <h4 class="mb-4 fw-bold">🛒 Cart Items ({{ cartItems.length }})</h4>

            <BRow>
                <!-- Left Side - Cart Items -->
                <BCol lg="8">
                    <BCard class="mb-3 shadow-sm border-0 rounded-3" v-for="(item, index) in cartItems" :key="index">
                        <BCardBody class="d-flex align-items-center">
                            <!-- Product Image -->
                            <BImg :src="getProductImage(item)" alt="Product Image" class="me-3 rounded-3 shadow-sm"
                                style="width: 90px; height: 90px; object-fit: cover;" />

                            <!-- Product Details -->
                            <div class="flex-grow-1">
                                <h5 class="fw-bold mb-1">{{ getProductName(item) }}</h5>
                                <p class="text-muted small mb-1">Category: {{ getProductCategory(item) }}</p>
                                <p class="mb-1 text-primary">
                                    Price: <strong>RP.{{ effectivePrice(item).toLocaleString() }}</strong>
                                </p>

                                <!-- Add-on Details -->
                                <div v-if="item.product_detail" class="mt-2">
                                    <span class="badge bg-success text-white p-2">
                                        + Add-on: {{ item.product_detail.type }} (+RP.{{
                                            item.product_detail.price.toLocaleString() }})
                                    </span>
                                </div>
                            </div>

                            <!-- Quantity Controls -->
                            <div class="d-flex align-items-center">
                                <BButton variant="outline-danger" size="sm" class="rounded px-2 py-1"
                                    @click="updateQuantity(item, item.quantity - 1)">
                                    -
                                </BButton>
                                <span class="mx-3 fw-bold fs-5">{{ item.quantity }}</span>
                                <BButton variant="outline-success" size="sm" class="rounded px-2 py-1"
                                    @click="updateQuantity(item, item.quantity + 1)">
                                    +
                                </BButton>
                            </div>

                            <!-- Remove Button -->
                            <BButton variant="danger" size="sm" class="ms-3 rounded px-3 py-1 shadow-sm"
                                @click="removeFromCart(item.id)">
                                X
                            </BButton>
                        </BCardBody>
                    </BCard>
                </BCol>

                <!-- Right Side - Order Summary -->
                <BCol lg="4">
                    <BCard class="shadow-sm border-0 rounded-3">
                        <BCardBody>
                            <h5 class="fw-bold mb-3">📦 Order Summary</h5>

                            <div class="d-flex justify-content-between mb-2">
                                <span>Subtotal:</span>
                                <strong>RP.{{ totalPrice.toLocaleString() }}</strong>
                            </div>

                            <div class="d-flex justify-content-between mb-2">
                                <span>Delivery Fee:</span>
                                <strong>RP.{{ deliveryFee.toLocaleString() }}</strong>
                            </div>

                            <hr>

                            <div class="d-flex justify-content-between mb-3">
                                <span class="fw-bold">Total:</span>
                                <strong class="text-success fs-5">RP.{{ grandTotal.toLocaleString() }}</strong>
                            </div>

                            <div class="d-flex flex-column justify-content-end mt-3">
                                <BButton variant="success" class="me-2 py-2 fs-6 shadow-sm" @click="navigateToCheckout">
                                    ✅ Proceed to Checkout
                                </BButton>
                                <BButton variant="link" class="text-muted align-self-end" @click="navigateToProducts">
                                    ← Continue Shopping
                                </BButton>
                            </div>

                        </BCardBody>
                    </BCard>
                </BCol>
            </BRow>
        </BContainer>
    </Layout>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { useCartStore } from "@/state/pinia";
import Layout from "@/layouts/main";
import PageHeader from "@/components/page-header";
import { useProgress } from "@/helpers/progress";
import { showErrorToast, showSuccessToast } from "@/helpers/alert.js";

const { startProgress, finishProgress, failProgress } = useProgress();
const cartStore = useCartStore();
const cartItems = ref([]);
const router = useRouter();

const getCarts = async () => {
    try {
        startProgress();
        await cartStore.fetchCartItems();
        cartItems.value = [...cartStore.cartItems];

        console.log("Cart items:", cartItems.value);
        showSuccessToast("Cart items fetched successfully!");
        finishProgress();
    } catch (error) {
        showErrorToast("Cannot get carts");
        console.error("Error fetching cart:", error);
        cartItems.value = [];
        failProgress();
    }
};

// method utility: buat ambil data nested (menghindari error)
const getProductName = (item) => item?.product?.name || "No Name";
const getProductCategory = (item) => item?.product?.product_category_name || "N/A";
const getProductImage = (item) => item?.product?.photo_desktop_url || "https://via.placeholder.com/150";

const effectivePrice = (item) => {
    const basePrice = item.product?.price ?? 0;
    const addonPrice = item.product_detail?.price ?? 0;
    return basePrice + addonPrice;
};

const removeFromCart = async (cartItemId) => {
    await cartStore.removeCartItem(cartItemId);

    showSuccessToast("Item removed from cart successfully!");
    getCarts();
};

const updateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;

    const payload = {
        id: item.id,
        product_id: item.product_id,
        quantity: newQuantity
    };

    await cartStore.updateCartItem(payload);
    getCarts();
};

const totalPrice = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + effectivePrice(item) * item.quantity, 0);
});

const navigateToProducts = () => {
    // window.location.href = "/products";
    router.push("/products");
}

const navigateToCheckout = () => {
    // alert("Checkout not implemented yet");
    // window.location.href = "/checkout";
    router.push("/checkout");
};

const deliveryFee = computed(() => (cartItems.value.length > 0 ? 15000 : 0));
const grandTotal = computed(() => totalPrice.value + deliveryFee.value);

onMounted(getCarts);
</script>
