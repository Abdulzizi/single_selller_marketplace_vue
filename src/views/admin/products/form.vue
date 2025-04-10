<template>
    <Layout>
        <h1 class="text-2xl font-bold">{{ $route.params.id ? 'Edit Product' : 'Add Product' }}</h1>

        <form @submit.prevent="submitform" class="flex flex-col gap-6">
            <!-- Images Section -->
            <div class="w-full flex flex-col lg:flex-row gap-6">
                <div class="w-full lg:w-1/2 space-y-6">
                    <div>
                        <label class="block font-semibold mb-1">Desktop Image</label>
                        <ImageCropper v-model:croppedImageUrl="croppedDesktopImage" />
                    </div>

                    <div>
                        <label class="block font-semibold mb-1">Mobile Image</label>
                        <ImageCropper v-model:croppedImageUrl="croppedMobileImage" />
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
                    </div>

                    <!-- Category -->
                    <div>
                        <label class="block font-semibold mb-1" for="category">Category</label>
                        <Select id="category" v-model="formModel.product_category_id" :options="categories"
                            :class="inputClass('product_category_id')" />
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
                <Button type="submit" class="text-lg px-6 py-3">
                    Submit
                </Button>
            </div>
        </form>

        <Toaster />
    </Layout>
</template>

<script setup>
import Layout from "@/layouts/main.vue";
import { ref, nextTick, onMounted } from "vue";

import Select from "@/components/widgets/Select";
import Button from "@/components/widgets/Button";
import Input from "@/components/widgets/Input";
import ImageCropper from "@/components/widgets/Cropper";
import Icon from "@/components/widgets/Icon";
import { mdiCancel } from "@mdi/js";
import { getProgressInstance } from "@/helpers/progress";
import { Toaster, toast } from "vue-sonner";

import { useProductCategoryStore, useProductStore } from "@/state/pinia";
import { useRouter } from "vue-router";

const croppedDesktopImage = ref("");
const croppedMobileImage = ref("")

const progress = getProgressInstance();
const details = ref([
    {
        type: '',
        description: '',
        price: '',
        is_added: true
    }
]);

const formModel = ref({
    // id: '',
    name: '',
    product_category_id: '',
    product_category_name: '',
    is_available: '',
    price: '',
    description: '',
    photo_desktop: '',
    photo_mobile: '',
    details: details.value,
    details_deleted: []
});

const categories = ref([]);
const productCategoryStore = useProductCategoryStore();
const productStore = useProductStore();

const router = useRouter();
const isSubmitting = ref(false);
const errors = ref({});

const backToList = () => {
    router.push({ name: 'admin-product-list' });
}

const availabilityOptions = [
    { label: 'Available', value: true },
    { label: 'Unavailable', value: false }
];

const fieldError = (field) => errors.value[field];
const inputClass = (field) => fieldError(field) ? 'border-red-500' : '';

const addDetail = () => {
    formModel.value.details.push({ type: '', description: '', price: '' });
};

const removeDetail = (index) => {
    toast.success("Product Detail Deleted",
        {
            position: "bottom-right",
            duration: 3000,
            class: "bg-green-500 text-white border-none shadow-lg",
        });
    formModel.value.details.splice(index, 1);
};

const getProductCategories = async () => {
    await productCategoryStore.getCategories();

    if (productCategoryStore.categories) {
        categories.value = productCategoryStore.categories.map(cat => ({
            label: cat.name,
            value: cat.id
        }));
        // console.log(`Mapped Categories: ${JSON.stringify(categories.value)}`);
    } else {
        categories.value = [];
    }
};

const submitform = async () => {
    progress.start(); // Start progress
    errors.value = {};
    isSubmitting.value = true;

    // Assign cropped images to formModel
    formModel.value.photo_desktop = croppedDesktopImage.value;
    formModel.value.photo_mobile = croppedMobileImage.value;

    // Basic validation
    if (!formModel.value.name) errors.value.name = 'Name is required.';
    if (!formModel.value.price) errors.value.price = 'Price is required.';
    if (!formModel.value.product_category_id) errors.value.product_category_id = 'Category is required.';

    if (Object.keys(errors.value).length === 0) {
        const payload = {
            name: formModel.value.name,
            product_category_id: formModel.value.product_category_id,
            product_category_name: formModel.value.product_category_name,
            is_available: formModel.value.is_available ? 1 : 0,
            price: parseFloat(formModel.value.price),
            description: formModel.value.description,
            photo_desktop: formModel.value.photo_desktop,
            photo_mobile: formModel.value.photo_mobile,
            details: formModel.value.details.map(d => ({
                type: d.type,
                description: d.description,
                price: parseFloat(d.price),
                is_added: d.is_added ?? true
            })),
            details_deleted: formModel.value.details_deleted ?? []
        };

        console.log('Payload:', payload);

        try {
            const id = router.currentRoute.value.params.id;
            if (id) {
                await productStore.updateProduct(id, payload);
                toast.success("Product Updated", {
                    description: "You have successfully updated the product.",
                    position: "bottom-right",
                    duration: 3000,
                    class: "bg-green-500 text-white border-none shadow-lg",
                });
            } else {
                await productStore.addProduct(payload);
                toast.success("Product Added", {
                    description: "You have successfully added a new product.",
                    position: "bottom-right",
                    duration: 3000,
                    class: "bg-green-500 text-white border-none shadow-lg",
                });
            }

            progress.finish();
            router.push({ name: 'admin-product-list' });

        } catch (e) {
            progress.fail();
            errors.value = e.response?.data?.errors || {};

            toast.error("Something went wrong", {
                description: e.response?.data?.message || "Please check the form and try again.",
                position: "bottom-right",
                duration: 3000,
                class: "bg-red-500 text-white border-none shadow-lg",
            });
        }
    } else {
        progress.fail();
        await nextTick(() => {
            const firstErrorKey = Object.keys(errors.value)[0];
            const el = document.getElementById(firstErrorKey);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });

        toast.error("Form Incomplete", {
            description: "Please fill out the required fields.",
            position: "bottom-right",
            duration: 3000,
            class: "bg-yellow-500 text-white border-none shadow-lg",
        });
    }

    isSubmitting.value = false;
};

const loadProduct = async (id) => {
    try {
        const product = await productStore.getProductById(id);

        formModel.value = {
            name: product.name,
            product_category_id: product.product_category_id,
            product_category_name: product.product_category_name || '',
            is_available: !!product.is_available,
            price: product.price,
            description: product.description || '',
            photo_desktop: product.photo_desktop || '',
            photo_mobile: product.photo_mobile || '',
            details: product.details?.map(detail => ({
                ...detail,
                is_updated: true
            })) || [],
            details_deleted: []
        };

        croppedDesktopImage.value = product.photo_desktop;
        croppedMobileImage.value = product.photo_mobile;

    } catch (error) {
        toast.error("Failed to load product", {
            description: error?.response?.data?.message || "Something went wrong.",
            position: "bottom-right",
            class: "bg-red-500 text-white border-none shadow-lg",
        });
    }
};

onMounted(async () => {
    getProductCategories();

    const id = router.currentRoute.value.params.id;
    if (id) {
        await loadProduct(id);
    }

})
</script>