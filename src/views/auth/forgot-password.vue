<script>
import { reactive } from "vue";
import Layout from "../../layouts/auth";
import { required, email, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useAuthStore } from "@/state/pinia";

export default {
  components: { Layout },
  setup() {
    const auth = useAuthStore();

    // Define state using reactive
    const state = reactive({
      email: "",
      submitted: false,
      error: null,
      tryingToReset: false,
      isResetError: false,
    });

    // Define validation rules
    const rules = {
      email: {
        required: helpers.withMessage("Email is required", required),
        email: helpers.withMessage("Please enter a valid email", email),
      },
    };

    // Initialize Vuelidate with reactive state
    const v$ = useVuelidate(rules, state);

    // Function to handle form submission
    const tryToReset = async () => {
      state.submitted = true;
      v$.value.$touch(); // Trigger validation check

      if (v$.value.$invalid) {
        return; // Stop if form is invalid
      }

      state.tryingToReset = true;
      state.error = null;
      state.isResetError = false;

      try {
        await auth.forgotPassword(state.email);
        state.tryingToReset = false;

        if (auth.response.status === 200) {
          state.isResetError = false;
          state.error = "A password reset link has been sent to your email.";

          alert("A password reset link has been sent to your email.");
        } else {
          state.isResetError = true;
          state.error = auth.response.message;
        }
      } catch (error) {
        state.tryingToReset = false;
        state.isResetError = true;
        state.error = error?.response?.data?.message || "Something went wrong.";
      }
    };

    return { v$, state, tryToReset };
  },
};
</script>

<template>
  <Layout>
    <BRow class="justify-content-center">
      <BCol md="8" lg="6" xl="5">
        <BCard no-body class="overflow-hidden">
          <div class="bg-primary-subtle">
            <BRow>
              <BCol cols="7">
                <div class="text-primary p-4">
                  <h5 class="text-primary">Reset Password</h5>
                  <p>Re-Password with Skote.</p>
                </div>
              </BCol>
              <BCol cols="5" class="align-self-end">
                <img src="@/assets/images/profile-img.png" alt class="img-fluid" />
              </BCol>
            </BRow>
          </div>
          <BCardBody class="pt-0">
            <div>
              <router-link to="/">
                <div class="avatar-md profile-user-wid mb-4">
                  <span class="avatar-title rounded-circle bg-light">
                    <img src="@/assets/images/logo.svg" alt height="34" />
                  </span>
                </div>
              </router-link>
            </div>

            <div class="p-2">
              <BAlert v-if="state.isResetError" class="mb-4" variant="danger" dismissible>{{ state.error }}</BAlert>
              <BAlert v-if="!state.isResetError && state.error" class="mb-4" variant="success" dismissible>{{
                state.error }}</BAlert>

              <BForm @submit.prevent="tryToReset">
                <div class="mb-3">
                  <label for="useremail">Email</label>
                  <input type="email" v-model="state.email" class="form-control" id="useremail"
                    placeholder="Enter email" :class="{ 'is-invalid': state.submitted && v$.email.$error }" />
                  <div v-for="(error, index) in v$.email.$errors" :key="index" class="invalid-feedback">
                    <span v-if="error.$message">{{ error.$message }}</span>
                  </div>
                </div>
                <BRow class="mb-3 mb-0">
                  <BCol cols="12" class="text-end">
                    <BButton variant="primary" class="w-md" type="submit" :disabled="state.tryingToReset">
                      {{ state.tryingToReset ? "Processing..." : "Reset" }}
                    </BButton>
                  </BCol>
                </BRow>
              </BForm>
            </div>
          </BCardBody>
        </BCard>

        <div class="mt-5 text-center">
          <p>
            Remember It?
            <router-link to="/login" class="fw-medium text-primary">Sign In here</router-link>
          </p>
          <p>
            © {{ new Date().getFullYear() }} Skote. Crafted with
            <i class="mdi mdi-heart text-danger"></i> by Themesbrand
          </p>
        </div>
      </BCol>
    </BRow>
  </Layout>
</template>

<style lang="scss" module></style>
