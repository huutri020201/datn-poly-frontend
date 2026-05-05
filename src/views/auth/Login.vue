<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useOtp } from "@/composables/useOtp";
import OtpModal from "@/views/auth/OtpModal.vue";

const router = useRouter();
const authStore = useAuthStore();
const {
  showOtpModal,
  startCountdown,
  remainingAttempts,
  otpError,
  otpCode,
  resetOtpState,
} = useOtp();

const loginForm = reactive({
  identifier: "",
  password: "",
  rememberMe: false,
});

const rememberMe = ref(false);
const loading = ref(false);
const errorMessage = ref("");

const handleLogin = async () => {
  errorMessage.value = "";

  try {
    loading.value = true;
    await authStore.loginUser(loginForm, loginForm.rememberMe);
    router.push("/");
  } catch (error) {
    const errCode = error.code;
    const errMessage = (error.message || "").toLowerCase();
    const identifier = loginForm.identifier || "";
    const isEmail = identifier.includes("@");

    if (errCode === 1004 || errMessage.includes("chưa xác thực")) {
      const meta = error.metadata;
      if (isEmail) {
        notify.info(
          "Tài khoản chưa xác thực. Một email chứa liên kết xác nhận đã được gửi vào hòm thư của bạn!",
        );
      } else {
        resetOtpState();

        if (meta && typeof meta.remainingAttempts !== "undefined") {
          remainingAttempts.value = meta.remainingAttempts;
        } else {
          // Nếu BE không trả về meta, mặc định là 5 để người dùng có thể nhập
          remainingAttempts.value = 5;
        }

        // Cập nhật thời gian đếm ngược
        const seconds = meta?.remainingSeconds || 120;

        otpCode.value = "";
        otpError.value = "";

        // Nếu thực sự hết lượt
        if (remainingAttempts.value === 0) {
          otpError.value =
            "Mã OTP này đã hết lượt thử. Vui lòng đợi gửi lại mã mới!";
        }

        showOtpModal.value = true;
        startCountdown(seconds);
      }
      return;
    }

    errorMessage.value = error.message || "Đăng nhập thất bại!";
  } finally {
    loading.value = false;
  }
};

const handleOtpSuccess = () => {
  showOtpModal.value = false;
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="text-center mb-4">
        <h2 class="fw-bold">Đăng nhập</h2>
        <p class="text-muted small">Chào mừng bạn quay trở lại</p>
      </div>

      <div class="form-body">
        <div class="mb-3">
          <label class="form-label small fw-bold">Tài khoản</label>
          <div class="input-group-custom">
            <i class="bi bi-person input-icon"></i>
            <input
              v-model="loginForm.identifier"
              type="text"
              class="custom-input"
              placeholder="Email hoặc Số điện thoại"
              @keyup.enter="handleLogin"
            />
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label small fw-bold">Mật khẩu</label>
          <div class="input-group-custom">
            <i class="bi bi-lock input-icon"></i>
            <input
              v-model="loginForm.password"
              type="password"
              class="custom-input"
              placeholder="********"
              @keyup.enter="handleLogin"
            />
          </div>
        </div>

        <div v-if="errorMessage" class="alert alert-danger py-2 small mb-3">
          {{ errorMessage }}
        </div>

        <button
          class="btn btn-dark-custom w-100 mt-2"
          @click="handleLogin"
          :disabled="loading"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          Đăng nhập
        </button>

        <div class="text-center mt-4">
          <p class="text-muted small">
            Chưa có tài khoản?
            <router-link
              to="/register"
              class="text-dark fw-bold text-decoration-underline"
              >Đăng ký ngay</router-link
            >
          </p>
        </div>

        <div class="text-center mb-3">
          <div class="d-flex justify-content-center align-items-center">
            <router-link
              to="/forgot-password"
              class="small forgot-password-link text-decoration-none"
            >
              Quên mật khẩu?
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <OtpModal
      :identifier="loginForm.identifier"
      :mode="'REGISTER'"
      @success="handleOtpSuccess"
    />
  </div>
</template>

<style scoped>
@import "@/assets/styles/auth.css";
</style>
