import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/RegisterView.vue"),
  },
  {
    path: "/products",
    name: "products",
    component: () => import("@/views/ProductList.vue"),
  },
  {
    path: "/product/:id",
    component: () => import("@/views/ProductDetail.vue"),
  },
  {
    path: "/cart",
    name: "cart",
    component: () => import("@/views/Cart.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/orders",
    name: "orders",
    component: () => import("@/views/Orders.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/Profile.vue"),
    meta: { requiresAuth: true },
  },

  {
    path: "/admin",
    component: () => import("@/components/layout/AdminDashboard.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: "users",
        name: "admin-users",
        component: () => import("@/views/admin/UserManagement.vue"),
      },
      {
        path: "products",
        name: "admin-products",
        component: () => import("@/views/admin/ProductManagement.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});


router.beforeEach((to, from, next) => {
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  const role =
    localStorage.getItem("role") ||
    sessionStorage.getItem("role");

  if (to.meta.requiresAuth && !token) {
    return next("/login");
  }

  if (to.meta.requiresAdmin && role !== "ROLE_ADMIN") {
    return next("/");
  }

  if (to.path === "/login" && token) {
    return next("/");
  }

  next();
});

export default router;