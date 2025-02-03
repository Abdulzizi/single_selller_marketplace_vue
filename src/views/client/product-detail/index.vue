<template>
    <Layout>
        <PageHeader :title="product ? product.name : 'Product Not Found'" pageTitle="Client" />

        <BContainer>
            <BRow v-if="product">
                <!-- Product Image -->
                <BCol md="6">
                    <BCard>
                        <BCardImg :src="product.image" :alt="product.name" top />
                    </BCard>
                </BCol>

                <!-- Product Details -->
                <BCol md="6">
                    <BCard>
                        <BCardBody>
                            <h3>{{ product.name }}</h3>
                            <p class="text-muted">Category: {{ product.category }}</p>
                            <h4 class="text-primary">${{ product.price }}</h4>
                            <p>{{ product.description }}</p>

                            <BButton variant="success" class="mt-3" @click="addToCart(product)">
                                <i class="bi bi-cart-plus me-2"></i> Add To Cart
                            </BButton>
                        </BCardBody>
                    </BCard>
                </BCol>
            </BRow>

            <!-- Product Not Found Message -->
            <BRow v-else>
                <BCol>
                    <h4>Product Not Found</h4>
                    <p>The product you are looking for does not exist.</p>
                </BCol>
            </BRow>
        </BContainer>
    </Layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import Layout from "@/layouts/main";
import PageHeader from "@/components/page-header";

// Get current route
const route = useRoute();

// Simulated Product List
const products = ref([
    { id: 1, name: "Smartphone", slug: "smartphone", category: "Electronics", price: 299, image: "https://picsum.photos/400?random=1", description: "A powerful smartphone with an excellent camera and long battery life." },
    { id: 2, name: "Laptop", slug: "laptop", category: "Electronics", price: 899, image: "https://picsum.photos/400?random=2", description: "A high-performance laptop suitable for work and gaming." },
    { id: 3, name: "T-Shirt", slug: "t-shirt", category: "Clothing", price: 19, image: "https://picsum.photos/400?random=3", description: "A comfortable and stylish cotton T-shirt available in various sizes." },
    { id: 4, name: "Jacket", slug: "jacket", category: "Clothing", price: 79, image: "https://picsum.photos/400?random=4", description: "A warm and durable jacket perfect for cold weather." },
]);

// Find the product by slug
const product = computed(() => products.value.find(p => p.slug === route.params.slug));

// Function to Add Product to Cart (Placeholder)
const addToCart = (product) => {
    console.log("Added to Cart:", product);
    alert(`${product.name} added to cart!`);
};
</script>
