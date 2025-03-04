<script setup>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
</script>

<template>
  <Layout>
    <PageHeader title="Dashboard" pageTitle="Overview" />
    <BContainer fluid>
      <BRow>
        <BCol md="3">
          <BCard bgVariant="primary" textVariant="white" class="text-center">
            <BCardTitle>Total Sales</BCardTitle>
            <BCardText class="display-4">Rp. 5,000,000</BCardText>
          </BCard>
        </BCol>
        <BCol md="3">
          <BCard bgVariant="success" textVariant="white" class="text-center">
            <BCardTitle>New Users</BCardTitle>
            <BCardText class="display-4">250</BCardText>
          </BCard>
        </BCol>
        <BCol md="3">
          <BCard bgVariant="danger" textVariant="white" class="text-center">
            <BCardTitle>Orders</BCardTitle>
            <BCardText class="display-4">120</BCardText>
          </BCard>
        </BCol>
        <BCol md="3">
          <BCard bgVariant="warning" textVariant="white" class="text-center">
            <BCardTitle>Revenue</BCardTitle>
            <BCardText class="display-4">Rp. 20,000,000</BCardText>
          </BCard>
        </BCol>
      </BRow>
    </BContainer>
  </Layout>
</template>

<style scoped>
</style>
