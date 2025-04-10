<script setup>
import { ref, computed, useAttrs } from "vue";
import { mdiEye, mdiEyeOff } from "@mdi/js";

const $attrs = useAttrs();

const props = defineProps({
    modelValue: [String, Number, Boolean, Array],
    label: String,
    type: String, // "textarea", "checkbox", "select", "radio", "password"
    placeholder: String,
    options: Array, // Untuk select, radio, dan checkbox (jika multiple)
    errors: Array,
});

const emit = defineEmits(["update:modelValue"]);
const showPassword = ref(false);
const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};

const computedModelValue = computed(() => {
    return Array.isArray(props.modelValue) ? props.modelValue : [];
});
</script>

<template>
    <div class="space-y-1.5">
        <label v-if="label" class="text-sm text-slate-800 font-bold capitalize">{{ label }}</label>
        <div class="relative">

            <!-- Textarea -->
            <textarea v-if="type === 'textarea'" v-bind="$attrs" :placeholder="placeholder" :value="modelValue"
                @input="emit('update:modelValue', $event.target.value)" :class="[
                    $attrs.class,
                    'w-full rounded-xl bg-slate-50 py-2 px-3 text-sm shadow-sm placeholder-slate-400 transition border border-slate-200 hover:border-slate-800 focus:outline-none focus:ring focus:ring-slate-800/10 focus:border-slate-800'
                ]" />

            <!-- Checkbox (Multiple) -->
            <div v-else-if="type === 'checkbox' && options" class="flex flex-col gap-1.5">
                <label v-for="(option, index) in options" :key="index"
                    class="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" v-bind="$attrs" :value="option.value"
                        :checked="computedModelValue.includes(option.value)" @change="
                            $event.target.checked
                                ? emit('update:modelValue', [...computedModelValue, option.value])
                                : emit('update:modelValue', computedModelValue.filter(v => v !== option.value))
                            " class="w-4 h-4 text-slate-800 border-gray-300 rounded focus:ring focus:ring-slate-800/30" />
                    <span>{{ option.label }}</span>
                </label>
            </div>

            <!-- Checkbox (Single) -->
            <div v-else-if="type === 'checkbox'" class="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" v-bind="$attrs" :checked="modelValue"
                    @change="emit('update:modelValue', $event.target.checked)"
                    class="w-4 h-4 text-slate-800 border-gray-300 rounded focus:ring focus:ring-slate-800/30" />
                <span>{{ label }}</span>
            </div>

            <!-- Select -->
            <select v-else-if="type === 'select'" v-bind="$attrs" :value="modelValue"
                @change="emit('update:modelValue', $event.target.value)" :class="[
                    $attrs.class,
                    'w-full rounded-xl bg-slate-50 py-2 px-3 text-sm shadow-sm placeholder-slate-400 transition border border-slate-200 hover:border-slate-800 focus:outline-none focus:ring focus:ring-slate-800/10 focus:border-slate-800'
                ]">
                <option disabled selected value="">Pilih salah satu</option>
                <option v-for="(option, index) in options" :key="index" :value="option.value">
                    {{ option.label }}
                </option>
            </select>

            <!-- Radio -->
            <div v-else-if="type === 'radio'" class="flex flex-col gap-1.5">
                <label v-for="(option, index) in options" :key="index"
                    class="flex items-center gap-2 text-sm text-slate-700">
                    <input type="radio" v-bind="$attrs" :value="option.value" :checked="modelValue === option.value"
                        @change="emit('update:modelValue', option.value)"
                        class="w-4 h-4 text-slate-800 border-gray-300 focus:ring focus:ring-slate-800/30" />
                    <span>{{ option.label }}</span>
                </label>
            </div>

            <!-- Password -->
            <div v-else-if="type === 'password'" class="relative">
                <input v-bind="$attrs" :type="showPassword ? 'text' : 'password'" :placeholder="placeholder"
                    :value="modelValue" @input="emit('update:modelValue', $event.target.value)" :class="[
                        $attrs.class,
                        'w-full rounded-xl bg-slate-50 py-2 px-3 text-sm shadow-sm placeholder-slate-400 transition border border-slate-200 hover:border-slate-800 focus:outline-none focus:ring focus:ring-slate-800/10 focus:border-slate-800'
                    ]" />
                <button type="button" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                    @click="togglePasswordVisibility">
                    <svg class="h-5 w-5" viewBox="0 0 24 24">
                        <path :d="showPassword ? mdiEyeOff : mdiEye" fill="currentColor" />
                    </svg>
                </button>
            </div>

            <!-- Default Input -->
            <input v-else v-bind="$attrs" :type="type" :placeholder="placeholder" :value="modelValue"
                @input="emit('update:modelValue', $event.target.value)" :class="[
                    $attrs.class,
                    'w-full rounded-xl bg-slate-50 py-2 px-3 text-sm shadow-sm placeholder-slate-400 transition border border-slate-200 hover:border-slate-800 focus:outline-none focus:ring focus:ring-slate-800/10 focus:border-slate-800'
                ]" />
        </div>

        <!-- Error Messages -->
        <div v-if="errors && errors.length" class="text-red-500 text-xs mt-1 space-y-0.5">
            <div v-for="(err, index) in errors" :key="index">{{ err }}</div>
        </div>
    </div>
</template>
