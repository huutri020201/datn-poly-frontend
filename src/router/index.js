import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue')
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('@/views/ProductList.vue')
  },
  {
    path: "/product/:id",
    component: () => import("@/views/ProductDetail.vue")
  },
  {
    path: "/cart",
    name: "cart",
    component: () => import("@/views/Cart.vue")
  },
  /* 🛠️ PHẦN ADMIN ĐƯỢC CẬP NHẬT Ở ĐÂY */
  {
    path: '/admin',
    component: () => import('@/components/layout/AdminDashboard.vue'),
    children: [
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/views/admin/UserManagement.vue')
      },
      {
        path: 'products',
        name: 'admin-products',
        component: () => import('@/views/admin/ProductManagement.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

/* 🔐 Router Guard (Giữ nguyên logic của bạn) */
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (!token && to.path.startsWith("/admin")) {
    return next("/login");
  }

  if (to.path.startsWith("/admin") && role !== "ROLE_ADMIN") {
    return next("/");
  }

  next();
});

export default router