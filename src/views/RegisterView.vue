<template>
  <div>
    <h2 class="text-center text-secondary">Đăng ký</h2>

    <div
      class="login-page d-flex align-items-center justify-content-center py-5"
    >
      <div class="login-card p-4 shadow-sm">
        <h5 class="mb-3">Email hoặc Số điện thoại</h5>
        <input
          v-model="registerForm.identifier"
          type="text"
          class="form-control mb-3"
          placeholder="Nhập email hoặc số điện thoại"
        />

        <h5 class="mb-3">Mật khẩu</h5>
        <input
          v-model="registerForm.password"
          type="password"
          class="form-control mb-3"
          placeholder="Nhập mật khẩu"
        />
        <h5 class="mb-3">Nhập lại mật khẩu</h5>
        <input
          v-model="registerForm.confirmPassword"
          type="password"
          class="form-control mb-3"
          placeholder="Nhập lại mật khẩu"
        />

        <div v-if="errorMessage" class="alert alert-danger py-2 small">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="alert alert-success py-2 small">
          {{ successMessage }}
        </div>

        <button
          class="btn btn-dark-custom w-100 mt-2"
          @click="handleRegister"
          :disabled="loading"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          Đăng ký
        </button>
      </div>
    </div>
    <!-- OTP MODAL -->
    <div v-if="showOtpModal" class="otp-overlay">
      <div class="otp-modal">
        <h5 class="mb-3">Nhập mã OTP</h5>

        <input
          v-model="otp"
          type="text"
          class="form-control mb-3"
          placeholder="Nhập mã OTP"
        />

        <div class="d-flex gap-2">
          <button class="btn btn-success w-100" @click="verifyOtp">
            Xác nhận
          </button>

          <button class="btn btn-secondary w-100" @click="closeOtp">Hủy</button>
        </div>

        <div v-if="otpError" class="text-danger small mt-2">
          {{ otpError }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { registerByEmail, registerByPhone, verifyPhone } from "@/api/authApi";

const registerForm = reactive({
  identifier: "",
  password: "",
  confirmPassword: "",
});

const showOtpModal = ref(false);
const otp = ref("");
const otpError = ref("");
const phoneForOtp = ref("");

const errorMessage = ref("");
const successMessage = ref("");
const loading = ref(false);

const isEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};
const verifyOtp = async () => {
  otpError.value = "";

  if (!otp.value) {
    otpError.value = "Vui lòng nhập mã OTP";
    return;
  }

  try {
    await verifyPhone({
      phone: phoneForOtp.value,
      otpCode: otp.value,
    });

    showOtpModal.value = false;
    successMessage.value = "Xác thực thành công! Vui lòng đăng nhập!";
  } catch (error) {
    otpError.value = error.response?.data?.message || "OTP không hợp lệ!";
  }
};
const handleRegister = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  // 🔹 Check empty
  if (
    !registerForm.identifier ||
    !registerForm.password ||
    !registerForm.confirmPassword
  ) {
    errorMessage.value = "Vui lòng nhập đầy đủ thông tin!";
    return;
  }

  // 🔹 Check password length
  if (registerForm.password.length < 8) {
    errorMessage.value = "Mật khẩu phải tối thiểu 8 ký tự!";
    return;
  }

  // 🔹 Check confirm password
  if (registerForm.password !== registerForm.confirmPassword) {
    errorMessage.value = "Mật khẩu nhập lại không khớp!";
    return;
  }

  try {
    loading.value = true;

    if (isEmail(registerForm.identifier)) {
      await registerByEmail({
        email: registerForm.identifier,
        password: registerForm.password,
        confirmPassword: registerForm.confirmPassword,
      });

      successMessage.value =
        "Đăng ký email thành công! Vui lòng kiểm tra email để xác thực.";
    } else {
      await registerByPhone({
        phone: registerForm.identifier,
        password: registerForm.password,
        confirmPassword: registerForm.confirmPassword,
      });

      successMessage.value =
        "Đăng ký số điện thoại thành công! Vui lòng nhập OTP.";

      phoneForOtp.value = registerForm.identifier;
      showOtpModal.value = true;
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Đăng ký thất bại!";
  } finally {
    loading.value = false;
  }
};
</script>
<style scoped>
.login-page {
  min-height: 60vh;
}

.login-card {
  background-color: #d1f2d5;
  width: 100%;
  max-width: 500px;
  border-radius: 15px;
}

.btn-dark-custom {
  background-color: #222;
  color: white;
  border-radius: 8px;
}

.btn-dark-custom:hover {
  background-color: #444;
}
.otp-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.otp-modal {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  max-width: 350px;
}
</style>