<script>
export default {

}
</script>
<template>
    <div class="checkout-success my-5 pt-5">
        <BContainer>
            <BRow>
                <BCol lg="12">
                    <div class="text-center mb-5">
                        <h1 class="display-2 fw-medium text-success">
                            <i class="bx bx-check-circle bx-spin text-success display-3"></i> Success
                        </h1>
                        <h4 class="text-uppercase">Thank you for your purchase!</h4>
                        <div class="mt-5 text-center">
                            <router-link to="/">
                                <BButton variant="primary">Back to Home</BButton>
                            </router-link>
                        </div>
                    </div>
                </BCol>
            </BRow>
            <BRow class="justify-content-center">
                <BCol md="8" xl="6">
                    <div>
                        <!-- <img src="@/assets/images/success-img.png" alt class="img-fluid" /> -->
                    </div>
                </BCol>
            </BRow>
        </BContainer>
    </div>
</template>
