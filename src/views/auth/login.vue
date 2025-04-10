<template>
    <div class="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div class="w-full max-w-md bg-white shadow-md rounded-lg p-6">
            <div class="flex items-center gap-2 justify-center mb-6">
                <h1 class="text-xl font-bold text-gray-800">Venturo.</h1>
            </div>

            <h2 class="text-lg font-semibold text-center text-gray-700 mb-4">Welcome back</h2>

            <form @submit.prevent="login">
                <div class="mb-4 space-y-1.5">
                    <label class="text-sm text-slate-800 font-bold" for="email">Email</label>
                    <input id="email" v-model="formModel.email" type="email" placeholder="Masukkan Email"
                        class="w-full border border-slate-200 rounded-md py-2 px-2.5 text-sm shadow-sm hover:border-slate-800 focus:border-slate-800 focus:ring focus:ring-slate-800/10" />
                    <div v-if="errorList.email" class="text-red-500 text-xs">
                        <span v-for="(err, index) in errorList.email" :key="index">
                            {{ err }}
                        </span>
                    </div>
                </div>

                <div class="mb-4 space-y-1.5">
                    <label class="text-sm text-slate-800 font-bold" for="password">Password</label>
                    <div class="relative">
                        <input id="password" v-model="formModel.password" :type="showPassword ? 'text' : 'password'"
                            placeholder="Masukkan Password"
                            class="w-full border border-slate-200 rounded-md py-2 px-2.5 text-sm shadow-sm hover:border-slate-800 focus:border-slate-800 focus:ring focus:ring-slate-800/10" />
                        <button type="button" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                            @click="togglePassword">
                            <svg class="h-5 w-5" viewBox="0 0 24 24">
                                <path :d="showPassword ? mdiEyeOff : mdiEye" fill="currentColor" />
                            </svg>
                        </button>
                    </div>
                    <div v-if="errorList.password" class="text-red-500 text-xs">
                        <span v-for="(err, index) in errorList.password" :key="index">
                            {{ err }}
                        </span>
                    </div>
                </div>

                <div class="flex items-center justify-between text-sm">
                    <router-link to="/forgot-password" class="text-primary hover:underline">
                        Forgot Password?
                    </router-link>
                </div>

                <button type="submit" class="w-full bg-primary text-white font-bold py-2 rounded-md mt-4">
                    Login
                </button>
            </form>

            <div class="text-center text-sm mt-4">
                Don't have an account?
                <router-link to="/register" class="text-primary hover:underline">Register</router-link>
            </div>

            <div class="text-center text-xs text-gray-500 mt-6">
                By clicking continue, you agree to our
                <a href="#" class="underline">Terms of Service</a> and
                <a href="#" class="underline">Privacy Policy</a>.
            </div>
        </div>
    </div>

    <Toaster />
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/state/pinia";
import { useColorMode } from "@vueuse/core";
import { getProgressInstance } from "@/helpers/progress";
import { Toaster, toast } from "vue-sonner";
import { mdiEye, mdiEyeOff } from "@mdi/js";

const router = useRouter();
const authStore = useAuthStore();
const progress = getProgressInstance();

const showPassword = ref(false);
const formModel = reactive({
    email: "",
    password: "",
});

const errorList = reactive({
    email: null,
    password: null,
});

const statusCode = computed(() => authStore.response?.status || null);
const errorMessage = computed(() => authStore.response?.message || "");

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const login = async () => {
    progress.start();
    errorList.email = null;
    errorList.password = null;

    try {
        await authStore.login(formModel);

        if (statusCode.value !== 200) {
            progress.fail();

            const errors = authStore.response?.list || {};
            errorList.email = errors.email || null;
            errorList.password = errors.password || null;

            const general = errors.general?.join(", ") || errorMessage.value;
            toast.error("Login Failed", {
                description: general || "Something went wrong.",
                position: "bottom-right",
                duration: 3000,
                class: "bg-red-600 text-white border-none shadow-lg",
            });
        } else {
            progress.finish();
            toast.success("Welcome Back!", {
                description: "You have successfully logged in.",
                position: "bottom-right",
                duration: 3000,
                class: "bg-green-500 text-white border-none shadow-lg",
            });
            router.push("/");
        }
    } catch (error) {
        progress.fail();
        toast.error("An error occurred", {
            description: "Please try again later.",
            position: "bottom-right",
            duration: 3000,
            class: "bg-red-600 text-white border-none shadow-lg",
        });
    }
};

// Color mode
const mode = useColorMode({
    emitAuto: false,
    modes: {
        light: "light",
        dark: "dark",
    },
});
if (!mode.value) mode.value = "light";
</script>