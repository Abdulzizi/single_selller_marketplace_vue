<template>
    <Layout>
        <PageHeader title="Marketplace" pageTitle="Products" />

        <BRow>
            <!-- Sidebar Filters -->
            <BCol lg="3">
                <BCard>
                    <BCardBody>
                        <h5 class="mb-3">Filter Products</h5>

                        <!-- Category Filter -->
                        <h6 class="mt-3">Category</h6>

                        <Vueform v-model="selectedCategory">
                            <CheckboxgroupElement name="categoryCheckBox" :items="categories" />
                        </Vueform>

                        <!-- Price Range Filter -->
                        <h6 class="mt-3">Price Range</h6>

                        <Vueform>
                            <GroupElement name="price-range">
                                <TextElement v-model="minPrice" name="min-price" placeholder="min price" :columns="{
                                    default: 12,
                                    sm: 6
                                }" />
                                <TextElement v-model="maxPrice" name="max-price" placeholder="max price" :columns="{
                                    default: 12,
                                    sm: 6
                                }" />
                            </GroupElement>

                            <!-- Apply Filters -->
                            <ButtonElement @click="applyFilters" name="button">
                                Apply Filters
                            </ButtonElement>
                        </Vueform>

                    </BCardBody>
                </BCard>
            </BCol>

            <!-- Product List -->
            <BCol lg="9">
                <BRow>
                    <BCol v-for="product in filteredProducts" :key="product.id" md="12" lg="4">
                        <BCard class="mb-4 text-center">
                            <BCardImg :src="product.image" :alt="product.name" top loading="lazy" />
                            <BCardBody>
                                <h6>{{ product.name }}</h6>
                                <p class="text-muted">${{ product.price }}</p>

                                <BRow class="d-flex justify-content-center flex-column flex-md-row flex-lg-row gap-2">
                                    <!-- View Details Button -->
                                    <BCol cols="12" md="6" lg="auto">
                                        <BButton variant="primary" @click="viewDetails(product)"
                                            class="w-100 btn-sm btn-md">
                                            View Details
                                        </BButton>
                                    </BCol>

                                    <!-- Add to Cart Button -->
                                    <BCol cols="12" md="6" lg="auto">
                                        <BButton variant="success" @click="addToCart(product)"
                                            class="w-100 btn-sm btn-md">
                                            Add To Cart
                                        </BButton>
                                    </BCol>
                                </BRow>
                            </BCardBody>
                        </BCard>
                    </BCol>
                </BRow>
            </BCol>

        </BRow>
    </Layout>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Layout from "@/layouts/main";
import PageHeader from "@/components/page-header";

import { useRouter } from "vue-router";

const router = useRouter();

// Hardcoded Product Data
const products = ref([
    { id: 1, name: "Smartphone", slug: "smartphone", category: "Electronics", price: 299, image: "https://picsum.photos/200?random=1" },
    { id: 2, name: "Laptop", slug: "laptop", category: "Electronics", price: 899, image: "https://picsum.photos/200?random=2" },
    { id: 3, name: "T-Shirt", slug: "t-shirt", category: "Clothing", price: 19, image: "https://picsum.photos/200?random=3" },
    { id: 4, name: "Jacket", slug: "jacket", category: "Clothing", price: 79, image: "https://picsum.photos/200?random=4" },
    { id: 5, name: "Blender", slug: "blender", category: "Home & Kitchen", price: 49, image: "https://picsum.photos/200?random=5" },
    { id: 6, name: "Vacuum Cleaner", slug: "vacuum-cleaner", category: "Home & Kitchen", price: 199, image: "https://picsum.photos/200?random=6" },
    { id: 7, name: "Novel", slug: "novel", category: "Books", price: 15, image: "https://picsum.photos/200?random=7" },
    { id: 8, name: "Cookbook", slug: "cookbook", category: "Books", price: 25, image: "https://picsum.photos/200?random=8" },
    { id: 9, name: "Yoga Mat", slug: "yoga-mat", category: "Sports", price: 30, image: "https://picsum.photos/200?random=9" },
    { id: 10, name: "Dumbbell Set", slug: "dumbbell-set", category: "Sports", price: 99, image: "https://picsum.photos/200?random=10" },
]);


// Hardcoded Category Data
const categories = ref([
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Books",
    "Sports",
]);

// Filter states
const selectedCategory = ref({ categoryCheckBox: [] });
const minPrice = ref(0);
const maxPrice = ref(1000);

const filteredProducts = computed(() => {
    const selectedCategoriesArray = selectedCategory.value.categoryCheckBox || []; // Extract selected categories

    // Convert input values to numbers and handle empty cases
    const min = minPrice.value !== "" ? Number(minPrice.value) : 0;
    const max = maxPrice.value !== "" ? Number(maxPrice.value) : Infinity; // Allow any upper value if empty

    console.log("Filtering with min:", min, "max:", max); // Debugging log

    return products.value.filter(product =>
        // Category filter
        (selectedCategoriesArray.length === 0 || selectedCategoriesArray.includes(product.category)) &&
        // Price filter
        product.price >= min && product.price <= max
    );
});


// Function to Apply Filters
const applyFilters = () => {
    console.log("Filters Applied:", { selectedCategory: selectedCategory.value, minPrice: minPrice.value, maxPrice: maxPrice.value });
};

// Function to View Product Details
const viewDetails = (product) => {
    console.log("View Details:", product);

    router.push({ name: "product-detail", params: { slug: product.slug } });
};

// Function to Add Product to Cart
const addToCart = (product) => {
    console.log("Added to Cart:", product);
    // You can add the product to a cart state or call an API here
};

watch(selectedCategory, (newVal) => {
    console.log("Updated selectedCategory:", newVal);
}, { deep: true });

watch([minPrice, maxPrice], ([newMin, newMax]) => {
    console.log("Updated minPrice:", newMin, "Updated maxPrice:", newMax);
});

</script>