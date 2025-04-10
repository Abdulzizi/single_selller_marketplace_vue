<!-- components/widgets/Icon.vue -->
<template>
    <svg :width="size" :height="size" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
        :class="class">
        <path :d="icon" />
    </svg>
</template>

<script setup>
defineProps({
    icon: String,
    size: {
        type: [Number, String],
        default: 24,
    },
    class: {
        type: String,
        default: '',
    },
});
</script>