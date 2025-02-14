<template>
    <Layout>
        <PageHeader title="Checkout" pageTitle="Your Cart" />

        <BRow>
            <!-- Cart Items -->
            <BCol lg="8">
                <BCard class="shadow-lg border-0 rounded-3">
                    <BCardBody>
                        <h5 class="mb-3 fw-bold">Shopping Cart</h5>

                        <div v-if="cartItems.length === 0" class="text-center py-5">
                            <h4 class="text-muted">Your cart is empty</h4>
                            <p>Start adding products to your cart.</p>
                        </div>

                        <div v-for="item in cartItems" :key="item.id"
                            class="d-flex align-items-center mb-3 border-bottom pb-3">
                            <img :src="item.image" alt="Product" class="rounded me-3" width="80" height="80" />
                            <div class="flex-grow-1">
                                <h6 class="fw-bold">{{ item.name }}</h6>
                                <p class="text-muted my-0">{{ item.category }}</p>
                                <p class="text-primary fw-bold">RP.{{ item.price.toLocaleString() }}</p>
                            </div>
                            <div>
                                <BButton variant="danger" @click="removeFromCart(item.id)" size="sm">Remove</BButton>
                            </div>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>

            <!-- Summary Section -->
            <BCol lg="4">
                <BCard class="shadow-lg border-0 rounded-3">
                    <BCardBody>
                        <h5 class="mb-3 fw-bold">Order Summary</h5>
                        <div class="d-flex justify-content-between">
                            <span>Subtotal:</span>
                            <span class="fw-bold">RP.{{ subtotal.toLocaleString() }}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>Tax (10%):</span>
                            <span class="fw-bold">RP.{{ tax.toLocaleString() }}</span>
                        </div>
                        <div class="d-flex justify-content-between border-top mt-2 pt-2">
                            <span class="fw-bold">Total:</span>
                            <span class="fw-bold text-primary">RP.{{ total.toLocaleString() }}</span>
                        </div>

                        <BButton variant="success" class="mt-3 w-100 fw-bold" @click="checkout">
                            Proceed to Checkout
                        </BButton>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </Layout>
</template>

<script setup>
import { ref, computed } from "vue";

const cartItems = ref([
    {
        id: 1,
        name: "Gaming Mouse",
        category: "Accessories",
        price: 250000,
        image: "https://via.placeholder.com/80",
    },
    {
        id: 2,
        name: "Mechanical Keyboard",
        category: "Accessories",
        price: 600000,
        image: "https://via.placeholder.com/80",
    },
]);

const subtotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.price, 0));
const tax = computed(() => subtotal.value * 0.1);
const total = computed(() => subtotal.value + tax.value);

const removeFromCart = (id) => {
    cartItems.value = cartItems.value.filter((item) => item.id !== id);
};

const checkout = () => {
    alert("Proceeding to checkout...");
};
</script>
