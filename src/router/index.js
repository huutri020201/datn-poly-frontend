import { createRouter, createWebHistory } from "vue-router";

const routes = [
  //router auth
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/auth/Register.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/Login.vue"),
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("@/views/auth/ForgotPassword.vue"),
  },
  {
    path: "/verify",
    name: "verify",
    component: () => import("@/views/auth/VerifyView.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/auth/Profile.vue"),
    meta: { requiresAuth: true },
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
    name: "orders-list",
    component: () => import("@/views/MyOrdersList.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/orders/:id",
    name: "order-detail",
    component: () => import("@/views/Orders.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/booking",
    name: "booking",
    component: () => import("@/views/BookingList.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/checkout",
    name: "Checkout",
    component: () => import("@/views/Checkout.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/payment/callback",
    name: "PaymentCallback",
    component: () => import("@/views/PaymentCallback.vue"),
  },

  {
    path: "/bookings/:id",
    name: "booking-detail",
    component: () => import("@/views/BookingDetail.vue"),
  },
  {
    path: "/feedback",
    name: "Feedback",
    component: () => import("@/views/Feedback.vue"),
  },
  {
    path: "/my-bookings",
    name: "mybookings",
    component: () => import("@/views/MyBookingList.vue"),
  },
  {
    path: "/info",
    name: "info",
    component: () => import("@/views/auth/Login.vue"),
  },
  {
    path: "/contact",
    name: "contact",
    component: () => import("@/views/auth/Login.vue"),
  },
  {
    path: "/admin",
    component: () => import("@/components/layout/AdminDashboard.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
    redirect: "/admin/users",
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
      {
        path: "orders",
        name: "admin-orders",
        component: () => import("@/views/admin/OrderManagement.vue"),
      },
      {
        path: "bookings",
        name: "admin-bookings",
        component: () => import("@/views/admin/BookingManagement.vue"),
      },
      {
        path: "pitches",
        name: "admin-pitches",
        component: () => import("@/views/admin/PitchManagement.vue"),
      },
      {
        path: "promotions",
        name: "admin-promotions",
        component: () => import("@/views/admin/PromotionManagement.vue"),
      },
      {
        path: "feedback",
        name: "admin-feedback",
        component: () => import("@/views/admin/FeedbackManagement.vue"),
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

// router.beforeEach((to, from) => {
//   const token =
//     localStorage.getItem("accessToken") ||
//     sessionStorage.getItem("accessToken");

//   if (to.path === "/login" && token) {
//     return { path: "/" };
//   }

//   if (to.meta.requiresAuth && !token) {
//     return { path: "/login" };
//   }

//   return true;
// });

router.beforeEach((to, from) => {
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");
  const userRole =
    localStorage.getItem("role") || sessionStorage.getItem("role");
  if (to.path === "/login" && token) {
    return { path: "/" };
  }
  if (to.meta.requiresAuth && !token) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }
  if (to.matched.some((record) => record.meta.requiresAdmin)) {
    if (!userRole || !userRole.includes("ROLE_ADMIN")) {
      alert("Bạn không có quyền truy cập!");
      return { path: "/" };
    }
  }

  return true;
});

export default router;
