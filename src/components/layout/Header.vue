<template>
  <header class="header-container py-3 px-4 shadow-sm mb-5">
    <div
      class="container-fluid d-flex justify-content-between align-items-center"
    >
      <div class="logo cursor-pointer" @click="$router.push('/')">
        <img src="" alt="Logo" height="40" />
      </div>
      <nav class="d-flex align-items-center gap-3">
        <router-link to="/booking" class="nav-link-custom">Đặt sân</router-link>
        <router-link to="/products" class="nav-link-custom">Phụ kiện</router-link>
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
              @click="toggleMenu"
            >
              <img :src="avatar" class="avatar me-2" />
              <span>{{ userName }}</span>
            </div>
            <div v-if="showMenu" class="dropdown-menu-custom">

              <div class="dropdown-item" @click="goProfile">
                <i class="bi bi-person"></i> Hồ sơ
              </div>

              <div class="dropdown-item" @click="goOrders">
                <i class="bi bi-list-ul"></i> Đơn hàng
              </div>

              <div class="dropdown-item text-danger" @click="logout">
                <i class="bi bi-box-arrow-right"></i> Đăng xuất
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
      avatar: "https://i.pravatar.cc/40",
      showMenu: false
    };
  },

  watch: {
    $route() {
      this.checkAuth();
    }
  },

  mounted() {
    this.checkAuth(); 
    document.addEventListener("click", this.handleClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },

  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
      return token ? { Authorization: `Bearer ${token}` } : {};
    },

    checkAuth() {
      const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
      this.isLoggedIn = !!token;
      
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
          headers: this.getAuthHeaders() 
        });
        
        const data = res.data.data || res.data;
        this.userName = data?.fullName || data?.name || "User";
        if (data?.avatarUrl || data?.avatar_url || data?.avatar) {
            this.avatar = data.avatarUrl || data.avatar_url || data.avatar;
        }

      } catch (error) {
        console.error("Lỗi lấy thông tin Header:", error);
      }
    },

    toggleMenu() {
      this.showMenu = !this.showMenu;
    },

    handleClickOutside(e) {
      const userMenu = this.$el.querySelector('.user-menu');
      if (userMenu && !userMenu.contains(e.target)) {
        this.showMenu = false;
      }
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
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      
      this.isLoggedIn = false; 
      this.showMenu = false;
      
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.header-container {
  background-color: #d1f2d5;
  border-radius: 0 0 10px 10px;
}

/* NAV LINK */
.nav-link-custom {
  text-decoration: none;
  color: #333;
  padding: 8px 12px;
  background-color: #e8f7e9;
  border-radius: 5px;
  font-size: 0.9rem;
}

/* BUTTON */
.btn-light-custom {
  background-color: #e8f7e9;
  border: 1px solid #ccc;
}
.btn-dark-custom {
  background-color: #222;
  color: white;
}

/* USER */
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

/* DROPDOWN */
.dropdown-menu-custom {
  position: absolute;
  right: 0;
  top: 45px;
  background: white;
  border-radius: 6px;
  width: 180px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
  z-index: 1000;
}

.dropdown-item {
  padding: 10px 15px;
  cursor: pointer;
  transition: 0.2s;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.cursor-pointer {
  cursor: pointer;
}
</style>