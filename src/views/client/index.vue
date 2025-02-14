<template>
    <Layout>
        <PageHeader title="Marketplace" pageTitle="Products" />

        <BRow>
            <!-- Sidebar Filters -->
            <BCol lg="3">
                <BCard class="shadow-lg border-0 rounded-3">
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
                            <input v-model="minPrice" type="number" class="form-control rounded-sm" placeholder="Min" />
                            <p>_</p>
                            <input v-model="maxPrice" type="number" class="form-control rounded-sm" placeholder="Max" />
                        </div>

                        <!-- Apply Filters -->
                        <button @click="applyFilters" class="btn btn-primary mt-3 w-100 fw-bold">
                            Apply Filters
                        </button>

                        <a href="#" class="mt-2 text-muted fst-italic" @click.prevent="resetFilters">Reset filters</a>
                    </BCardBody>
                </BCard>
            </BCol>

            <!-- Product List -->
            <BCol lg="9">
                <BRow>
                    <BCol v-if="filteredProducts.length === 0" class="text-center py-5">
                        <h4 class="text-muted">No Products Found</h4>
                        <p>Try adjusting the filters.</p>
                    </BCol>

                    <BCol v-for="product in filteredProducts" :key="product.id" md="6" lg="4">
                        <BCard class="mb-4 shadow-sm border-0 rounded-3 text-center overflow-hidden">
                            <BCardImg :src="product.photo_desktop_url" :alt="product.name" top class="rounded-top-3"
                                loading="lazy" />
                            <BCardBody>
                                <h6 class="fw-bold">{{ product.name }}</h6>
                                <p class="text-muted my-0">{{ product.product_category_name }}</p>
                                <p class="text-primary fw-bold">RP.{{ product.price.toLocaleString() }}</p>

                                <div class="d-flex flex-column flex-md-row gap-2">
                                    <BButton variant="outline-primary" @click="viewDetails(product)"
                                        class="w-100 fw-semibold">
                                        View Details
                                    </BButton>
                                    <BButton variant="success" @click="addToCart(product)" class="w-100 fw-semibold">
                                        <i class="bi bi-cart-plus me-1"></i> Add To Cart
                                    </BButton>
                                </div>
                            </BCardBody>
                        </BCard>
                    </BCol>
                </BRow>
            </BCol>
        </BRow>
    </Layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
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

const products = ref([]);
const categories = ref([]);

const selectedCategories = ref([]);
const minPrice = ref(productStore.minPrice);
const maxPrice = ref(productStore.maxPrice);

const filteredProducts = ref([]);

const getProducts = async () => {
    startProgress();
    try {
        await productStore.getProducts();

        products.value = productStore.products || [];
        filteredProducts.value = [...products.value];
        finishProgress();
    } catch (error) {
        failProgress();
        showErrorToast("Failed to fetch products.");
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
    // console.log("Selected Categories:", selectedCategories.value);

    startProgress();
    productStore.productCategoryId = selectedCategories.value;

    try {
        await productStore.getProducts();

        const min = minPrice.value !== "" ? Number(minPrice.value) : 0;
        const max = maxPrice.value !== "" ? Number(maxPrice.value) : Infinity;

        filteredProducts.value = productStore.products.filter(product => {
            const priceMatch = product.price >= min && product.price <= max;
            return priceMatch;
        });

        showSuccessToast("Filters applied successfully.");
        finishProgress();
    } catch (error) {
        failProgress();
        showErrorToast("Failed to apply filters.");
    }
};

const resetFilters = () => {
    selectedCategories.value = [];
    minPrice.value = productStore.minPrice;
    maxPrice.value = productStore.maxPrice;
    filteredProducts.value = [...products.value];
    showSuccessToast("Filters reset successfully.");
};

const viewDetails = (product) => {
    router.push({ name: "product-detail", params: { slug: product.slug } });
};

const addToCart = (product) => {
    // console.log(product);

    if (product) {
        const user = JSON.parse(localStorage.getItem("user"));

        const payload = [
            // product
            {
                user_id: user?.id,
                product_id: product.id,
                quantity: 1
            }
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
});
</script>
