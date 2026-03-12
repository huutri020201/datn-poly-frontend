<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const loginForm = reactive({
  username: "",
  password: "",
});

const errorMessage = ref("");

const handleLogin = async () => {
  errorMessage.value = "";

  if (!loginForm.username || !loginForm.password) {
    errorMessage.value = "Vui lòng nhập đầy đủ thông tin!";
    return;
  }

  try {
    await authStore.loginUser(loginForm);

    // Login thành công → chuyển trang
    router.push("/admin");
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Sai tài khoản hoặc mật khẩu!";
  }
};
</script>
<template>
  <div>
    <h2 class="text-center text-secondary">Đăng nhập</h2>
    <div
      class="login-page d-flex align-items-center justify-content-center py-5"
    >
      <div class="login-card p-4 shadow-sm">
        <h5 class="mb-4 fw-normal">Tài khoản</h5>
        <div class="mb-4">
          <input
            v-model="loginForm.username"
            type="text"
            class="form-control custom-input"
            placeholder="Nhập tài khoản"
          />
        </div>

        <h5 class="mb-4 fw-normal">Mật khẩu</h5>
        <div class="mb-4">
          <input
            v-model="loginForm.password"
            type="password"
            class="form-control custom-input"
            placeholder="Nhập mật khẩu"
            @keyup.enter="handleLogin"
          />
        </div>

        <div v-if="errorMessage" class="alert alert-danger py-2 small">
          {{ errorMessage }}
        </div>

        <div class="d-flex gap-2 mb-4">
          <button
            @click="handleLogin"
            class="btn btn-dark-custom px-4 py-2"
            :disabled="authStore.loading"
          >
            <span
              v-if="authStore.loading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            Đăng nhập
          </button>
          <button class="btn btn-dark-custom px-4 py-2">Google</button>
        </div>

        <div class="text-center mt-4">
          <a href="#" class="text-dark d-block mb-2 text-decoration-underline"
            >Quên mật khẩu?</a
          >
          <router-link
            to="/register"
            class="text-dark d-block text-decoration-underline"
          >
            Chưa có tài khoản? Đăng ký ngay!
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  /* Chiều cao tối thiểu để form nằm giữa màn hình */
  min-height: 60vh;
}

.login-card {
  background-color: #d1f2d5; /* Màu xanh mint giống trong ảnh */
  width: 100%;
  max-width: 500px;
  border-radius: 15px;
}

.custom-input {
  border: none;
  border-radius: 8px;
  padding: 12px 15px;
}

.custom-input:focus {
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.5);
}

.btn-dark-custom {
  background-color: #222;
  color: white;
  border-radius: 8px;
  flex: 1; /* Để 2 nút có độ dài bằng nhau */
}

.btn-dark-custom:hover {
  background-color: #444;
  color: white;
}

a {
  font-size: 0.9rem;
}
</style>