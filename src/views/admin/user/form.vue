<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { required, email, minLength } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useUserStore } from "@/state/pinia";
import InputField from "@/components/widgets/Input";
import Button from "@/components/widgets/Button";
import ImageCropper from "@/components/widgets/Cropper";
import { showSuccessToast, showErrorToast } from "@/helpers/alert.js";
import Select from '@/components/widgets/Select.vue'

const userStore = useUserStore();
const emits = defineEmits(["refresh", "close"]);
const roles = ref([]);

const getRoles = async () => {
    try {
        await userStore.getRoles();
        roles.value = userStore.roles || [];

        console.log(`Roles: ${JSON.stringify(roles.value, null, 2)}`);

    } catch (err) {
        console.error("Error loading roles:", err);
        roles.value = [];
    }
};

const selectedRoles = ref('');

const props = defineProps({
    user: Object
});

const formModel = reactive({
    id: "",
    name: "",
    email: "",
    password: "",
    photo: "",
    user_roles_id: "",
});

const imageUrl = ref("");
const croppedImageUrl = ref("");

const rules = {
    name: { required },
    email: { required, email },
    password: { minLength: minLength(6) },
};

const v$ = useVuelidate(rules, formModel);

watch(() => props.user, (newUser) => {
    if (newUser) {
        formModel.id = newUser.id;
        formModel.name = newUser.name;
        formModel.email = newUser.email;
        formModel.password = "";
        formModel.user_roles_id = newUser.user_roles_id;
        imageUrl.value = newUser.photo_url;
    } else {
        formModel.id = "";
        formModel.name = "";
        formModel.email = "";
        formModel.password = "";
        formModel.user_roles_id = "";
        imageUrl.value = "";
    }
}, { immediate: true });

const saveUser = async () => {
    const isValid = await v$.value.$validate();
    if (!isValid) {
        showErrorToast("Periksa kembali inputan Anda.");
        return;
    }
    try {
        if (formModel.id) {
            await userStore.updateUser(formModel);
            showSuccessToast("User updated successfully!");
        } else {
            await userStore.addUsers(formModel);
            showSuccessToast("User added successfully!");
        }
        emits("refresh");
        emits("close");
    } catch (error) {
        console.error(error);
        showErrorToast("Terjadi kesalahan saat menyimpan user.");
    }
};

defineExpose({ saveUser });

onMounted(() => {
    getRoles();
});
</script>

<template>
    <div>
        <div class="mb-4">
            <label class="text-sm font-bold">Foto</label>
            <ImageCropper :imageUrl="imageUrl" :aspectRatio="16 / 9" :inputAspectRatio="true"
                @update:imageUrl="imageUrl = $event"
                @update:croppedImageUrl="croppedImageUrl = $event; formModel.photo = $event;" />
        </div>

        <div class="mb-4">
            <InputField v-model="formModel.name" label="Nama" type="text" placeholder="Masukkan Nama" />
            <div v-if="v$.name.$error" class="text-red-500 text-xs">
                <span v-for="(err, index) in v$.name.$errors" :key="index">{{ err.$message }}</span>
            </div>
        </div>

        <div class="mb-4">
            <InputField v-model="formModel.email" label="Email" type="email" placeholder="Masukkan Email" />
            <div v-if="v$.email.$error" class="text-red-500 text-xs">
                <span v-for="(err, index) in v$.email.$errors" :key="index">{{ err.$message }}</span>
            </div>
        </div>

        <div class="mb-4">
            <InputField v-model="formModel.password" label="Password" type="password" placeholder="Masukkan Password" />
            <div v-if="v$.password.$error" class="text-red-500 text-xs">
                <span v-for="(err, index) in v$.password.$errors" :key="index">{{ err.$message }}</span>
            </div>
        </div>

        <Select v-model="formModel.user_roles_id" :label="'Roles'" :placeholder="'Choose Roles...'" :options="roles.map(role => ({
            value: role.id,
            label: role.name
        }))" :errors="[]" />

        <!-- <div class="flex justify-end gap-2">
            <Button @click="$emit('close')" variant="outline" color="secondary">Close</Button>
            <Button @click="saveUser" variant="solid" color="primary">Submit</Button>
        </div> -->
    </div>
</template>
