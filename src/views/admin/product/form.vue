<template>
    <Layout>
        <span v-if="action_button">
            <PageHeader title="Edit product" pageTitle="Edit product" />
        </span>
        <span v-else>
            <PageHeader title="Form Product" pageTitle="Product" />
        </span>
        <BCard>
            <BRow>
                <BCol lg="6" md="12">

                    <!-- Desktop Image Cropper -->
                    <div v-if="desktopImageEdit" class="mb-4">
                        <div class="preview d-flex">
                            <div class="delete-button" @click="clearDesktopImage">
                                <BButton class="btn btn-sm btn-danger"><i class="mdi mdi-delete-outline"></i></BButton>
                            </div>
                            <img :src="desktopImageEdit" alt="Desktop Image" class="mx-auto" />
                        </div>
                    </div>
                    <div v-else class="mb-4">
                        <ImageCropper :aspectRatio="1 / 1"
                            :uploadText="'Letakkan gambar desktop disini atau klik untuk mengunggah'"
                            @update:imageUrl="desktopImageUrl = $event" @update:croppedImageUrl="desktopCroppedImageUrl = $event;
                            formModel.photo_desktop = $event" />
                    </div>

                    <!-- Mobile Image Cropper -->
                    <div v-if="mobileImageEdit" class="mb-4">
                        <div class="preview d-flex">
                            <div class="delete-button" @click="clearMobileImage">
                                <BButton class="btn btn-sm btn-danger"><i class="mdi mdi-delete-outline"></i></BButton>
                            </div>
                            <img :src="mobileImageEdit" alt="Mobile Image" class="mx-auto" />
                        </div>
                    </div>
                    <div v-else class="mb-4">
                        <ImageCropper :aspectRatio="1 / 1"
                            :uploadText="'Letakkan gambar mobile disini atau klik untuk mengunggah'"
                            @update:imageUrl="mobileImageUrl = $event" @update:croppedImageUrl="mobileCroppedImageUrl = $event;
                            formModel.photo_mobile = $event" />
                    </div>

                    <BForm class="form-horizontal" role="form">
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
                                    id="form-category"
                                    :style="{ color: formModel.product_category_id === '' ? '#7c8094' : '' }">
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
                            <label class="col-md-2 col-form-label" for="form-category">Status</label>
                            <BCol md="10">
                                <BFormSelect class="form-select" v-model="formModel.is_available"
                                    :style="{ color: formModel.is_available === '' ? '#7c8094' : '' }">
                                    <BFormSelectOption :value="''" :disabled="true">Choose Status</BFormSelectOption>
                                    <BFormSelectOption value="1">Available</BFormSelectOption>
                                    <BFormSelectOption value="0">Unavailable</BFormSelectOption>
                                </BFormSelect>


                            </BCol>
                        </BRow>


                        <BRow class="mb-3">
                            <label class="col-md-2 col-form-label" for="form-name">Price</label>
                            <BCol md="10">
                                <input type="number" class="form-control"
                                    :class="{ 'is-invalid': !!(errorList && errorList.price), }" id="form-name"
                                    placeholder="Enter Price" v-model="formModel.price" />
                                <template v-if="!!(errorList && errorList.price)">
                                    <div class="invalid-feedback" v-for="(err, index) in errorList.price" :key="index">
                                        <span>{{ err }}</span>
                                    </div>
                                </template>
                            </BCol>
                        </BRow>
                        <BRow class="mb-3">
                            <label class="col-md-2 col-form-label" for="form-name">Description</label>
                            <BCol md="10">
                                <input class="form-control" id="form-description" placeholder="Enter Description"
                                    v-model="formModel.description"
                                    :class="{ 'is-invalid': !!(errorList && errorList.description) }" />


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


                <BCol lg="6" md="12">
                    <div class="table-responsive">
                        <BTableSimple class="align-middle dt-responsive nowrap w-100 table-check" id="product-list">
                            <BThead>
                                <BTr>
                                    <BTh scope="col">
                                        <span class="d-flex justify-content-center">
                                            <BButton class="btn btn-sm btn-soft-info" @click="addDetail"><i
                                                    class="mdi mdi-plus"></i>
                                            </BButton>
                                        </span>
                                    </BTh>
                                    <BTh scope="col">Type</BTh>
                                    <BTh scope="col">Description</BTh>
                                    <BTh scope="col">Price</BTh>
                                </BTr>
                            </BThead>
                            <BTbody>
                                <BTr v-for="(detail, i) in details" :key="i">
                                    <BTh>
                                        <span class="d-flex justify-content-center">
                                            <BButton @click="removeRow(detail.id, i)"
                                                class="btn btn-sm btn-soft-danger">
                                                <i class="mdi mdi-minus"></i>
                                            </BButton>
                                        </span>
                                    </BTh>
                                    <BTh>
                                        <input class="form-control" v-model="detail.type"
                                            :class="{ 'is-invalid': !!(errorList && errorList[`details.${i}.type`]) }"
                                            placeholder="Enter Type" />
                                        <template v-if="!!(errorList && errorList[`details.${i}.type`])">
                                            <div class="invalid-feedback"
                                                v-for="(err, index) in errorList[`details.${i}.type`]" :key="index">
                                                <span>{{ err }}</span>
                                            </div>
                                        </template>
                                    </BTh>
                                    <BTh>
                                        <input class="form-control" v-model="detail.description"
                                            :class="{ 'is-invalid': !!(errorList && errorList[`details.${i}.description`]) }"
                                            placeholder="Enter Description" />
                                        <template v-if="!!(errorList && errorList[`details.${i}.description`])">
                                            <div class="invalid-feedback"
                                                v-for="(err, index) in errorList[`details.${i}.description`]"
                                                :key="index">
                                                <span>{{ err }}</span>
                                            </div>
                                        </template>
                                    </BTh>
                                    <BTh>
                                        <input class="form-control" v-model="detail.price" type="number"
                                            :class="{ 'is-invalid': !!(errorList && errorList[`details.${i}.price`]) }"
                                            placeholder="Enter Price" />
                                        <template v-if="!!(errorList && errorList[`details.${i}.price`])">
                                            <div class="invalid-feedback"
                                                v-for="(err, index) in errorList[`details.${i}.price`]" :key="index">
                                                <span>{{ err }}</span>
                                            </div>
                                        </template>
                                    </BTh>
                                </BTr>
                            </BTbody>
                        </BTableSimple>
                    </div>
                </BCol>

            </BRow>

            <BCardFooter>
                <div class="d-flex justify-content-end">
                    <span>
                        <BButton variant="secondary" class="me-2"
                            @click="router.push({ name: 'product' }); productStore.resetState()">Kembali
                        </BButton>
                        <BButton variant="primary" @click="addEditProduct">Simpan</BButton>
                    </span>
                </div>
            </BCardFooter>
        </BCard>


    </Layout>
</template>

<script setup>

import Layout from "@/layouts/main";
import PageHeader from "@/components/page-header";
import ImageCropper from "@/components/widgets/cropper";
import { useProductCategoryStore, useProductStore } from "@/state/pinia";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { showSuccessToast, showErrorToast, } from "@/helpers/alert.js";
import { useProgress } from "@/helpers/progress"; // Import custom progress function
import { useRouter } from "vue-router";

const router = useRouter();
const categoryStore = useProductCategoryStore()
const productStore = useProductStore()

const details = ref([
    {
        type: '',
        description: '',
        price: '',
        is_added: true
    }
])

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
const statusCode = computed(() => productStore.response.status)
const errorList = computed(() => productStore.response?.list || {})
const errorMessage = computed(() => productStore.response?.message || "")

const productById = computed(() => productStore.productById || {})

const action = computed(() => productStore.formAction.action);
const { startProgress, finishProgress, failProgress } = useProgress();

const watchAction = () => {
    if (action.value === 'edit') {
        action_button.value = 'Change';

        // Old data
        let product = productById.value;

        // console.log("product", product);

        details.value = product.details.map(detail => ({
            ...detail,
            is_updated: true
        }));

        if (product.photo_desktop) {
            desktopImageEdit.value = product.photo_desktop;
        } else {
            desktopImageEdit.value = '';
        }

        if (product.photo_mobile) {
            mobileImageEdit.value = product.photo_mobile;
        } else {
            mobileImageEdit.value = '';
        }

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
};

const clearMobileImage = () => {
    mobileImageEdit.value = '';
    formModel.photo_mobile = '';
};

const category = computed(() => categoryStore.categories)

const getCategory = async () => {
    await categoryStore.getCategories()
}

const updateCategory = (selectedCategory) => {
    formModel.product_category_id = selectedCategory.id;
    formModel.product_category_name = selectedCategory.product_category_name;
};

const addDetail = () => {
    details.value.push({
        description: '',
        type: '',
        price: '',
        is_added: true
    })
}

const addEditProduct = async () => {
    console.log("formModel", formModel);

    if (formModel.id) {
        startProgress();
        await productStore.updateProduct(formModel)
        if (statusCode.value != 200) {
            showErrorToast("Failed to update product", errorMessage.value);
            failProgress();
        } else {
            router.push({ name: 'product' });
            showSuccessToast("Product updated successfully!");
            finishProgress();
        }
    } else {
        startProgress();
        await productStore.addProduct(formModel)
        if (statusCode.value != 200) {
            showErrorToast("Failed to add product", errorMessage.value);
            failProgress();
        } else {
            router.push({ name: 'product' });
            showSuccessToast("Product added successfully!");
            finishProgress();
        }
    }
}

const removeRow = (id, index) => {
    details.value.splice(index, 1);
    formModel.details_deleted.push({
        id
    })
}

onMounted(async () => {
    await getCategory()
    watchAction()
})
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
    top: 10px;
    right: 10px;
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