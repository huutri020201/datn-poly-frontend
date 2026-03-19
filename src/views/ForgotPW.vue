<template>
  <div class="forgot-password-page d-flex align-items-center justify-content-center py-5">
    <div class="forgot-card p-4 shadow-sm">
      <h3 class="text-center mb-4 fw-bold text-secondary">Khôi phục mật khẩu</h3>

      <div v-if="step === 1">
        <p class="text-muted small mb-4">Nhập Email hoặc Số điện thoại đã đăng ký để nhận mã xác thực OTP.</p>
        <div class="mb-4">
          <label class="form-label fw-bold">Email / Số điện thoại</label>
          <input v-model="request.identifier" type="text" class="form-control custom-input" placeholder="Ví dụ: example@gmail.com" @keyup.enter="handleSendOtp" />
        </div>
        <button @click="handleSendOtp" class="btn btn-dark-custom w-100 py-2" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span> GỬI MÃ XÁC THỰC
        </button>
      </div>

      <div v-if="step === 2">
        <p class="text-muted small mb-3">Mã OTP đã được gửi đến: <b>{{ request.identifier }}</b></p>
        
        <div class="mb-3">
          <label class="form-label fw-bold">Mã OTP (6 số)</label>
          <input v-model="request.otpCode" type="text" class="form-control custom-input text-center fs-4 fw-bold" maxlength="6" placeholder="000000" />
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Mật khẩu mới</label>
          <input v-model="request.newPassword" type="password" class="form-control custom-input" placeholder="Ít nhất 6 ký tự" />
        </div>

        <div class="mb-4">
          <label class="form-label fw-bold">Xác nhận mật khẩu</label>
          <input v-model="request.confirmPassword" type="password" class="form-control custom-input" placeholder="Nhập lại mật khẩu mới" />
        </div>

        <div v-if="errorMessage" class="alert alert-danger py-2 small">{{ errorMessage }}</div>

        <button @click="handleResetPassword" class="btn btn-dark-custom w-100 py-2 mb-3" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span> XÁC NHẬN ĐỔI MẬT KHẨU
        </button>
        
        <div class="text-center">
          <button class="btn btn-link text-dark text-decoration-none small" @click="step = 1">Quay lại</button>
        </div>
      </div>

      <div class="text-center mt-4">
        <router-link to="/login" class="text-dark small text-decoration-underline">Quay lại Đăng nhập</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const step = ref(1);
const loading = ref(false);
const errorMessage = ref('');

const request = reactive({
  identifier: '',
  otpCode: '',
  newPassword: '',
  confirmPassword: ''
});

const handleSendOtp = async () => {
  if (!request.identifier) return alert("Vui lòng nhập Email hoặc SĐT!");
  
  loading.value = true;
  errorMessage.value = "";
  
  try {
    const method = request.identifier.includes('@') ? 'EMAIL' : 'TELEGRAM';

    await axios.post('http://localhost:8080/auth/send-otp-reset', { 
      identifier: request.identifier,
      method: method 
    });
    
    alert("Mã OTP đã được gửi!");
    step.value = 2;
  } catch (error) {
    console.error("Validation Error:", error.response?.data);
    alert(error.response?.data?.message || "Lỗi gửi OTP!");
  } finally {
    loading.value = false;
  }
};

const handleResetPassword = async () => {
  if (request.newPassword !== request.confirmPassword) {
    errorMessage.value = "Mật khẩu xác nhận không khớp!";
    return;
  }
  if (request.otpCode.length < 6) {
    errorMessage.value = "Vui lòng nhập đủ 6 số OTP!";
    return;
  }

  loading.value = true;
  try {
    await axios.post('http://localhost:8080/auth/reset-password', {
      loginIdentifier: request.identifier,
      otp: request.otpCode,
      newPassword: request.newPassword,
      confirmPassword: request.confirmPassword
    });

    alert("Mật khẩu đã được thay đổi thành công!");
    router.push('/login');
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn!";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.forgot-password-page {
  min-height: 80vh;
  background-color: #f8f9fa;
}

.forgot-card {
  background-color: #d1f2d5; 
  width: 100%;
  max-width: 450px;
  border-radius: 15px;
}

.custom-input {
  border: none;
  border-radius: 8px;
  padding: 12px 15px;
}

.custom-input:focus {
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.btn-dark-custom {
  background-color: #222;
  color: white;
  border-radius: 8px;
  font-weight: bold;
}

.btn-dark-custom:hover {
  background-color: #444;
}
</style>