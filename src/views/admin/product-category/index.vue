<template>
    <Layout>
        <template #title>Products Data </template>
        <div class="w-full mx-auto p-4 rounded-lg bg-gray-100 dark:bg-gray-900">
            <div class="w-full">
                <div class="mb-8 flex items-center justify-between gap-8">
                    <div>
                        <h6 class="font-sans antialiased font-bold text-base md:text-lg lg:text-xl text-current">
                            List Products Category
                        </h6>
                        <p class="font-sans antialiased text-base text-current mt-1">See information for all products
                            categories
                        </p>
                    </div>
                </div>
                <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div class="flex data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row gap-2"
                        data-orientation="horizontal">
                        <div class="relative w-full md:w-72">
                            <InputField v-model="productCategoryStore.searchQuery" placeholder="Search..." name="search"
                                v-debounce:500="searchData" />
                        </div>
                    </div>
                    <div class="w-full md:w-72 flex justify-end">
                        <!-- Tombol trigger form -->
                        <Button @click="addProductCategory" variant="solid" color="primary">
                            Add Product Category
                        </Button>

                    </div>
                </div>
                <div class="mt-4 w-full overflow-hidden rounded-lg border border-gray-200">

                    <!-- Table -->
                    <!-- Table -->
                    <table class="w-full">
                        <thead
                            class="border-b border-gray-200 bg-gray-100 text-sm font-medium text-gray-600 dark:bg-gray-900">
                            <tr>
                                <th class="px-2.5 py-2 text-start font-medium">
                                    <small class="text-sm text-current opacity-70">Name</small>
                                </th>
                                <th class="px-2.5 py-2 text-start font-medium">
                                    <small class="text-sm text-current opacity-70">Description</small>
                                </th>
                                <th class="px-2.5 py-2 text-start font-medium">
                                    <small class="text-sm text-current opacity-70">Slug</small>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="group text-sm text-gray-800 dark:text-white">
                            <template v-if="productCategoryStore.totalData > 0">
                                <tr class="border-b border-gray-200 last:border-0"
                                    v-for="row in productCategoryStore.categories" :key="row.id">
                                    <!-- Name -->
                                    <td class="p-3">
                                        <small class="font-sans text-sm text-current font-semibold">{{ row.name
                                        }}</small>
                                    </td>

                                    <!-- Description -->
                                    <td class="p-3">
                                        <small class="font-sans text-sm text-current line-clamp-2">
                                            {{ row.description }}
                                        </small>
                                    </td>

                                    <!-- Slug -->
                                    <td class="p-3">
                                        <small class="font-sans text-sm text-current">
                                            {{ row.slug }}
                                        </small>
                                    </td>

                                    <!-- Actions -->
                                    <td class="p-3">
                                        <div class="flex gap-2 justify-end">
                                            <Button @click="editProductCategory(row.id)" variant="outline"
                                                color="secondary">
                                                Edit
                                            </Button>
                                            <Button @click="deleteProductCategory(row.id)" variant="outline"
                                                color="error">
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            </template>

                            <!-- No Data -->
                            <tr v-else>
                                <td colspan="3" class="text-center py-4 text-sm text-gray-500">
                                    No results.
                                </td>
                            </tr>
                        </tbody>
                    </table>


                </div>
                <div class="flex items-center justify-between border-gray-200 py-4"><small
                        class="font-sans antialiased text-sm text-current">Page {{ productCategoryStore.totalPage != 0 ?
                            productCategoryStore.current
                            : productCategoryStore.totalPage }} of {{
                            productCategoryStore.totalPage }}</small>
                    <div class="flex gap-2"><button
                            class="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-1.5 px-3 shadow-sm hover:shadow bg-transparent border-gray-200 text-gray-800 hover:bg-gray-200"
                            data-shape="default" data-width="default" :disabled="productCategoryStore.current === 1"
                            @click="paginate(productCategoryStore.current - 1)">Previous</button><button
                            class="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-1.5 px-3 shadow-sm hover:shadow bg-transparent border-gray-200 text-gray-800 hover:bg-gray-200"
                            data-shape="default" data-width="default" :disabled="productCategoryStore.current >=
                                Math.ceil(productCategoryStore.totalData / productCategoryStore.perPage)
                                " @click="paginate(productCategoryStore.current + 1)">Next</button></div>
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

import { useProductCategoryStore } from "@/state/pinia";
import { showSuccessToast, showDeleteConfirmationDialog } from "@/helpers/alert.js";

const productCategoryStore = useProductCategoryStore();
const router = useRouter();
const productCategoryModalTitle = ref("");

const rows = ref([]);

const getProductCategory = async () => {
    try {
        await productCategoryStore.getCategories();
        rows.value = productCategoryStore.categories || [];
    } catch (error) {
        console.error(error);
    }
};

const searchData = async () => {
    await productCategoryStore.changePage(1);
    await getProductCategory();
};

const paginate = async (page) => {
    await productCategoryStore.changePage(page);
    await getProductCategory();
};

const addProductCategory = () => {
    productCategoryStore.openForm('add');
    router.push({ name: 'product-category-form' });
};

const editProductCategory = async (id) => {
    productCategoryStore.openForm('edit');
    router.push({ name: 'product-category-form', params: { id } });
    // await productCategoryStore.getCategoryById(id);
};

const deleteProductCategory = async (id) => {
    const isConfirmed = await showDeleteConfirmationDialog("Delete Product Category", "Are you sure you want to delete this product category?");

    if (isConfirmed) {
        await productCategoryStore.deleteCategory(id);
        await getProductCategory();
        showSuccessToast("Product category deleted successfully!");
    }
};

onMounted(() => {
    getProductCategory();
});

</script>