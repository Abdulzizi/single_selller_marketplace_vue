<template>
    <Layout>
        <PageHeader :title="product ? product.name : 'Product Not Found'" pageTitle="Product Details" />

        <BContainer>
            <BRow v-if="product">
                <!-- Product Image -->
                <BCol md="6">
                    <BCard>
                        <BCardImg :src="product.photo_desktop_url" :alt="product.name" top />
                    </BCard>
                </BCol>

                <!-- Product Details -->
                <BCol md="6">
                    <BCard>
                        <BCardBody>
                            <h3 class="mb-3">{{ product.name }}</h3>
                            <p class="text-muted">Category: <strong>{{ product.product_category_name }}</strong></p>
                            <h4 class="text-primary fw-bold">RP.{{ product.price.toLocaleString() }}</h4>
                            <p class="mb-4">{{ product.description }}</p>

                            <!-- Product Quantity Control -->
                            <div class="d-flex align-items-center mb-4">
                                <h5 class="me-3 fw-bold">Quantity:</h5>
                                <BButton variant="outline-danger" class="px-2 py-1" @click="decrementProductQuantity">
                                    -
                                </BButton>
                                <span class="mx-3 fw-bold">{{ productQuantity }}</span>
                                <BButton variant="outline-success" class="px-2 py-1" @click="incrementProductQuantity">
                                    +
                                </BButton>
                            </div>

                            <!-- Product Add-ons -->
                            <div v-if="product.details && product.details.length > 0" class="mt-4">
                                <h5 class="fw-bold">Available Add-ons:</h5>
                                <BListGroup>
                                    <BListGroupItem v-for="detail in product.details" :key="detail.id"
                                        class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{{ detail.type }}:</strong> {{ detail.description }}
                                            <span v-if="detail.price > 0" class="text-success"> (+RP.{{
                                                detail.price.toLocaleString() }})</span>
                                        </div>
                                        <!-- Add-on Quantity Control -->
                                        <div class="d-flex align-items-center">
                                            <BButton variant="outline-danger" class="px-2 py-1"
                                                @click="decrementQuantity(detail)">
                                                -
                                            </BButton>

                                            <span class="mx-3 fw-bold">{{ detail.quantity }}</span>

                                            <BButton variant="outline-success" class="px-2 py-1"
                                                @click="incrementQuantity(detail)">
                                                +
                                            </BButton>
                                        </div>
                                    </BListGroupItem>
                                </BListGroup>
                            </div>

                            <BButton variant="success" class="mt-4 w-100 py-2" @click="addToCart">
                                <i class="bi bi-cart-plus me-2"></i> Add To Cart
                            </BButton>
                        </BCardBody>
                    </BCard>
                </BCol>
            </BRow>

            <!-- Product Not Found Message -->
            <BRow v-else>
                <BCol class="text-center py-5">
                    <h4 class="text-danger">Product Not Found</h4>
                    <p class="text-muted">The product you are looking for does not exist.</p>
                </BCol>
            </BRow>
        </BContainer>
    </Layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Layout from "@/layouts/main";
import PageHeader from "@/components/page-header";
import { useCartStore, useProductStore } from "../../../state/pinia";

import { useProgress } from "@/helpers/progress"; // Import custom progress function
import {
    showSuccessToast,
    showErrorToast,
} from "@/helpers/alert.js";

const { startProgress, finishProgress, failProgress } = useProgress();


const cartStore = useCartStore();
const productStore = useProductStore();
const route = useRoute();

const product = ref(null);
const productQuantity = ref(1); // Default product quantity

const fetchProduct = async () => {
    startProgress();

    try {
        await productStore.getProductBySlug(route.params.slug);
        product.value = productStore.productBySlug;

        if (product.value.details) {
            product.value.details = product.value.details.map(detail => ({
                ...detail,
                quantity: 0 // Default quantity for add-ons
            }));
        }
        showSuccessToast("Product fetched successfully!");
        finishProgress();
    } catch (error) {
        failProgress();
        showErrorToast("Error fetching product", error);
    }
};

// Product Quantity Controls
const incrementProductQuantity = () => {
    productQuantity.value++;
};

const decrementProductQuantity = () => {
    if (productQuantity.value > 1) {
        productQuantity.value--;
    }
};

// Add-on Quantity Controls
const incrementQuantity = (detail) => {
    detail.quantity++;
};

const decrementQuantity = (detail) => {
    if (detail.quantity > 0) {
        detail.quantity--;
    }
};

// Add to Cart
const addToCart = () => {
    if (product.value) {
        const user = JSON.parse(localStorage.getItem("user"));
        // console.log("user", user.id);

        const selectedAddons = product.value.details.filter(detail => detail.quantity > 0);

        const payload = [
            // Main product
            {
                user_id: user?.id,
                product_id: product.value.id,
                quantity: productQuantity.value
            },
            // Add-ons
            ...selectedAddons.map(addon => ({
                user_id: user?.id,
                product_id: product.value.id,
                product_detail_id: addon.id,
                quantity: addon.quantity
            }))
        ];

        startProgress();
        console.log("Added to Cart:", payload);

        // Send each item separately
        payload.forEach(item => cartStore.addCartItem(item).then(() => finishProgress()));
        showSuccessToast("Product added to cart successfully!");
    } else {
        showErrorToast("Product not found", "Please try again later.");
    }
};

onMounted(fetchProduct);
</script>
