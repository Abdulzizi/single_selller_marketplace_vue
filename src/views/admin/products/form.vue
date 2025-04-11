<template>
    <Layout>

        <div v-if="isLoading" class="fixed inset-0 bg-white bg-opacity-80 z-50 flex justify-center items-center">
            <div class="animate-spin rounded-full h-20 w-20 border-t-8 border-blue-600"></div>
        </div>

        <h1 class="text-2xl font-bold">{{ $route.params.id ? 'Edit Product' : 'Add Product' }}</h1>

        <form @submit.prevent="submitform" class="flex flex-col gap-6">
            <!-- Images Section -->
            <div class="w-full flex flex-col lg:flex-row gap-6">
                <div class="w-full lg:w-1/2 space-y-6">
                    <div>
                        <label class="block font-semibold mb-1">Desktop Image</label>
                        <ImageCropper v-model:croppedImageUrl="croppedDesktopImage" :imageUrl="desktopImageUrl" />
                    </div>

                    <div>
                        <label class="block font-semibold mb-1">Mobile Image</label>
                        <ImageCropper v-model:croppedImageUrl="croppedMobileImage" :imageUrl="mobileImageUrl" />
                    </div>
                </div>

                <!-- Inputs Section -->
                <div class="w-full lg:w-1/2 space-y-6">
                    <!-- Name -->
                    <div>
                        <label class="block font-semibold mb-1" for="name">Name</label>
                        <Input id="name" v-model="formModel.name" placeholder="Product name"
                            :class="inputClass('name')" />
                        <p v-if="fieldError('name')" class="text-red-500 text-sm mt-1">{{ fieldError('name') }}</p>
                    </div>

                    <!-- Price -->
                    <div>
                        <label class="block font-semibold mb-1" for="price">Price</label>
                        <Input id="price" v-model="formModel.price" type="number" placeholder="Product price"
                            :class="inputClass('price')" />
                        <p v-if="fieldError('price')" class="text-red-500 text-sm mt-1">{{ fieldError('price') }}</p>
                    </div>

                    <!-- Availability -->
                    <div>
                        <label class="block font-semibold mb-1" for="availability">Availability</label>
                        <Select id="availability" v-model="formModel.is_available" :options="availabilityOptions" />
                        <p class="text-xs text-gray-500 mt-1">Selected: {{ formModel.is_available }}</p>

                    </div>

                    <!-- Category -->
                    <div>
                        <label class="block font-semibold mb-1" for="category">Category</label>
                        <Select id="category" placeholder="Choose category" v-model="formModel.product_category_id"
                            :options="categories" :class="inputClass('product_category_id')" />
                        <p v-if="fieldError('product_category_id')" class="text-red-500 text-sm mt-1">
                            {{ fieldError('product_category_id') }}
                        </p>
                        <p v-if="fieldError('category')" class="text-red-500 text-sm mt-1">{{ fieldError('category') }}
                        </p>
                    </div>

                    <!-- Description -->
                    <div>
                        <label class="block font-semibold mb-1" for="description">Description</label>
                        <Input id="description" v-model="formModel.description" type="textarea"
                            placeholder="Product description" />
                    </div>
                </div>
            </div>

            <!-- Product Details Section -->
            <div class="border-t pt-6 mt-4 space-y-4">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-lg font-semibold">Product Details</h3>
                    <Button variant="secondary" size="sm" @click="addDetail">
                        <i class="mdi mdi-plus mr-1"></i> Add Detail
                    </Button>
                </div>

                <div class="space-y-4">
                    <div v-if="formModel.details.length > 0" class="space-y-4">
                        <div v-for="(detail, index) in formModel.details" :key="index"
                            class="grid grid-cols-12 gap-4 items-start p-4 border border-gray-200 rounded-lg shadow-sm">
                            <div class="col-span-12 md:col-span-3">
                                <label :for="`type-${index}`" class="block font-semibold mb-1">Type</label>
                                <Input :id="`type-${index}`" v-model="detail.type" placeholder="Type" />
                            </div>

                            <div class="col-span-12 md:col-span-6">
                                <label :for="`description-${index}`"
                                    class="block font-semibold mb-1">Description</label>
                                <Input :id="`description-${index}`" v-model="detail.description"
                                    placeholder="Description" />
                            </div>

                            <div class="col-span-12 md:col-span-2">
                                <label :for="`price-${index}`" class="block font-semibold mb-1">Price</label>
                                <Input :id="`price-${index}`" v-model="detail.price" type="number"
                                    placeholder="Price" />
                            </div>

                            <div class="col-span-12 h-full md:col-span-1 flex items-end justify-center">
                                <Button color="error" size="sm" @click="removeDetail(index)">
                                    <Icon :icon="mdiCancel" />
                                </Button>
                            </div>
                        </div>

                        <div v-if="Object.keys(errors.details || {}).length" class="text-red-500 text-sm">
                            <span v-for="(err, index2) in errors.details" :key="index2">
                                {{ err }}
                            </span>
                        </div>
                    </div>

                    <div v-else class="text-center text-gray-400 italic py-8 border border-dashed rounded-lg">
                        No product details added.
                    </div>
                </div>
            </div>

            <!-- Submit and Back Buttons -->
            <div class="flex justify-end gap-4 mt-8 text-lg">
                <Button type="button" color="secondary" class="text-lg px-6 py-3" @click="backToList">
                    Back
                </Button>
                <Button @click="submitform" class="text-lg px-6 py-3">
                    Submit
                </Button>
            </div>
        </form>

        <Toaster />
    </Layout>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import Layout from "@/layouts/main.vue";
import Select from "@/components/widgets/Select";
import Button from "@/components/widgets/Button";
import Input from "@/components/widgets/Input";
import ImageCropper from "@/components/widgets/Cropper";
import Icon from "@/components/widgets/Icon";
import { mdiCancel } from "@mdi/js";
import { Toaster, toast } from "vue-sonner";

import { useProductStore, useProductCategoryStore } from "@/state/pinia";
import { getProgressInstance } from "@/helpers/progress";

const router = useRouter();
const route = useRoute();
const progress = getProgressInstance();

const productStore = useProductStore();
const categoryStore = useProductCategoryStore();

const formModel = reactive({
    id: null,
    name: "",
    price: null,
    is_available: true,
    description: "",
    product_category_id: null,
    details: [],
});

const errors = reactive({});
const isLoading = ref(false);
const categories = ref([]);
const availabilityOptions = [
    { value: true, label: "Available" },
    { value: false, label: "Not Available" },
];

const croppedDesktopImage = ref(null);
const croppedMobileImage = ref(null);
const desktopImageUrl = ref(null);
const mobileImageUrl = ref(null);

const fetchCategories = async () => {
    await categoryStore.getCategories();
    categories.value = categoryStore.categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
    }));
};

const fetchProduct = async () => {
    if (route.params.id) {
        progress.start();
        isLoading.value = true;

        await productStore.getProductById(route.params.id);
        const data = productStore.productById;

        Object.assign(formModel, {
            id: data.id,
            name: data.name,
            price: data.price,
            is_available: data.is_available,
            product_category_id: data.product_category_id,
            description: data.description,
            details: data.details || [],
        });

        desktopImageUrl.value = data.photo_desktop_url;
        mobileImageUrl.value = data.photo_mobile_url;

        isLoading.value = false;
        progress.finish();
    }
};

const addOrEditProduct = async () => {
    progress.start();
    isLoading.value = true;
    errors.details = {};

    const detailsWithFlags = formModel.details.map((detail) => {
        return {
            ...detail,
            is_added: !detail.id, // true if it doesn't have an id
            is_updated: !!detail.id, // true if it has an id
        };
    });

    const payload = {
        ...formModel,
        details: detailsWithFlags,
        photo_desktop: croppedDesktopImage.value || desktopImageUrl.value,
        photo_mobile: croppedMobileImage.value || mobileImageUrl.value,
    };

    try {
        // console.log(`Payload: ${JSON.stringify(payload, null, 2)}`);

        if (route.params.id) {
            await productStore.updateProduct(payload);
        } else {
            await productStore.addProduct(payload);
        }

        if (productStore.response?.status === 200) {
            progress.finish();
            toast.success(`Product ${route.params.id ? "updated" : "created"} successfully`);
            productStore.resetState();
            router.push({ name: "admin-product-list" });
        } else {
            progress.fail();
            toast.error("There was an error with your submission");
            Object.assign(errors, productStore.response?.list || {});
            isLoading.value = false;
        }
    } catch (err) {
        const res = err.response?.data;
        progress.fail();
        toast.error("There was an error with your submission");
        if (res?.errors) Object.assign(errors, res.errors);
    } finally {
        isLoading.value = false;
    }
};

const submitform = () => {
    addOrEditProduct();
};

const fieldError = (field) => errors?.[field] || "";

const inputClass = (field) => (fieldError(field) ? "border-red-500" : "");

const addDetail = () => {
    formModel.details.push({
        type: "",
        description: "",
        price: null,
    });
};

const removeDetail = (index) => {
    formModel.details.splice(index, 1);
};

const backToList = () => {
    router.push({ name: "admin-product-list" });
    productStore.resetState();
};

onMounted(async () => {
    await fetchCategories();
    await fetchProduct();
});
</script>
