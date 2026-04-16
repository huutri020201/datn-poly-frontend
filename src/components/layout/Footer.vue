<template>
  <footer class="footer-container py-5 px-4 mt-auto">
    <div class="container">
      <div class="row">
        <div class="col-md-3">
          <div class="logo cursor-pointer" @click="$router.push('/')">
            <img
              src="https://i.pravatar.cc/40"
              alt="Logo"
              height="40"
              @error="(e) => (e.target.style.display = 'none')"
            />
            <span v-if="!hasLogo" class="fw-bold fs-4">SPORT SHOP</span>
          </div>
          <div class="social-icons d-flex gap-3">
            <i class="bi bi-twitter-x"></i>
            <i class="bi bi-instagram"></i>
            <i class="bi bi-youtube"></i>
            <i class="bi bi-linkedin"></i>
          </div>
        </div>

        <div class="col-md-3">
          <h5 class="fw-bold mb-3">Lối tắt</h5>
          <ul class="list-unstyled">
            <li class="mb-2">
              <router-link to="/booking" class="text-decoration-none text-dark"
                >Đặt sân</router-link
              >
            </li>
            <li class="mb-2">
              <router-link to="/products" class="text-decoration-none text-dark"
                >Phụ kiện</router-link
              >
            </li>
            <li class="mb-2">
              <router-link to="/info" class="text-decoration-none text-dark"
                >Giới thiệu</router-link
              >
            </li>
            <li class="mb-2">
              <router-link to="/contact" class="text-decoration-none text-dark"
                >Liên hệ</router-link
              >
            </li>
          </ul>
        </div>

        <div class="col-md-3">
          <h5 class="fw-bold mb-3">Về chúng tôi</h5>
          <ul class="list-unstyled">
            <li class="mb-2">
              <a href="#" class="text-decoration-none text-dark">Giới thiệu</a>
            </li>
            <li class="mb-2">
              <a href="#" class="text-decoration-none text-dark"
                >Lịch sử hình thành</a
              >
            </li>
            <li class="mb-2">
              <a href="#" class="text-decoration-none text-dark"
                >Dịch vụ cung cấp</a
              >
            </li>
          </ul>
        </div>

        <div class="col-md-3">
          <h5 class="fw-bold mb-3">Thông tin liên hệ</h5>
          <p class="mb-1">Tổng đài: 028666888999</p>
          <p class="mb-1 small">
            Địa chỉ: 200 Tân Sơn Nhì, Phường Tân Sơn Nhì, TP Hồ Chí Minh
          </p>
          <p class="mb-1">Email: bookingpickleball@booking.com</p>
          <p class="small text-muted mt-3">
            Mọi thắc mắc xin vui lòng liên hệ với chúng tôi để được giải đáp kịp
            thời
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from "vue";
const hasLogo = ref(true);
</script>
<style scoped>
.footer-container {
  background-color: #d1f2d5;
}
.social-icons i {
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
