<template>
    <Layout>
        <template #title>Products Data </template>
        <div class="w-full mx-auto p-4 rounded-lg bg-gray-100 dark:bg-gray-900">
            <div class="w-full">
                <div class="mb-8 flex items-center justify-between gap-8">
                    <div>
                        <h6 class="font-sans antialiased font-bold text-base md:text-lg lg:text-xl text-current">
                            List Products
                        </h6>
                        <p class="font-sans antialiased text-base text-current mt-1">lihat informasi untuk semua
                            products
                        </p>
                    </div>
                </div>
                <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div class="flex data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row gap-2"
                        data-orientation="horizontal">
                        <div class="relative w-full md:w-72">
                            <InputField v-model="productStore.searchQuery" placeholder="Search..." name="search"
                                v-debounce:500="searchData" />
                        </div>
                    </div>
                    <div class="w-full md:w-72 flex justify-end">
                        <!-- Tombol trigger form -->
                        <Button @click="addProduct" variant="solid" color="primary">
                            Tambah Product
                        </Button>

                    </div>
                </div>
                <div class="mt-4 w-full overflow-hidden rounded-lg border border-gray-200">

                    <!-- Table -->
                    <table class="w-full">
                        <thead
                            class="border-b border-gray-200 bg-gray-100 text-sm font-medium text-gray-600 dark:bg-gray-900">
                            <tr>
                                <th class="px-2.5 py-2 text-start font-medium">
                                    <small class="text-sm text-current opacity-70">Product</small>
                                </th>
                                <th class="px-2.5 py-2 text-start font-medium">
                                    <small class="text-sm text-current opacity-70">Price</small>
                                </th>
                                <th class="px-2.5 py-2 text-start font-medium">
                                    <small class="text-sm text-current opacity-70">Category</small>
                                </th>
                                <th class="px-2.5 py-2 text-start font-medium">
                                    <small class="text-sm text-current opacity-70">Availability</small>
                                </th>
                                <th class="px-2.5 py-2 text-start font-medium">
                                    <small class="text-sm text-current opacity-70">Description</small>
                                </th>
                                <th class="px-2.5 py-2 text-start font-medium">
                                    <small class="text-sm text-current opacity-70">Details</small>
                                </th>
                                <th class="px-2.5 py-2 text-start font-medium">
                                    <small class="text-sm text-current opacity-70"></small>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="group text-sm text-gray-800 dark:text-white">
                            <template v-if="productStore.totalData > 0">
                                <tr class="border-b border-gray-200 last:border-0" v-for="row in productStore.products"
                                    :key="row.id">
                                    <!-- Product Info -->
                                    <td class="p-3">
                                        <div class="flex items-center gap-3">
                                            <img :src="row.photo_desktop_url" alt="product"
                                                class="w-8 h-8 rounded object-cover object-center" />
                                            <div class="flex flex-col">
                                                <small class="text-sm text-current font-sans">{{ row.name }}</small>
                                                <small class="text-sm text-current opacity-70 font-sans">Slug: {{
                                                    row.slug }}</small>
                                            </div>
                                        </div>
                                    </td>

                                    <!-- Price -->
                                    <td class="p-3">
                                        <small class="font-sans text-sm text-current">
                                            Rp {{ row.price.toLocaleString("id-ID") }}
                                        </small>
                                    </td>

                                    <!-- Category -->
                                    <td class="p-3">
                                        <small class="font-sans text-sm text-current">
                                            {{ row.product_category_name }}
                                        </small>
                                    </td>

                                    <!-- Availability -->
                                    <td class="p-3">
                                        <small class="font-sans text-sm"
                                            :class="row.is_available === '1' ? 'text-green-600' : 'text-red-600'">
                                            {{ row.is_available === '1' ? 'Available' : 'Unavailable' }}
                                        </small>
                                    </td>

                                    <!-- Description -->
                                    <td class="p-3">
                                        <small class="font-sans text-sm text-current line-clamp-2">
                                            {{ row.description }}
                                        </small>
                                    </td>

                                    <!-- Details -->
                                    <td class="p-3">
                                        <small class="font-sans text-sm text-current">
                                            <template v-if="row.details && row.details.length > 3">
                                                {{
                                                    countDetailsByType(row.details)
                                                        .map(([type, count]) => `${count} ${type}`)
                                                        .join(', ')
                                                }}
                                            </template>
                                            <template v-else-if="row.details && row.details.length > 0">
                                                {{
                                                    row.details.map(detail => `${detail.type}:
                                                ${detail.description}`).join(' | ')
                                                }}
                                            </template>
                                            <template v-else>
                                                -
                                            </template>
                                        </small>
                                    </td>

                                    <!-- Actions -->
                                    <td class="p-3">
                                        <div class="flex gap-2 justify-end">
                                            <Button @click="editProduct(row.id)" variant="outline" color="secondary">
                                                Edit
                                            </Button>
                                            <Button @click="deleteProduct(row.id)" variant="outline" color="error">
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            </template>

                            <!-- No Data -->
                            <tr v-else>
                                <td colspan="7" class="text-center py-4 text-sm text-gray-500">
                                    No results.
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
                <div class="flex items-center justify-between border-gray-200 py-4"><small
                        class="font-sans antialiased text-sm text-current">Page {{ productStore.totalPage != 0 ?
                            productStore.current
                            : productStore.totalPage }} of {{
                            productStore.totalPage }}</small>
                    <div class="flex gap-2"><button
                            class="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-1.5 px-3 shadow-sm hover:shadow bg-transparent border-gray-200 text-gray-800 hover:bg-gray-200"
                            data-shape="default" data-width="default" :disabled="productStore.current === 1"
                            @click="paginate(productStore.current - 1)">Previous</button><button
                            class="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-1.5 px-3 shadow-sm hover:shadow bg-transparent border-gray-200 text-gray-800 hover:bg-gray-200"
                            data-shape="default" data-width="default" :disabled="productStore.current >=
                                Math.ceil(productStore.totalData / productStore.perpage)
                                " @click="paginate(productStore.current + 1)">Next</button></div>
                </div>
            </div>

        </div>
    </Layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import Layout from "@/layouts/main.vue";
import Button from "@/components/widgets/Button";
import InputField from "@/components/widgets/Input";

import { useProductStore } from "@/state/pinia/product";
import { showSuccessToast, showDeleteConfirmationDialog } from "@/helpers/alert.js";

const productStore = useProductStore();
const router = useRouter();

const rows = ref([]);


const getProducts = async () => {
    try {
        await productStore.getProducts();
        rows.value = productStore.products || [];
    } catch (error) {
        console.error(error);
    }
};

const searchData = async () => {
    await productStore.changePage(1);
    await getProducts();
};

const paginate = async (page) => {
    await productStore.changePage(page);
    await getProducts();
};

const addProduct = () => {
    productStore.openForm('add')
    router.push({ name: 'product-form' });
}

const editProduct = async (id) => {
    productStore.openForm('edit')
    router.push({ name: 'product-form', params: { id } });
    // await productStore.getProductById(id);
    // await productStore.getCategories();
}

const deleteProduct = async (id) => {
    const isConfirmed = await showDeleteConfirmationDialog("Delete Product", "Are you sure you want to delete this product?");

    if (isConfirmed) {
        await productStore.deleteProduct(id);
        await getProducts();
        showSuccessToast("Product deleted successfully!");
    }
};

const countDetailsByType = (details) => {
    const counts = {};

    details.forEach((detail) => {
        const type = detail.type;
        counts[type] = (counts[type] || 0) + 1;
    });

    return Object.entries(counts); // returns array [type, count]
};

onMounted(() => {
    getProducts();
});
</script>