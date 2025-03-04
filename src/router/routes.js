import { useAuthStore } from "@/state/pinia";

export default [
  // Client
  {
    path: "/",
    name: "products",
    meta: {
      title: "Product Catalog",
      authRequired: true,
      restrictedTo: ["Super Admin"],
    },
    component: () => import("../views/client/index.vue"),
  },

  {
    path: "/product/:slug",
    name: "product-detail",
    meta: {
      title: "Product Detail",
      authRequired: true,
      restrictedTo: ["Super Admin"],
    },
    component: () => import("../views/client/product-detail"),
  },
  {
    path: "/cart",
    name: "cart",
    meta: {
      title: "Cart",
      authRequired: true,
      restrictedTo: ["Super Admin"],
    },
    component: () => import("../views/client/cart"),
  },
  {
    path: "/checkout",
    name: "checkout",
    meta: {
      title: "Checkout",
      authRequired: true,
      restrictedTo: ["Super Admin"],
    },
    component: () => import("../views/client/checkout"),
  },
  {
    path: "/checkout-success",
    name: "checkout-success",
    meta: {
      title: "Checkout Success",
      authRequired: true,
      restrictedTo: ["Super Admin"],
    },
    component: () => import("../views/client/checkout/success.vue"),
  },
  {
    path: "/my-orders",
    name: "my-orders",
    meta: {
      title: "Order List",
      authRequired: true,
      restrictedTo: ["Super Admin"],
    },
    component: () => import("../views/client/order"),
  },
  {
    path: "/my-orders/:id",
    name: "my-order-detail",
    meta: {
      title: "Order Detail",
      authRequired: true,
      restrictedTo: ["Super Admin"],
    },
    component: () => import("../views/client/order-detail"),
  },

  // ADMIN
  {
    path: "/admin/dashboard",
    name: "admin dashboard",
    meta: {
      title: "Dashboard",
      authRequired: true,
      restrictedTo: ["Client"],
    },
    component: () => import("../views/dashboards/default"),
  },
  {
    path: "/admin/user",
    name: "user",
    meta: {
      title: "Master User",
      authRequired: true,
      restrictedTo: ["Client"],
    },
    component: () => import("../views/admin/user"),
  },
  {
    path: "/admin/product-category",
    name: "product-category",
    meta: {
      title: "Master Product Category",
      authRequired: true,
      restrictedTo: ["Client"],
    },
    component: () => import("../views/admin/product-category"),
  },
  {
    path: "/admin/products",
    name: "product",
    meta: {
      title: "Master Products",
      authRequired: true,
      restrictedTo: ["Client"],
    },
    component: () => import("../views/admin/product"),
  },
  {
    path: "/admin/product-form/:id?",
    name: "product-form",
    meta: {
      title: "Form Product",
      authRequired: true,
      restrictedTo: ["Client"],
    },
    component: () => import("../views/admin/product/form"),
  },
  {
    path: "/admin/orders",
    name: "orders",
    meta: {
      title: "Master Orders",
      authRequired: true,
      restrictedTo: ["Client"],
    },
    component: () => import("../views/admin/order"),
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
    path: "/logout",
    name: "logout",
    component: () => import("../views/auth/logout"),
    meta: {
      title: "Logout",
      authRequired: false,
      beforeResolve(routeTo, routeFrom, next) {
        const authRequiredOnPreviousRoute = routeFrom.matched.some((route) =>
          route.push("/login")
        );
        next(
          authRequiredOnPreviousRoute ? { name: "default" } : { ...routeFrom }
        );
      },
    },
  },
  // Redirect any unmatched routes to the 404 page. This may
  // require some server configuration to work in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  {
    path: "/404",
    name: "NotFound",
    component: () => import("../views/utility/404.vue"),
    meta: {
      title: "404 Not Found",
    },
  },
  // Catch-all route using a dynamic param with a custom regexp
  {
    path: "/:catchAll(.*)", // This replaces the previous wildcard
    redirect: { name: "NotFound" },
  },
];
