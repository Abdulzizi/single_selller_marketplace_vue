<template>
    <Layout>
        <PageHeader title="Marketplace" pageTitle="Products" />

        <BRow class="gx-4 gy-4">
            <!-- Banner Section -->
            <BCard class="shadow-sm border-0 rounded-3 p-0 overflow-hidden position-relative text-white">
                <BCardImg :src="require('@/assets/images/marketplace-banner-2.jpg')" alt="Marketplace Banner"
                    class="banner-image rounded-3" />
                <BCardBody class="position-absolute top-50 start-50 translate-middle text-center">
                    <h1 class="fw-bold display-4">Welcome to Our Marketplace</h1>
                    <p class="fs-5">Find the best products at unbeatable prices!</p>
                </BCardBody>
            </BCard>

            <!-- Sidebar Filters (Mobile Responsive) -->
            <BCol lg="3" class="d-none d-lg-block">
                <BCard v-if="showFilters" class="shadow-sm border-0 rounded-3 p-3" @click.self="showFilters = false">
                    <h5 class="mb-3 fw-bold">Filter Products</h5>

                    <!-- Category Filter -->
                    <h6 class="mt-3 fw-semibold">Category</h6>
                    <div>
                        <div v-for="category in categories" :key="category.value" class="form-check">
                            <input class="form-check-input" type="checkbox" :id="'category-' + category.value"
                                :value="category.value" v-model="selectedCategories" />
                            <label class="form-check-label" :for="'category-' + category.value">
                                {{ category.label }}
                            </label>
                        </div>
                    </div>

                    <!-- Price Range Filter -->
                    <h6 class="mt-4 fw-semibold">Price Range (RP)</h6>
                    <div class="d-flex align-items-center gap-2">
                        <input v-model="minPrice" type="number" class="form-control rounded-3" placeholder="Min" />
                        <div class="fw-bold d-flex align-items-center justify-content-center">—</div>
                        <input v-model="maxPrice" type="number" class="form-control rounded-3" placeholder="Max" />
                    </div>

                    <!-- Apply Filters -->
                    <BButton @click="applyFilters" variant="primary" class="mt-3 w-100 fw-bold">
                        Apply Filters
                    </BButton>

                    <a href="#" class="mt-2 d-block text-muted fst-italic" @click.prevent="resetFilters">
                        Reset filters
                    </a>

                </BCard>
            </BCol>

            <!-- Mobile Filter Toggle Button -->
            <BCol class="d-lg-none mb-3">
                <BButton variant="primary" class="w-100 fw-bold" @click="showFilters = !showFilters">
                    {{ showFilters ? "Hide Filters" : "Show Filters" }}
                </BButton>

                <transition name="fade">
                    <BCard v-if="showFilters" class="shadow-sm border-0 rounded-3 mt-3 p-2">
                        <BCardBody>
                            <h5 class="mb-3 fw-bold">Filter Products</h5>

                            <!-- Category Filter -->
                            <h6 class="mt-3 fw-semibold">Category</h6>
                            <div>
                                <div v-for="category in categories" :key="category.value" class="form-check">
                                    <input class="form-check-input" type="checkbox" :id="'category-' + category.value"
                                        :value="category.value" v-model="selectedCategories" />
                                    <label class="form-check-label" :for="'category-' + category.value">
                                        {{ category.label }}
                                    </label>
                                </div>
                            </div>

                            <!-- Price Range Filter -->
                            <h6 class="mt-4 fw-semibold">Price Range (RP)</h6>
                            <div class="d-flex gap-2">
                                <input v-model="minPrice" type="number" class="form-control rounded-3"
                                    placeholder="Min" />
                                <span class="fw-bold">—</span>
                                <input v-model="maxPrice" type="number" class="form-control rounded-3"
                                    placeholder="Max" />
                            </div>

                            <!-- Apply Filters -->
                            <BButton @click="applyFilters" variant="primary" class="mt-3 w-100 fw-bold">
                                Apply Filters
                            </BButton>

                            <a href="#" class="mt-2 d-block text-muted fst-italic text-center"
                                @click.prevent="resetFilters">
                                Reset filters
                            </a>
                        </BCardBody>
                    </BCard>
                </transition>
            </BCol>

            <!-- Product List with White Background -->
            <BCol lg="9">
                <BCard class="shadow-sm border-0 rounded-3 bg-white p-4">
                    <BRow class="g-4">
                        <BCol v-if="filteredProducts.length === 0" class="text-center py-5">
                            <h4 class="text-muted">No Products Found</h4>
                            <p>Try adjusting the filters.</p>
                        </BCol>

                        <BCol v-for="product in filteredProducts" :key="product.id" xs="12" sm="6" md="4">
                            <BCard class="border-2 rounded-3 text-center overflow-hidden product-card">
                                <BCardImg :src="product.photo_desktop_url" :alt="product.name" top
                                    class="rounded-top-3 product-image" loading="lazy" />
                                <BCardBody class="d-flex flex-column">
                                    <h6 class="fw-bold">{{ product.name }}</h6>
                                    <p class="text-muted my-0">{{ product.product_category_name }}</p>
                                    <p class="text-primary fw-bold">RP.{{ product.price.toLocaleString() }}</p>

                                    <div class="d-flex flex-column gap-2 mt-auto">
                                        <BButton variant="outline-primary" @click="viewDetails(product)"
                                            class="w-100 fw-semibold">
                                            View Details
                                        </BButton>
                                        <BButton variant="success" @click="addToCart(product)"
                                            class="w-100 fw-semibold">
                                            <i class="bi bi-cart-plus me-1"></i> Add To Cart
                                        </BButton>
                                    </div>
                                </BCardBody>
                            </BCard>
                        </BCol>
                    </BRow>
                    <!-- Load More Button -->
                    <BCol v-if="showLoadMore" class="text-center">
                        <BButton variant="primary" class="fw-bold px-5 py-2" @click="loadMore">
                            Load More
                        </BButton>
                    </BCol>
                </BCard>
            </BCol>

        </BRow>
    </Layout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import Layout from "@/layouts/main";
import PageHeader from "@/components/page-header";
import { useProductStore, useProductCategoryStore, useCartStore } from "../../state/pinia";
import { useRouter } from "vue-router";
import { useProgress } from "@/helpers/progress";
import { showSuccessToast, showErrorToast } from "@/helpers/alert.js";


const { startProgress, finishProgress, failProgress } = useProgress();

const productStore = useProductStore();
const productCategoryStore = useProductCategoryStore();
const cartStore = useCartStore();
const router = useRouter();

const categories = ref([]);

const showFilters = ref(false);

const selectedCategories = ref([]);
const minPrice = ref(productStore.minPrice);
const maxPrice = ref(productStore.maxPrice);

const filteredProducts = ref([]);

const showLoadMore = computed(() => filteredProducts.value.length < productStore.totalData);

const loadMore = async () => {
    console.log("Loading more products...");

    if (filteredProducts.value.length < productStore.totalData) { // Ensure more products exist
        startProgress();
        try {
            productStore.current += 1; // Move to next page
            await productStore.getProducts(true); // Fetch new products

            // Ensure newly fetched products are different from existing ones
            const newProducts = productStore.products.filter(
                (newProd) => !filteredProducts.value.some((existingProd) => existingProd.id === newProd.id)
            );

            if (newProducts.length > 0) {
                filteredProducts.value = [...filteredProducts.value, ...newProducts];
            }

            finishProgress();
        } catch (error) {
            failProgress();
            showErrorToast("Failed to load more products.");
        }
    }
};

const getProducts = async () => {
    startProgress();
    try {
        await productStore.getProducts();

        filteredProducts.value = [...productStore.products];

        finishProgress();
    } catch (error) {
        failProgress();
        showErrorToast("Something went wrong.");
    }
};


const getCategories = async () => {
    startProgress();
    try {
        await productCategoryStore.getCategories();
        categories.value = productCategoryStore.categories.map(cat => ({
            label: cat.name,
            value: String(cat.id),
        }));
        finishProgress();
    } catch (error) {
        failProgress();
        showErrorToast("Failed to fetch categories.");
    }
};

const applyFilters = async () => {
    // startProgress();
    // console.log(selectedCategories);

    productStore.productCategoryId = selectedCategories.value;
    productStore.minPrice = minPrice.value;
    productStore.maxPrice = maxPrice.value;

    try {
        await productStore.getProducts(); // Fetch filtered products

        filteredProducts.value = productStore.products || []; // Ensure filtered products are updated

        // showFilters.value = false;
        showSuccessToast("Filters applied successfully.");
        finishProgress();
    } catch (error) {
        failProgress();
        showErrorToast("Failed to apply filters.");
    }
};

const resetFilters = async () => {
    productStore.productCategoryId = [];
    selectedCategories.value = [];
    minPrice.value = productStore.minPrice;
    maxPrice.value = productStore.maxPrice;

    try {
        await productStore.getProducts(); // Fetch all products

        filteredProducts.value = [...productStore.products]; // Reset to all products

        showSuccessToast("Filters reset successfully.");
        finishProgress();
    } catch (error) {
        failProgress();
        showErrorToast("Failed to reset filters.");
    }
};

const viewDetails = (product) => {
    router.push({ name: "product-detail", params: { slug: product.slug } });
};

const addToCart = (product) => {
    if (product) {
        const user = JSON.parse(localStorage.getItem("user"));

        // Check if product already exists in the cart
        const existingItem = cartStore.cartItems.find(item => item.product_id === product.id);

        if (existingItem) {
            // Update quantity
            const updatedPayload = {
                id: existingItem.id,
                user_id: user?.id,
                product_id: product.id,
                quantity: existingItem.quantity + 1
            };

            cartStore.updateCartItem(updatedPayload).then(() => finishProgress());
            showSuccessToast("Product quantity updated in cart!");
        } else {
            // Add new item to cart
            const payload = {
                user_id: user?.id,
                product_id: product.id,
                quantity: 1
            };

            cartStore.addCartItem(payload).then(() => finishProgress());
            showSuccessToast("Product added to cart successfully!");
        }
    } else {
        showErrorToast("Product not found", "Please try again later.");
    }
};

// UNCOMMECT JIKA INGIN REACTIVE
// watch(selectedCategories, applyFilters, { deep: true });
// watch(minPrice, (newVal) => {
//     productStore.minPrice = newVal;
//     applyFilters();
// });

// watch(maxPrice, (newVal) => {
//     productStore.maxPrice = newVal;
//     applyFilters();
// });


onMounted(async () => {
    await getProducts();
    await getCategories();

    // forcing showfilter to turn on in larger screen
    if (window.innerWidth >= 992) {
        showFilters.value = true;
    }
});
</script>

<style scoped>
/* Product Card Styling */
.product-card {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    background-color: #fff;
    border-radius: 12px;
    overflow: hidden;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15);
}

/* Product Image Styling */
.product-image {
    height: 200px;
    object-fit: cover;
}

/* Input Fields */
input[type="number"] {
    padding: 8px;
    font-size: 14px;
}

/* Mobile Filter Animation */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease-in-out;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

/* Banner Styles */
.banner-image {
    width: 100%;
    height: 500px;
    object-fit: cover;
    object-position: bottom;
    /* fil ter: brightness(0.6); */
    /* border-radius: 12px; */
}
</style>
