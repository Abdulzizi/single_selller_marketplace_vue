import { useLayoutStore } from "./pinia/layout";
import { useAuthStore } from "./pinia/auth";
import { useUserStore } from "./pinia/user";
import { createPinia } from "pinia";

import { useProductCategoryStore } from "./pinia/product-category";
import { useProductStore } from "./pinia/product";
import { useCartStore } from "./pinia/cart";

const pinia = createPinia();
export default pinia;

export {
  useLayoutStore,
  useAuthStore,
  useUserStore,
  useCartStore,
  useProductCategoryStore,
  useProductStore,
};
