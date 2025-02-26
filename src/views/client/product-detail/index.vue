<template>
    <Layout>
        <PageHeader :title="product ? product.name : 'Product Not Found'" pageTitle="Product Details" />

        <BContainer>
            <BRow v-if="product">
                <!-- Product Image -->
                <BCol md="6">
                    <BCard>
                        <BCardImg :src="product.photo_desktop_url" :alt="product.name" class="zoom-effect" top />
                    </BCard>
                </BCol>

                <!-- Product Details -->
                <BCol md="6">
                    <BCard>
                        <BCardBody>
                            <h3 class="mb-3">{{ product.name }}</h3>
                            <p class="text-muted">Category: <strong>{{ product.product_category_name }}</strong></p>
                            <h4 class="highlighted-price">RP.{{ product.price.toLocaleString() }}</h4>
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

                            <!-- Product detail / Addon -->
                            <div v-if="product.details && product.details.length > 0" class="mt-4">
                                <h5 class="fw-bold">Available Add-ons:</h5>
                                <BListGroup>
                                    <BListGroupItem v-for="detail in product.details" :key="detail.id">
                                        <div class="d-flex align-items-center">
                                            <BFormCheckbox :model-value="detail.selected" @change="toggleAddon(detail)">
                                                <strong>{{ detail.type }}</strong>: {{ detail.description }}
                                                <span v-if="detail.price > 0" class="text-success"> (+RP.{{
                                                    detail.price.toLocaleString() }})</span>
                                            </BFormCheckbox>
                                        </div>
                                    </BListGroupItem>
                                </BListGroup>
                            </div>

                            <BButton variant="success" class="d-none d-md-block mt-4 w-100 py-2" @click="addToCart">
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

            <!-- Sticky Add-to-Cart Button -->
            <div class="d-md-none sticky-add-to-cart">
                <BButton variant="success" class="w-100 py-2" :disabled="loading" @click="addToCart">
                    <i class="bi bi-cart-plus me-2"></i> Add To Cart
                </BButton>
            </div>
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
                selected: false,
                quantity: 0 // Default quantity for add-ons
            }));
        }

        finishProgress();
    } catch (error) {
        failProgress();
        showErrorToast("Error fetching product", error);
    }
};

const toggleAddon = (detail) => {
    detail.selected = !detail.selected;
    detail.quantity = detail.selected ? 1 : 0; // at least 1 quantity if selected

    product.value.details = [...product.value.details];
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

const addToCart = async () => {
    if (!product.value) {
        showErrorToast("Product not found", "Please try again later.");
        return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        showErrorToast("User not found", "Please log in first.");
        return;
    }

    const selectedAddons = product.value.details.filter(detail => detail.selected);

    const cartItemsPayload = [];

    if (selectedAddons.length > 0) {
        // Jika add-on dipilih, buat SATU item cart + add-on yg dipilih
        const addon = selectedAddons[0]; // Only take the first selected add-on

        const existingAddonItem = cartStore.cartItems.find(item =>
            item.user_id === user.id &&
            item.product_id === product.value.id &&
            item.product_detail_id === addon.id
        );

        if (existingAddonItem) {
            // Update cart item quantity
            cartItemsPayload.push({
                id: existingAddonItem.id,
                user_id: user.id,
                product_id: product.value.id,
                product_detail_id: addon.id,
                quantity: existingAddonItem.quantity + 1
            });
        } else {
            // Add new cart item with product + addon
            cartItemsPayload.push({
                user_id: user.id,
                product_id: product.value.id,
                product_detail_id: addon.id,
                quantity: 1
            });
        }
    } else {
        // Tidak ada add-on dipilih -> Hanya tambahkan produk utama
        const existingCartItem = cartStore.cartItems.find(item =>
            item.user_id === user.id &&
            item.product_id === product.value.id &&
            !item.product_detail_id // Ensure it's the main product, not an add-on
        );

        if (existingCartItem) {
            // Update the existing product quantity
            cartItemsPayload.push({
                id: existingCartItem.id,
                user_id: user.id,
                product_id: product.value.id,
                quantity: existingCartItem.quantity + productQuantity.value
            });
        } else {
            // Tambahkan produk baru tanpa add-on
            cartItemsPayload.push({
                user_id: user.id,
                product_id: product.value.id,
                quantity: productQuantity.value
            });
        }
    }

    console.log("Final Cart Payload:", cartItemsPayload);

    startProgress();

    try {
        // Run all cart updates in parallel
        await Promise.all(cartItemsPayload.map(item => {
            return item.id ? cartStore.updateCartItem(item) : cartStore.addCartItem(item);
        }));

        showSuccessToast(`${product.value.name} added to cart successfully!`);
    } catch (error) {
        showErrorToast("Failed to update cart.");
    } finally {
        finishProgress();
    }
};

onMounted(fetchProduct);
</script>

<style scoped>
.zoom-effect {
    transition: transform 0.3s ease-in-out;
}

.zoom-effect:hover {
    transform: scale(1.1);
}

.highlighted-price {
    font-size: 1.5rem;
    color: #d9534f;
    font-weight: bold;
}

.quantity-input {
    width: 80px;
    text-align: center;
}

.sticky-add-to-cart {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 10px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}
</style>
