import { useAuthStore } from "./pinia/auth";

import { useUserStore } from "./pinia/user";
import { useProductStore } from "./pinia/product";
import { useProductCategoryStore } from "./pinia/product-category";

import { createPinia } from "pinia";

const pinia = createPinia();
export default pinia;

export { useAuthStore, useUserStore, useProductStore, useProductCategoryStore };
