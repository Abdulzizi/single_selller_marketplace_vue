<template>
    <Layout>
        <template #header>
            <h2 class="text-xl font-bold">Add Product</h2>
        </template>

        <form @submit.prevent="submitForm" class="flex flex-col lg:flex-row gap-6">
            <!-- Left Column: Image -->
            <div class="w-full lg:w-1/2 space-y-6">
                <div>
                    <label class="block font-semibold mb-1">Desktop Image</label>
                    <ImageCropper />
                </div>

                <div>
                    <label class="block font-semibold mb-1">Mobile Image</label>
                    <ImageCropper />
                </div>
            </div>

            <!-- Right Column: Inputs -->
            <div class="w-full lg:w-1/2 space-y-6">
                <!-- Name -->
                <div>
                    <label class="block font-semibold mb-1" for="name">Name</label>
                    <Input id="name" v-model="form.name" placeholder="Product name" :class="inputClass('name')" />
                    <p v-if="fieldError('name')" class="text-red-500 text-sm mt-1">{{ fieldError('name') }}</p>
                </div>

                <!-- Price -->
                <div>
                    <label class="block font-semibold mb-1" for="price">Price</label>
                    <Input id="price" v-model="form.price" type="number" placeholder="Product price"
                        :class="inputClass('price')" />
                    <p v-if="fieldError('price')" class="text-red-500 text-sm mt-1">{{ fieldError('price') }}</p>
                </div>

                <!-- Description -->
                <div>
                    <label class="block font-semibold mb-1" for="description">Description</label>
                    <Input id="description" v-model="form.description" type="textarea"
                        placeholder="Product description" />
                </div>

                <!-- Availability -->
                <div>
                    <label class="block font-semibold mb-1" for="availability">Availability</label>
                    <Select id="availability" v-model="form.is_available" :options="availabilityOptions" />
                </div>

                <!-- Category -->
                <div>
                    <label class="block font-semibold mb-1" for="category">Category</label>
                    <Select id="category" v-model="form.category" :options="categories"
                        :class="inputClass('category')" />
                    <p v-if="fieldError('category')" class="text-red-500 text-sm mt-1">{{ fieldError('category') }}</p>
                </div>

                <!-- Submit Button -->
                <div class="text-right">
                    <Button type="submit" :isLoading="isSubmitting">Submit</Button>
                </div>
            </div>
        </form>
    </Layout>
</template>

<script setup>
import Layout from "@/layouts/main.vue";
import { ref, nextTick } from "vue";
import Select from "@/components/widgets/Select";
import Button from "@/components/widgets/Button";
import Input from "@/components/widgets/Input";
import ImageCropper from "@/components/widgets/Cropper";

const form = ref({
    name: '',
    price: '',
    description: '',
    is_available: null,
    category: null,
});

const isSubmitting = ref(false);
const errors = ref({});

const categories = [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Books', value: 'books' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Home', value: 'home' }
];

const availabilityOptions = [
    { label: 'Available', value: true },
    { label: 'Unavailable', value: false }
];

// Helper: get field-specific error
const fieldError = (field) => errors.value[field];

// Helper: add red border for fields with error
const inputClass = (field) => fieldError(field) ? 'border-red-500' : '';

const submitForm = async () => {
    errors.value = {};
    isSubmitting.value = true;

    // Manual validation
    if (!form.value.name) errors.value.name = 'Name is required.';
    if (!form.value.price) errors.value.price = 'Price is required.';
    if (!form.value.category) errors.value.category = 'Category is required.';

    if (Object.keys(errors.value).length === 0) {
        console.log("Submitted!", form.value);
        // Your API logic here
    } else {
        // Focus or scroll to first error field
        await nextTick(() => {
            const firstErrorKey = Object.keys(errors.value)[0];
            const el = document.getElementById(firstErrorKey);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    isSubmitting.value = false;
};
</script>