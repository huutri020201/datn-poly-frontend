<template>
  <header class="header-container py-3 px-4 shadow-sm mb-5">
    <div
      class="container-fluid d-flex justify-content-between align-items-center"
    >
      <div class="logo">
        <img src="" alt="Logo" height="40" />
      </div>

      <nav class="d-flex align-items-center gap-3">
        <router-link to="/booking" class="nav-link-custom">Đặt sân</router-link>
        <router-link to="/products" class="nav-link-custom"
          >Phụ kiện</router-link
        >
        <router-link to="/info" class="nav-link-custom">Giới thiệu</router-link>
        <router-link to="/contact" class="nav-link-custom">Liên hệ</router-link>
        <div class="ms-3 d-flex gap-2">
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
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header-container {
  background-color: #d1f2d5; /* Màu xanh nhạt từ hình ảnh */
  border-radius: 0 0 10px 10px;
}
.nav-link-custom {
  text-decoration: none;
  color: #333;
  padding: 8px 12px;
  background-color: #e8f7e9;
  border-radius: 5px;
  font-size: 0.9rem;
}
.btn-light-custom {
  background-color: #e8f7e9;
  border: 1px solid #ccc;
}
.btn-dark-custom {
  background-color: #222;
  color: white;
}
</style>