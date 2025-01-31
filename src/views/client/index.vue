<template>
    <Layout>
        <PageHeader title="Users List" pageTitle="Users" />


        <BRow>
            <BCol lg="12">
                <BCard no-body>
                    <BCardBody class="border-bottom">

                        <h1>CLIENT SIDE</h1>

                        <Pagination :currentPage="userStore.current" :totalRows="userStore.totalData"
                            :perPage="userStore.perpage" @update:currentPage="updatePage" />
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </Layout>
</template>

<script setup>
import Layout from "@/layouts/main";
import PageHeader from "@/components/page-header";
import Pagination from "@/components/widgets/pagination";

</script>