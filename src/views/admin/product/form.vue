<template>
    <Layout>
        <span v-if="action_button">
            <PageHeader title="Edit product" pageTitle="Edit product" />
        </span>
        <span v-else>
            <PageHeader title="Form Product" pageTitle="Product" />
        </span>

        <BCard>
            <!-- Image Uploaders in the Same Row -->
            <BRow class="mb-4 align-items-start">
                <!-- Desktop Image Uploader -->
                <BCol md="6">
                    <div v-if="desktopImageEdit" class="preview-container">
                        <div class="preview d-flex">
                            <div class="delete-button" @click="clearDesktopImage">
                                <BButton class="btn btn-sm btn-danger"><i class="mdi mdi-delete-outline"></i></BButton>
                            </div>
                            <img :src="desktopImageEdit" alt="Desktop Image" class="mx-auto" />
                        </div>
                    </div>
                    <div v-else>
                        <ImageCropper :aspectRatio="1 / 1"
                            uploadText="Letakkan gambar desktop disini atau klik untuk mengunggah"
                            @update:imageUrl="desktopImageUrl = $event"
                            @update:croppedImageUrl="desktopCroppedImageUrl = $event; formModel.photo_desktop = $event" />
                    </div>
                </BCol>

                <!-- Mobile Image Uploader -->
                <BCol md="6">
                    <div v-if="mobileImageEdit" class="preview-container">
                        <div class="preview d-flex">
                            <div class="delete-button" @click="clearMobileImage">
                                <BButton class="btn btn-sm btn-danger"><i class="mdi mdi-delete-outline"></i></BButton>
                            </div>
                            <img :src="mobileImageEdit" alt="Mobile Image" class="mx-auto" />
                        </div>
                    </div>
                    <div v-else>
                        <ImageCropper :aspectRatio="1 / 1"
                            uploadText="Letakkan gambar mobile disini atau klik untuk mengunggah"
                            @update:imageUrl="mobileImageUrl = $event"
                            @update:croppedImageUrl="mobileCroppedImageUrl = $event; formModel.photo_mobile = $event" />
                    </div>
                </BCol>
            </BRow>

            <!-- Form Fields Below the Image Uploaders -->
            <BRow>
                <BCol md="12">
                    <BForm class="form-horizontal">
                        <BRow class="mb-3">
                            <label class="col-md-2 col-form-label" for="form-name">Product Name</label>
                            <BCol md="10">
                                <input class="form-control" :class="{ 'is-invalid': !!(errorList && errorList.name) }"
                                    id="form-name" placeholder="Enter Product Name" v-model="formModel.name" />
                                <template v-if="!!(errorList && errorList.name)">
                                    <div class="invalid-feedback" v-for="(err, index) in errorList.name" :key="index">
                                        <span>{{ err }}</span>
                                    </div>
                                </template>
                            </BCol>
                        </BRow>

                        <BRow class="mb-3">
                            <label class="col-md-2 col-form-label" for="form-category">Category</label>
                            <BCol md="10">
                                <BFormSelect class="form-select" v-model="formModel.product_category_id"
                                    :class="{ 'is-invalid': !!(errorList && errorList.product_category_id) }"
                                    id="form-category">
                                    <BFormSelectOption :value="''" :disabled="true">Choose Category</BFormSelectOption>
                                    <BFormSelectOption @change="updateCategory(cat)" v-for="cat in category" :key="cat"
                                        :value="cat.id">
                                        {{ cat.name }}
                                    </BFormSelectOption>
                                </BFormSelect>
                                <template v-if="!!(errorList && errorList.product_category_id)">
                                    <div class="invalid-feedback" v-for="(err, index) in errorList.product_category_id"
                                        :key="index">
                                        <span>{{ err }}</span>
                                    </div>
                                </template>
                            </BCol>
                        </BRow>

                        <BRow class="mb-3">
                            <label class="col-md-2 col-form-label" for="form-price">Price</label>
                            <BCol md="10">
                                <input type="number" class="form-control"
                                    :class="{ 'is-invalid': !!(errorList && errorList.price) }" id="form-price"
                                    placeholder="Enter Price" v-model="formModel.price" />
                                <template v-if="!!(errorList && errorList.price)">
                                    <div class="invalid-feedback" v-for="(err, index) in errorList.price" :key="index">
                                        <span>{{ err }}</span>
                                    </div>
                                </template>
                            </BCol>
                        </BRow>

                        <BRow class="mb-3">
                            <label class="col-md-2 col-form-label" for="form-description">Description</label>
                            <BCol md="10">
                                <textarea class="form-control" id="form-description" placeholder="Enter Description"
                                    v-model="formModel.description"
                                    :class="{ 'is-invalid': !!(errorList && errorList.description) }"></textarea>
                                <template v-if="!!(errorList && errorList.description)">
                                    <div class="invalid-feedback" v-for="(err, index) in errorList.description"
                                        :key="index">
                                        <span>{{ err }}</span>
                                    </div>
                                </template>
                            </BCol>
                        </BRow>
                    </BForm>
                </BCol>


            </BRow>

            <BRow>
                <BCol md="12">
                    <h5 class="mt-4">Additional Product Details</h5>
                    <BTableSimple class="align-middle dt-responsive nowrap w-100 table-check">
                        <BThead>
                            <BTr>
                                <BTh scope="col" class="text-center">
                                    <BButton class="btn btn-sm btn-soft-info" @click="addDetail">
                                        <i class="mdi mdi-plus"></i>
                                    </BButton>
                                </BTh>
                                <BTh scope="col">Type</BTh>
                                <BTh scope="col">Description</BTh>
                                <BTh scope="col">Price</BTh>
                            </BTr>
                        </BThead>
                        <BTbody>
                            <BTr v-for="(detail, i) in details" :key="i">
                                <BTh class="text-center">
                                    <BButton @click="removeRow(detail.id, i)" class="btn btn-sm btn-soft-danger">
                                        <i class="mdi mdi-minus"></i>
                                    </BButton>
                                </BTh>
                                <BTh>
                                    <input class="form-control" v-model="detail.type"
                                        :class="{ 'is-invalid': !!errorList[`details.${i}.type`] }"
                                        placeholder="Enter Type" />
                                </BTh>
                                <BTh>
                                    <input class="form-control" v-model="detail.description"
                                        :class="{ 'is-invalid': !!errorList[`details.${i}.description`] }"
                                        placeholder="Enter Description" />
                                </BTh>
                                <BTh>
                                    <input class="form-control" v-model="detail.price" type="number"
                                        :class="{ 'is-invalid': !!errorList[`details.${i}.price`] }"
                                        placeholder="Enter Price" />
                                </BTh>
                            </BTr>
                        </BTbody>
                    </BTableSimple>
                </BCol>
            </BRow>

            <BRow>
                <div class="d-flex justify-content-end">
                    <BButton variant="secondary" class="me-2"
                        @click="router.push({ name: 'product' }); productStore.resetState()">
                        Kembali
                    </BButton>
                    <BButton variant="primary" @click="addEditProduct">Simpan</BButton>
                </div>
            </BRow>
        </BCard>
    </Layout>
</template>

<script setup>
import Layout from "@/layouts/main";
import PageHeader from "@/components/page-header";
import ImageCropper from "@/components/widgets/cropper";
import { useProductCategoryStore, useProductStore } from "@/state/pinia";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { showSuccessToast, showErrorToast } from "@/helpers/alert.js";
import { useProgress } from "@/helpers/progress";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const categoryStore = useProductCategoryStore();
const productStore = useProductStore();

const details = ref([
    {
        type: '',
        description: '',
        price: '',
        is_added: true
    }
]);

const desktopImageEdit = ref("");
const mobileImageEdit = ref("");
const desktopImageUrl = ref("");
const mobileImageUrl = ref("");
const desktopCroppedImageUrl = ref("");
const mobileCroppedImageUrl = ref("");

const formModel = reactive({
    id: '',
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

const action_button = ref();
const statusCode = computed(() => productStore.response.status);
const errorList = computed(() => productStore.response?.list || {});
const errorMessage = computed(() => productStore.response?.message || "");
const productById = computed(() => productStore.productById || {});
const action = computed(() => productStore.formAction.action);
const { startProgress, finishProgress, failProgress } = useProgress();

const watchAction = () => {
    if (action.value === 'edit') {
        action_button.value = 'Change';

        let product = productById.value;

        details.value = product.details.map(detail => ({
            ...detail,
            is_updated: true
        }));

        desktopImageEdit.value = product.photo_desktop || '';
        mobileImageEdit.value = product.photo_mobile || '';

        Object.assign(formModel, {
            id: product.id,
            name: product.name,
            product_category_id: product.product_category_id,
            product_category_name: product.product_category_name,
            is_available: product.is_available,
            price: String(product.price),
            description: product.description,
            photo_desktop: product.photo_desktop,
            photo_mobile: product.photo_mobile,
            details: details.value
        });

        console.log("formModel", formModel);
    }
};

watch(details, (newDetails) => {
    newDetails.forEach((detail, i) => {
        if (detail.description && errorList.value[`details.${i}.description`]) {
            delete errorList.value[`details.${i}.description`];
        }
        if (detail.type && errorList.value[`details.${i}.type`]) {
            delete errorList.value[`details.${i}.type`];
        }
        if (detail.price && errorList.value[`details.${i}.price`]) {
            delete errorList.value[`details.${i}.price`];
        }
    });
}, { deep: true });

watch(formModel, (newFormModel) => {
    if (newFormModel.name && errorList.value.name) {
        delete errorList.value.name;
    }
    if (newFormModel.product_category_id && errorList.value.product_category_id) {
        delete errorList.value.product_category_id;
    }
    if (newFormModel.price && errorList.value.price) {
        delete errorList.value.price;
    }
}, { deep: true });

const clearDesktopImage = () => {
    desktopImageEdit.value = '';
    formModel.photo_desktop = '';
    showSuccessToast("Desktop image removed successfully.");
};

const clearMobileImage = () => {
    mobileImageEdit.value = '';
    formModel.photo_mobile = '';
    showSuccessToast("Mobile image removed successfully.");
};

const category = computed(() => categoryStore.categories);

const getCategory = async () => {
    try {
        await categoryStore.getCategories();
    } catch (error) {
        showErrorToast("Failed to load categories.");
        console.error("Error Response:", error.response);
    }
};

const getProduct = async (id) => {
    try {
        await productStore.getProductById(id);
        const product = productStore.productById; // Get the product object from store

        desktopImageEdit.value = product.photo_desktop_url || "";
        mobileImageEdit.value = product.photo_mobile_url || "";
        if (product) {

            Object.assign(formModel, {
                id: product.id,
                name: product.name,
                product_category_id: product.product_category_id,
                product_category_name: product.product_category_name,
                is_available: product.is_available,
                price: String(product.price),
                description: product.description,
                photo_desktop: product.photo_desktop_url,
                photo_mobile: product.photo_mobile_url,
                details: product.details ? [...product.details] : [],
            });

            console.log("Updated formModel:", formModel);
        }
    } catch (error) {
        showErrorToast("Failed to load product.");
        console.error("Error Response:", error.response);
    }
};


const updateCategory = (selectedCategory) => {
    formModel.product_category_id = selectedCategory.id;
    formModel.product_category_name = selectedCategory.product_category_name;
    showSuccessToast("Category updated successfully.");
};

const addDetail = () => {
    details.value.push({
        description: '',
        type: '',
        price: '',
        is_added: true
    });
    showSuccessToast("New detail added.");
};

const addEditProduct = async () => {
    console.log("formModel", formModel);
    startProgress();

    if (formModel.id) {
        try {
            await productStore.updateProduct(formModel);
            if (statusCode.value === 200) {
                showSuccessToast("Product updated successfully!");
                router.push({ name: 'product' });
                finishProgress();
            } else {
                throw new Error(errorMessage.value);
            }
        } catch (error) {
            showErrorToast("Failed to update product", error.message);
            failProgress();
        }
    } else {
        try {
            await productStore.addProduct(formModel);
            if (statusCode.value === 200) {
                showSuccessToast("Product added successfully!");
                router.push({ name: 'product' });
                finishProgress();
            } else {
                throw new Error(errorMessage.value);
            }
        } catch (error) {
            showErrorToast("Failed to add product", error.message);
            failProgress();
        }
    }
};

const removeRow = (id, index) => {
    details.value.splice(index, 1);
    formModel.details_deleted.push({ id });
    showSuccessToast("Detail removed.");
};

onMounted(async () => {
    const id = route.params.id;
    if (id) {
        await getProduct(id);
    } else {
        showErrorToast("Product ID is missing.");
        router.push({ name: 'product' });
    }

    await getCategory();
    watchAction();
});
</script>


<style scoped lang="scss">
.preview {
    border: 2px dashed var(--bs-border-color) !important;
    border-radius: 6px;
    margin-top: 20px;
}


.preview img {
    max-width: 100%;
}

.delete-button {
    position: absolute;
    top: 20px;
    right: 15px;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
</style>