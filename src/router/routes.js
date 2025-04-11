import { useAuthStore } from "@/state/pinia";
export default [
  //   {
  //     path: "/",
  //     name: "home",
  //     beforeEnter(to, from, next) {
  //       const auth = useAuthStore();
  //       if (auth.getToken) {
  //         next({ name: "dashboard" });
  //       } else {
  //         next({ name: "login" });
  //       }
  //     },
  //   },

  // ADMIN
  {
    path: "/admin/dashboard",
    name: "dashboard",
    meta: {
      title: "Dashboard",
      authRequired: false,
      restrictedTo: ["Client"],
    },
    component: () => import("../views/dashboard"),
  },

  {
    path: "/admin/products",
    name: "admin-product-list",
    meta: { title: "Products List Page", authRequired: false },
    component: () => import("../views/admin/products"),
  },
  {
    path: "/admin/product-form/:id?",
    name: "product-form",
    meta: {
      title: "Form Product",
      authRequired: false,
      //restrictedTo: ["Client"],
    },
    component: () => import("../views/admin/products/form.vue"),
  },
  {
    path: "/admin/product-category",
    name: "admin-product-category-list",
    meta: { title: "Products Category List Page", authRequired: false },
    component: () => import("../views/admin/product-category"),
  },

  {
    path: "/admin/user",
    name: "user",
    meta: { title: "User Page", authRequired: false },
    component: () => import("../views/admin/user"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/auth/login"),
    meta: {
      title: "Login",
      beforeResolve(routeTo, routeFrom, next) {
        const auth = useAuthStore();
        if (auth.getToken) {
          next({ name: "default" });
        } else {
          next();
        }
      },
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/auth/register"),
    meta: {
      title: "Register",
      beforeResolve(routeTo, routeFrom, next) {
        const auth = useAuthStore();
        if (auth.getToken) {
          next({ name: "default" });
        } else {
          next();
        }
      },
    },
  },
  {
    path: "/forgot-password",
    name: "Forgot password",
    component: () => import("../views/auth/forgot-password"),
    meta: {
      title: "Forgot password",
      beforeResolve(routeTo, routeFrom, next) {
        const auth = useAuthStore();
        if (auth.getToken) {
          next({ name: "default" });
        } else {
          next();
        }
      },
    },
  },
  {
    path: "/404",
    name: "NotFound",
    component: () => import("../views/utility/404.vue"),
    meta: {
      title: "404 Not Found",
    },
  },
  {
    path: "/:catchAll(.*)",
    redirect: { name: "NotFound" },
  },
];
