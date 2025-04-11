<template>
    <Layout>
        <div class="bg-white rounded-lg shadow">
            <div class="p-6">
                <div class="flex flex-col lg:flex-row gap-6">
                    <!-- Left Column - Form Fields -->
                    <div class="w-full lg:w-1/2">
                        <!-- Image Upload Area -->
                        <div class="mb-6 text-center">

                            <div v-if="formModel.photo_desktop && formModel.photo_mobile"
                                class="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
                                <button @click="clearImage"
                                    class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                    <i class="mdi mdi-delete-outline"></i>
                                </button>

                                <div class="flex flex-col lg:flex-row justify-center items-center gap-4">
                                    <div>
                                        <p class="text-sm font-semibold mb-1 text-center">Desktop Image</p>
                                        <img :src="formModel.photo_desktop" alt="Desktop Image"
                                            class="mx-auto max-h-48 object-contain rounded" />
                                    </div>
                                    <div>
                                        <p class="text-sm font-semibold mb-1 text-center">Mobile Image</p>
                                        <img :src="formModel.photo_mobile" alt="Mobile Image"
                                            class="mx-auto max-h-48 object-contain rounded" />
                                    </div>
                                </div>
                            </div>

                            <div v-else class="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                <label class="block text-lg font-medium text-gray-700 mb-1">Desktop Image</label>
                                <ImageCropper :aspectRatio="1 / 1"
                                    :uploadText="'Letakkan gambar disini atau klik untuk mengunggah'"
                                    @update:croppedImageUrl="handleCroppedImageDesktop" />

                                <label class="block mt-5 text-lg font-medium text-gray-700 mb-1">Mobile Image</label>
                                <ImageCropper :aspectRatio="1 / 1"
                                    :uploadText="'Letakkan gambar disini atau klik untuk mengunggah'"
                                    @update:croppedImageUrl="handleCroppedImageMobile" />
                            </div>
                        </div>

                        <!-- Form Fields -->
                        <div class="space-y-4">
                            <!-- Nama -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1" for="nama">Name</label>
                                <input id="name" type="text"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    :class="{ 'border-red-500': errorList?.name }" placeholder="Insert Product Name"
                                    v-model="formModel.name" />
                                <div v-if="errorList?.name" class="text-red-500 text-xs mt-1">
                                    <div v-for="(err, index) in errorList.name" :key="index">{{ err }}</div>
                                </div>
                            </div>

                            <!-- Kategori -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1"
                                    for="kategori">Category</label>
                                <div class="relative">
                                    <select id="category"
                                        class="w-full bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        :class="{ 'border-red-500': errorList?.product_category_id, 'text-gray-500': !formModel.product_category_id }"
                                        v-model="formModel.product_category_id" @change="updateCategory">
                                        <option value="" disabled>Choose Category</option>
                                        <option v-for="cat in category" :key="cat.id" :value="cat.id">
                                            {{ cat.name }}
                                        </option>
                                    </select>
                                    <div
                                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                <div v-if="errorList?.product_category_id" class="text-red-500 text-xs mt-1">
                                    <div v-for="(err, index) in errorList.product_category_id" :key="index">{{ err }}
                                    </div>
                                </div>
                            </div>

                            <!-- Status -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1"
                                    for="status">Availability</label>
                                <div class="relative">
                                    <select id="availability" placeholder="Choose Availability"
                                        class="w-full bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        :class="{ 'text-gray-500': !formModel.is_available }"
                                        v-model="formModel.is_available">
                                        <option value="" disabled>Choose Availability</option>
                                        <option value="1">Available</option>
                                        <option value="0">Unavailable</option>
                                    </select>
                                    <div
                                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <!-- Harga -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1" for="price">Price</label>
                                <input id="price" type="number"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    :class="{ 'border-red-500': errorList?.price }" placeholder="Insert Product Price"
                                    v-model="formModel.price" />
                                <div v-if="errorList?.price" class="text-red-500 text-xs mt-1">
                                    <div v-for="(err, index) in errorList.price" :key="index">{{ err }}</div>
                                </div>
                            </div>

                            <!-- Deskripsi -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1"
                                    for="description">Description</label>
                                <textarea id="description"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    :class="{ 'border-red-500': errorList?.description }"
                                    placeholder="Insert Product Description" v-model="formModel.description"
                                    rows="3"></textarea>
                                <div v-if="errorList?.description" class="text-red-500 text-xs mt-1">
                                    <div v-for="(err, index) in errorList.description" :key="index">{{ err }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column - Add-Ons -->
                    <div class="w-full lg:w-1/2 mt-6 lg:mt-0">
                        <div class="bg-gray-50 rounded-lg border border-gray-200">
                            <!-- Add-On Header -->
                            <div class="p-4 border-b border-gray-200">
                                <div class="flex justify-between w-full">
                                    <div class="flex items-center space-x-4">
                                        <span class="text-blue-500">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </span>
                                        <button @click="addDetail"
                                            class="text-blue-500 hover:text-blue-600 font-medium text-sm">
                                            Add On
                                        </button>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <div class="pe-28 text-start">
                                            <p>Tipe</p>
                                        </div>
                                        <div class="pe-24 text-start">
                                            <p>Harga</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Add-On Items -->
                            <div class="p-4 space-y-3">
                                <div v-if="details.length === 0" class="text-center py-4 text-gray-500 text-sm">
                                    There is no addon, please add one
                                </div>

                                <div v-for="(detail, i) in details" :key="detail.id || i"
                                    class="grid grid-cols-1 md:grid-cols-[auto_1fr_8rem_10rem] gap-2 items-center">

                                    <!-- Remove button -->
                                    <button @click="removeDetail(i)"
                                        class="flex-shrink-0 bg-red-100 text-red-500 rounded-full p-1 hover:bg-red-200 self-start">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M20 12H4" />
                                        </svg>
                                    </button>

                                    <!-- Description input -->
                                    <input type="text"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        :class="{ 'border-red-500': errorList?.[`details.${i}.description`] }"
                                        placeholder="Masukkan Add On" v-model="detail.description" />

                                    <!-- Additional (possibly duplicated) description input -->
                                    <input type="text"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        :class="{ 'border-red-500': errorList?.[`details.${i}.description`] }"
                                        placeholder="Masukkan Add On" v-model="detail.description" />

                                    <!-- Price input -->
                                    <input type="number"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        :class="{ 'border-red-500': errorList?.[`details.${i}.price`] }"
                                        placeholder="Put Add On Price" v-model="detail.price" />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="bg-white px-6 py-3 flex items-center justify-end gap-2 rounded-b-lg my-5 mr-5">
                <Button @click="cancelForm" color="secondary" class="mr-2">Back</Button>

                <Button @click="saveProduct" color="primary">Submit</Button>
            </div>
        </div>

        <Toaster />
    </Layout>
</template>

<script setup>
import Layout from "@/layouts/main";

import ImageCropper from "@/components/widgets/cropper";
import Button from "@/components/widgets/button";

import { useProductStore, useProductCategoryStore } from "@/state/pinia";
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

import { Toaster, toast } from "vue-sonner";
import { getProgressInstance } from "@/helpers/progress"; // Pastikan helper ini ada

const progress = getProgressInstance();
const router = useRouter();
const route = useRoute();
const categoryStore = useProductCategoryStore();
const productStore = useProductStore();

const details = ref([]);
const originalDesktopPhoto = ref('');
const originalMobilePhoto = ref('');

const isLoading = ref(false);
const formModel = reactive({
    id: '',
    name: '',
    product_category_id: '',
    is_available: '1',
    price: '',
    description: '',
    product_category_name: '',
    photo_desktop: '',
    photo_mobile: '',
    details: [],
    details_deleted: []
});

// Computed properties
const errorList = computed(() => productStore.response?.errors || {});
const errorMessage = computed(() => productStore.response?.message || "");
const isEditMode = computed(() => !!route.params.id);
const category = computed(() => categoryStore.categories);

// Methods
const getCategory = async () => {
    try {
        await categoryStore.getCategories();
    } catch (error) {
        toast.error("Gagal memuat kategori produk");
    }
};

const fetchProduct = async () => {
    try {
        if (route.params.id) {
            await productStore.getProductById(route.params.id);
        }
    } catch (error) {
        toast.error("Gagal memuat produk");
    }
};

const initEditForm = async () => {
    try {
        if (route.params.id) {
            await fetchProduct();
        }

        const product = productStore.productById;
        // console.log(JSON.stringify(product, null, 2));

        if (!product) return;

        originalDesktopPhoto.value = product.photo_desktop_url || '';
        originalMobilePhoto.value = product.photo_mobile_url || '';

        details.value = product.details?.map(detail => ({
            id: detail.id,
            description: detail.description,
            type: detail.type,
            price: String(detail.price),
            is_updated: false
        })) || [];

        let photoDesktopUrl = originalDesktopPhoto.value;
        let photoMobileUrl = originalMobilePhoto.value;

        if (photoDesktopUrl && !photoDesktopUrl.startsWith('http') && !photoDesktopUrl.startsWith('/')) {
            photoDesktopUrl = `${import.meta.env.VITE_API_BASE_URL}/${photoDesktopUrl}`;
        }

        if (photoMobileUrl && !photoMobileUrl.startsWith('http') && !photoMobileUrl.startsWith('/')) {
            photoMobileUrl = `${import.meta.env.VITE_API_BASE_URL}/${photoMobileUrl}`;
        }

        Object.assign(formModel, {
            id: product.id,
            name: product.name,
            product_category_id: product.product_category_id,
            is_available: String(product.is_available),
            price: String(product.price),
            description: product.description,
            product_category_name: product.product_category_name,
            photo_desktop: photoDesktopUrl,
            photo_mobile: photoMobileUrl,
            details: details.value
        });
    } catch (error) {
        toast.error("Gagal memuat produk");
        console.error("Error loading product:", error);
    }
};

const handleCroppedImageDesktop = (imageUrl) => {
    formModel.photo = imageUrl;
};

const handleCroppedImageMobile = (imageUrl) => {
    formModel.photo = imageUrl;
};

const clearImage = () => {
    formModel.photo_desktop = '';
    formModel.photo_mobile = '';
    originalDesktopPhoto.value = '';
    originalMobilePhoto.value = '';
};

const updateCategory = () => {
    const selectedCategory = category.value.find(cat => cat.id === formModel.product_category_id);
    if (selectedCategory) {
        formModel.product_category_name = selectedCategory.name;
    }
};

const addDetail = () => {
    details.value.push({
        description: '',
        type: '',
        price: '',
        is_added: true
    });
};

const removeDetail = (index) => {
    const detail = details.value[index];
    if (detail?.id) {
        formModel.details_deleted.push({ id: detail.id });
    }
    details.value.splice(index, 1);
};

const cancelForm = () => {
    productStore.resetState();
    router.push({ name: 'admin-product-list' });
};

const saveProduct = async () => {
    progress.start();
    isLoading.value = true;

    try {
        const detailsPayload = details.value.map(detail => ({
            ...detail,
            price: Number(detail.price),
            ...(detail.id ? { id: detail.id } : {})
        }));

        const deletedDetails = formModel.details_deleted.map(detail => ({
            id: detail.id,
            _delete: true
        }));

        const payload = {
            ...formModel,
            details: [...detailsPayload, ...deletedDetails],
            is_available: Number(formModel.is_available),
            price: Number(formModel.price),
            photo_desktop: formModel.photo_desktop !== originalDesktopPhoto.value ? formModel.photo_desktop : undefined,
            photo_mobile: formModel.photo_mobile !== originalMobilePhoto.value ? formModel.photo_mobile : undefined
        };

        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

        if (isEditMode.value) {
            await productStore.updateProduct(payload);
            toast.success("Product updated successfully", {
                position: "bottom-right",
                duration: 3000,
                class: "bg-green-500 text-white border-none shadow-lg",
            });
        } else {
            await productStore.addProduct(payload);
            toast.success("Product added successfully", {
                position: "bottom-right",
                duration: 3000,
                class: "bg-green-500 text-white border-none shadow-lg",
            });
        }

        // console.log(productStore.response.message);

        if (productStore.response.status === 200) {
            toast.success(productStore.response.message, {
                position: "bottom-right",
                duration: 3000,
                class: "bg-green-500 text-white border-none shadow-lg",
            });
        } else {
            toast.error(productStore.response.message, {
                position: "bottom-right",
                duration: 3000,
                class: "bg-red-500 text-white border-none shadow-lg",
            });
        }

        progress.finish();
        router.push({ name: 'admin-product-list' });
    } catch (error) {
        progress.fail();
        console.error("Error saving product:", error);
        toast.error(errorMessage);
    } finally {
        isLoading.value = false;
    }
};

onMounted(async () => {
    await getCategory();
    if (isEditMode.value) {
        await initEditForm();
    } else {
        addDetail();
    }
});
</script>