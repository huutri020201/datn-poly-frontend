<template>
  <header class="header-container py-3 px-4 shadow-sm mb-5">
    <div
      class="container-fluid d-flex justify-content-between align-items-center"
    >
      <div class="logo cursor-pointer" @click="$router.push('/')">
        <img
          src="https://i.pravatar.cc/40"
          alt="Logo"
          height="40"
          @error="(e) => (e.target.style.display = 'none')"
        />
        <span v-if="!hasLogo" class="fw-bold fs-4">SPORT SHOP</span>
      </div>

      <nav class="d-flex align-items-center gap-3">
        <router-link to="/booking" class="nav-link-custom">Đặt sân</router-link>
        <router-link to="/products" class="nav-link-custom"
          >Phụ kiện</router-link
        >
        <router-link to="/info" class="nav-link-custom">Giới thiệu</router-link>
        <router-link to="/contact" class="nav-link-custom">Liên hệ</router-link>

        <div class="ms-3 d-flex align-items-center gap-2">
          <template v-if="!isLoggedIn">
            <router-link
              to="/login"
              class="btn btn-light-custom px-4 text-decoration-none"
            >
              Đăng nhập
            </router-link>
            <router-link
              to="/register"
              class="btn btn-dark-custom px-4 text-decoration-none"
            >
              Đăng ký
            </router-link>
          </template>

          <div v-else class="user-menu position-relative">
            <div
              class="user-info d-flex align-items-center cursor-pointer"
              @click.stop="toggleMenu"
            >
              <img :src="avatar" class="avatar me-2" />
              <span class="fw-medium">{{ userName }}</span>
              <i class="bi bi-chevron-down ms-1 small"></i>
            </div>

            <div v-if="showMenu" class="dropdown-menu-custom">
              <div
                v-if="role === 'ROLE_ADMIN'"
                class="dropdown-item text-primary fw-bold border-bottom"
                @click="goAdmin"
              >
                <i class="bi bi-shield-lock me-2"></i> Quản trị hệ thống
              </div>

              <div class="dropdown-item" @click="goProfile">
                <i class="bi bi-person me-2"></i> Hồ sơ
              </div>

              <div class="dropdown-item" @click="goOrders">
                <i class="bi bi-list-ul me-2"></i> Đơn hàng
              </div>

              <div
                class="dropdown-item text-danger mt-1 border-top"
                @click="logout"
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

<script>
import axios from "axios";

export default {
  name: "Header",

  data() {
    return {
      isLoggedIn: false,
      userName: "User",
      role: "", // Lưu vai trò người dùng
      avatar: "https://i.pravatar.cc/40",
      showMenu: false,
      hasLogo: false,
    };
  },

  watch: {
    // Theo dõi thay đổi route để cập nhật lại trạng thái auth (ví dụ sau khi login/logout)
    $route() {
      this.checkAuth();
      this.showMenu = false;
    },
  },

  mounted() {
    this.checkAuth();
    // Lắng nghe click toàn cục để đóng menu khi bấm ra ngoài
    document.addEventListener("click", this.handleClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },

  methods: {
    getAuthHeaders() {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      return token ? { Authorization: `Bearer ${token}` } : {};
    },

    checkAuth() {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      const savedRole =
        localStorage.getItem("role") || sessionStorage.getItem("role");

      this.isLoggedIn = !!token;
      this.role = savedRole || "";

      if (this.isLoggedIn) {
        this.fetchUserProfile();
      } else {
        this.userName = "User";
        this.avatar = "https://i.pravatar.cc/40";
      }
    },

    async fetchUserProfile() {
      try {
        const res = await axios.get(`http://localhost:8080/profile/me`, {
          headers: this.getAuthHeaders(),
        });

        const data = res.data.result || res.data.data || res.data;
        this.userName = data?.fullName || data?.name || "User";

        if (data?.avatarUrl || data?.avatar_url || data?.avatar) {
          this.avatar = data.avatarUrl || data.avatar_url || data.avatar;
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin Header:", error);
        // Nếu lỗi 401 (hết hạn token) thì có thể logout ở đây
        if (error.response?.status === 401) {
          this.logout();
        }
      }
    },

    toggleMenu() {
      this.showMenu = !this.showMenu;
    },

    handleClickOutside(e) {
      const userMenu = this.$el.querySelector(".user-menu");
      if (userMenu && !userMenu.contains(e.target)) {
        this.showMenu = false;
      }
    },

    goAdmin() {
      this.$router.push("/admin");
      this.showMenu = false;
    },

    goProfile() {
      this.$router.push("/profile");
      this.showMenu = false;
    },

    goOrders() {
      this.$router.push("/orders");
      this.showMenu = false;
    },

    logout() {
      // Xóa sạch dấu vết
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      sessionStorage.removeItem("role");
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");

      this.isLoggedIn = false;
      this.role = "";
      this.showMenu = false;

      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.header-container {
  background-color: #d1f2d5;
  border-radius: 0 0 15px 15px;
  position: sticky;
  top: 0;
  z-index: 1050;
}

/* NAV LINK */
.nav-link-custom {
  text-decoration: none;
  color: #333;
  padding: 8px 16px;
  background-color: #e8f7e9;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-link-custom:hover {
  background-color: #c2eec7;
  transform: translateY(-2px);
}

/* BUTTON */
.btn-light-custom {
  background-color: #f8fff9;
  border: 1px solid #c3e6cb;
  color: #155724;
  font-weight: 500;
  border-radius: 8px;
}
.btn-dark-custom {
  background-color: #222;
  color: white;
  border-radius: 8px;
  font-weight: 500;
}

/* USER INFO */
.user-info {
  background: rgba(255, 255, 255, 0.5);
  padding: 5px 12px;
  border-radius: 20px;
  transition: 0.3s;
}
.user-info:hover {
  background: rgba(255, 255, 255, 0.8);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
}

/* DROPDOWN */
.dropdown-menu-custom {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  background: white;
  border-radius: 10px;
  width: 200px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1000;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  padding: 12px 20px;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  align-items: center;
  font-size: 0.95rem;
}

.dropdown-item:hover {
  background: #f8fdf9;
  padding-left: 25px; /* Hiệu ứng lướt nhẹ khi hover */
}

.cursor-pointer {
  cursor: pointer;
}
</style>