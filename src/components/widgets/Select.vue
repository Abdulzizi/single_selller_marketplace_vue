<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    modelValue: [String, Array, null], // Bisa single atau multiple select
    label: String,
    placeholder: String,
    options: Array, // Bisa berupa array string atau array objek [{ value: "", label: "" }]
    multiple: Boolean, // Jika true, multi-select aktif
    errors: Array,
});

const emit = defineEmits(["update:modelValue"]);
const isOpen = ref(false);
const searchQuery = ref("");

const normalizedModelValue = computed(() => {
    if (props.modelValue === "1") return true;
    if (props.modelValue === "0") return false;
    return props.modelValue;
});


// Filter opsi berdasarkan pencarian
const filteredOptions = computed(() => {
    return props.options.filter((option) => {
        const label = getOptionLabel(option).toLowerCase();
        return label.includes(searchQuery.value.toLowerCase());
    });
});

const selectedItems = computed(() => {
    const val = normalizedModelValue.value;
    return Array.isArray(val) ? val : [val].filter(v => v !== null && v !== undefined);
});

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
    searchQuery.value = ""; // Reset pencarian setiap kali dropdown dibuka
};

const selectItem = (option) => {
    if (props.multiple) {
        if (!selectedItems.value.includes(option.value)) {
            emit("update:modelValue", [...selectedItems.value, option.value]);
        } else {
            emit("update:modelValue", selectedItems.value.filter(v => v !== option.value));
        }
    } else {
        emit("update:modelValue", option.value);
        isOpen.value = false;
    }
};

const removeItem = (value) => {
    emit("update:modelValue", selectedItems.value.filter(v => v !== value));
};

const selectedLabels = computed(() => {
    return props.options
        .filter(opt => selectedItems.value.includes(opt.value))
        .map(opt => opt.label)
        .join(", ");
});

const getOptionLabel = (option) => {
    return typeof option === "string" ? option : option.label;
};

const getOptionValue = (option) => {
    return typeof option === "string" ? option : option.value;
};
</script>

<template>
    <div class="space-y-1.5">
        <label v-if="label" class="text-sm text-slate-800 font-bold capitalize">{{ label }}</label>
        <div class="relative">
            <!-- Select Box -->
            <div @click="toggleDropdown"
                class="w-full border border-slate-200 rounded-md py-2 px-2.5 text-sm shadow-sm flex items-center justify-between cursor-pointer hover:border-slate-800 focus:border-slate-800 focus:ring focus:ring-slate-800/10">
                <span class="truncate" v-if="selectedItems.length > 0">{{ selectedLabels }}</span>
                <span class="text-gray-400" v-else>{{ placeholder || "Pilih opsi..." }}</span>

                <svg class="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clip-rule="evenodd" />
                </svg>
            </div>

            <!-- Dropdown Options -->
            <div v-if="isOpen"
                class="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto">

                <!-- Search Input -->
                <div class="p-2">
                    <input type="text" v-model="searchQuery" placeholder="Cari..."
                        class="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-300">
                </div>

                <!-- Options List -->
                <div v-if="filteredOptions.length">
                    <div v-for="(option, index) in filteredOptions" :key="index"
                        class="px-3 py-2 text-sm hover:bg-gray-100 flex items-center cursor-pointer"
                        @click="selectItem({ value: getOptionValue(option), label: getOptionLabel(option) })">
                        <input v-if="multiple" type="checkbox" :checked="selectedItems.includes(getOptionValue(option))"
                            class="w-4 h-4 mr-2 text-blue-600">
                        {{ getOptionLabel(option) }}
                    </div>
                </div>

                <!-- No Results Found -->
                <div v-else class="px-3 py-2 text-sm text-gray-500">Tidak ada hasil ditemukan</div>
            </div>
        </div>

        <!-- Selected Items as Badges (Only for multiple select) -->
        <div v-if="multiple && selectedItems.length" class="flex flex-wrap gap-2 mt-2">
            <span v-for="(option, index) in options.filter(opt => selectedItems.includes(getOptionValue(opt)))"
                :key="index" class="flex items-center bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md">
                {{ getOptionLabel(option) }}
                <button type="button" class="ml-1 text-red-500" @click="removeItem(getOptionValue(option))">
                    ✕
                </button>
            </span>
        </div>

        <!-- Error Messages -->
        <div v-if="errors && errors.length" class="text-red-500 text-xs mt-1">
            <span v-for="(err, index) in errors" :key="index">{{ err }}</span>
        </div>
    </div>
</template>
