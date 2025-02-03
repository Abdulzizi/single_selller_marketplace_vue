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
                        <BFormGroup>
                            <BFormCheckbox v-model="selectedCategory" value="Electronics">Electronics</BFormCheckbox>
                            <BFormCheckbox v-model="selectedCategory" value="Clothing">Clothing</BFormCheckbox>
                            <BFormCheckbox v-model="selectedCategory" value="Home & Kitchen">Home & Kitchen
                            </BFormCheckbox>
                        </BFormGroup>

                        <!-- Price Range Filter -->
                        <h6 class="mt-3">Price Range</h6>
                        <BFormRange v-model="priceRange" :min="0" :max="500" step="10"></BFormRange>
                        <p class="mt-2">Price: ${{ priceRange }}</p>

                        <BButton variant="primary" @click="applyFilters">Apply Filters</BButton>
                    </BCardBody>
                </BCard>
            </BCol>

            <!-- Product List -->
            <BCol lg="9">
                <BRow>
                    <BCol lg="4" v-for="product in filteredProducts" :key="product.id">
                        <BCard class="mb-4">
                            <BCardImg :src="product.image" alt="Product Image" top />
                            <BCardBody>
                                <h6>{{ product.name }}</h6>
                                <p class="text-muted">${{ product.price }}</p>
                                <BButton variant="success">Buy Now</BButton>
                            </BCardBody>
                        </BCard>
                    </BCol>
                </BRow>
            </BCol>
        </BRow>
    </Layout>
</template>

<script setup>
import { ref, computed } from "vue";
import Layout from "@/layouts/main";
import PageHeader from "@/components/page-header";

// Hardcoded Product Data
const products = ref([
    { id: 1, name: "Smartphone", category: "Electronics", price: 299, image: "https://via.placeholder.com/200" },
    { id: 2, name: "Laptop", category: "Electronics", price: 899, image: "https://via.placeholder.com/200" },
    { id: 3, name: "T-Shirt", category: "Clothing", price: 19, image: "https://via.placeholder.com/200" },
    { id: 4, name: "Jacket", category: "Clothing", price: 79, image: "https://via.placeholder.com/200" },
    { id: 5, name: "Blender", category: "Home & Kitchen", price: 49, image: "https://via.placeholder.com/200" },
    { id: 6, name: "Vacuum Cleaner", category: "Home & Kitchen", price: 199, image: "https://via.placeholder.com/200" },
]);

// Filter states
const selectedCategory = ref([]);
const priceRange = ref(500);

// Computed: Filtered Products
const filteredProducts = computed(() => {
    return products.value.filter(product =>
        (selectedCategory.value.length === 0 || selectedCategory.value.includes(product.category)) &&
        product.price <= priceRange.value
    );
});

// Function to Apply Filters (For Future Enhancements)
const applyFilters = () => {
    console.log("Filters Applied:", { selectedCategory: selectedCategory.value, priceRange: priceRange.value });
};
</script>
