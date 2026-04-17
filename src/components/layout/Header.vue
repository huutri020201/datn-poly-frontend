<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";

const router = useRouter();
const authStore = useAuthStore();

const { isLoggedIn, user, role } = storeToRefs(authStore);

const showMenu = ref(false);
const defaultAvatar = "https://i.pravatar.cc/40";

const userAvatar = computed(() => user.value?.avatarUrl || defaultAvatar);

const userFullName = computed(() => user.value?.fullName || "Người dùng");

const menuItems = [
  { name: "Đặt sân", path: "/booking" },
  { name: "Phụ kiện", path: "/products" },
  { name: "Giới thiệu", path: "/info" },
  { name: "Liên hệ", path: "/contact" },
];

const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};

onMounted(async () => {
  if (isLoggedIn.value) {
    await authStore.fetchProfile();
  }
});

const toggleMenu = () => (showMenu.value = !showMenu.value);
const closeMenu = () => (showMenu.value = false);

const handleNav = (path) => {
  router.push(path);
  showMenu.value = false;
};

const handleLogout = () => {
  authStore.logout();
  showMenu.value = false;
  router.push("/login");
};
</script>

<template>
  <header class="header-container py-3 px-4 shadow-sm">
    <div
      class="container-fluid d-flex justify-content-between align-items-center"
    >
      <div
        class="logo cursor-pointer d-flex align-items-center"
        @click="$router.push('/')"
      >
        <img
          src="https://i.pravatar.cc/40"
          alt="Logo"
          height="40"
          class="me-2 rounded"
        />
        <span class="fw-bold fs-4 text-dark">SPORT SHOP</span>
      </div>

      <nav class="d-flex align-items-center gap-3">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-link-custom"
        >
          {{ item.name }}
        </router-link>

        <div class="ms-3 d-flex align-items-center gap-2">
          <template v-if="!isLoggedIn">
            <router-link
              to="/login"
              class="btn btn-light-custom px-4 text-decoration-none"
              >Đăng nhập</router-link
            >
            <router-link
              to="/register"
              class="btn btn-dark-custom px-4 text-decoration-none"
              >Đăng ký</router-link
            >
          </template>

          <div
            v-else
            class="user-menu position-relative"
            v-click-outside="closeMenu"
          >
            <div
              class="user-info d-flex align-items-center cursor-pointer"
              @click="toggleMenu"
            >
              <img :src="userAvatar" class="avatar me-2" />
              <span class="fw-medium text-dark">{{ userFullName }}</span>
              <i class="bi bi-chevron-down ms-1 small"></i>
            </div>

            <div v-if="showMenu" class="dropdown-menu-custom shadow border-0">
              <div
                v-if="role === 'ROLE_ADMIN'"
                class="dropdown-item text-primary fw-bold border-bottom"
                @click="handleNav('/admin')"
              >
                <i class="bi bi-shield-lock me-2"></i> Quản trị
              </div>
              <div class="dropdown-item" @click="handleNav('/profile')">
                <i class="bi bi-person me-2"></i> Hồ sơ
              </div>
              <div class="dropdown-item" @click="handleNav('/orders')">
                <i class="bi bi-list-ul me-2"></i> Đơn hàng
              </div>
              <div
                class="dropdown-item text-danger mt-1 border-top"
                @click="handleLogout"
              >
                <i class="bi bi-box-arrow-right me-2"></i> Đăng xuất
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
@import "@/assets/styles/auth.css";

/* Tùy chỉnh thêm cho Header */
.header-container {
  background-color: #d1f2d5;
  border-radius: 0 0 15px 15px;
  position: sticky;
  top: 0;
  z-index: 1050;
}

.nav-link-custom {
  text-decoration: none;
  color: #333;
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.nav-link-custom:hover,
.router-link-active {
  background-color: white;
  color: #222;
  transform: translateY(-2px);
}

.user-info {
  background: white;
  padding: 6px 15px;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.dropdown-menu-custom {
  position: absolute;
  right: 0;
  top: 110%;
  background: white;
  border-radius: 12px;
  width: 200px;
  overflow: hidden;
  z-index: 1000;
}

.dropdown-item {
  padding: 12px 15px;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  align-items: center;
  color: #444;
}

.dropdown-item:hover {
  background: #f1f8f2;
  padding-left: 20px;
}
</style>
