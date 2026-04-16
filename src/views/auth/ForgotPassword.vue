<script setup>
import { ref, reactive, computed, inject } from "vue";
import { useRouter } from "vue-router";
import authApi from "@/api/authApi";
import { useOtp } from "@/composables/useOtp";
import OtpModal from "@/views/auth/OtpModal.vue";

const router = useRouter();
const notify = inject("$notify");
const { showOtpModal, syncOtpState, closeModal, resetOtpState } = useOtp();

// --- STATE QUẢN LÝ ---
const step = ref(1);
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const selectedMethod = ref("");
const foundAccount = ref(null); // Dữ liệu mask từ BE trả về { email, phone }
const resetToken = ref(""); // Token nhận được sau khi verify thành công

const forgotForm = reactive({
  identifier: "", // Email hoặc SĐT người dùng nhập
  newPassword: "",
  confirmPassword: "",
});

// --- COMPUTED KIỂM TRA PHƯƠNG THỨC ---
// Vì BE trả về key "email" và "phone" đã được mask sẵn
const hasEmail = computed(() => !!foundAccount.value?.email);
const hasPhone = computed(() => !!foundAccount.value?.phone);

// --- CÁC HÀM XỬ LÝ ---

// Bước 1: Tìm tài khoản
const handleFindAccount = async () => {
  if (!forgotForm.identifier) {
    notify.warning("Vui lòng nhập Email hoặc Số điện thoại!");
    return;
  }

  errorMessage.value = "";
  try {
    loading.value = true;
    const res = await authApi.findAccount(forgotForm.identifier);
    // res.result là Map { email: "...", phone: "..." }
    foundAccount.value = res;
    step.value = 2;
  } catch (error) {
    errorMessage.value = error.message || "Tài khoản không tồn tại!";
    notify.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
};

// Bước 2: Gửi OTP (Sau khi chọn phương thức)
const handleSendOtp = async () => {
  if (!selectedMethod.value) return;

  try {
    loading.value = true;
    errorMessage.value = "";

    // Gọi API BE mày vừa định hướng (Gửi identifier + method)
    const res = await authApi.sendOtpForReset({
      identifier: forgotForm.identifier,
      method: selectedMethod.value,
      type: "FORGOT_PASSWORD",
    });

    // Đồng bộ countdown từ metadata
    if (res.metadata) {
      syncOtpState(res.metadata);
    }

    showOtpModal.value = true;
  } catch (error) {
    errorMessage.value = error.message || "Không thể gửi mã OTP!";
    notify.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
};

// Bước 3: Khi OTP Modal báo thành công (User đã nhập đúng 6 số)
// OtpModal sẽ gọi router.push hoặc emit, ở đây ta dùng emit thành công
const onOtpSuccess = (data) => {
  console.log("Dữ liệu xác thực thành công:", data);
  if (data?.resetToken) {
    resetToken.value = data.resetToken;
    showOtpModal.value = false;
    step.value = 3;
    notify.success("Xác thực thành công. Vui lòng đặt mật khẩu mới!");
  }
};

// Bước 4: Đặt lại mật khẩu cuối cùng
const handleResetPassword = async () => {
  if (forgotForm.newPassword !== forgotForm.confirmPassword) {
    errorMessage.value = "Mật khẩu xác nhận không khớp!";
    return;
  }

  try {
    loading.value = true;
    errorMessage.value = "";

    await authApi.resetPassword({
      resetToken: resetToken.value, // Dùng token "vé thông hành" từ BE
      newPassword: forgotForm.newPassword,
      confirmPassword: forgotForm.confirmPassword,
    });

    successMessage.value = "Đặt lại mật khẩu thành công!";
    notify.success(successMessage.value);

    setTimeout(() => {
      resetOtpState(); // Dọn dẹp state
      router.push("/login");
    }, 2000);
  } catch (error) {
    errorMessage.value = error.message;
    notify.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-card animate__animated animate__fadeIn">
      <h2 class="text-center fw-bold mb-4">Quên mật khẩu</h2>

      <div v-if="step === 1">
        <div class="mb-3">
          <label class="form-label small fw-bold"
            >Nhập Email hoặc Số điện thoại</label
          >
          <input
            v-model="forgotForm.identifier"
            type="text"
            class="custom-input"
            placeholder="example@gmail.com hoặc 09..."
            @keyup.enter="handleFindAccount"
          />
        </div>
        <button
          class="btn btn-dark-custom w-100"
          @click="handleFindAccount"
          :disabled="loading"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          Tìm tài khoản
        </button>
      </div>

      <div v-if="step === 2" class="text-center">
        <p class="small text-muted mb-4">
          Hãy chọn nơi bạn muốn nhận mã xác thực để khôi phục tài khoản:
        </p>

        <div class="method-selection mb-4">
          <label
            v-if="hasEmail"
            class="method-card d-flex align-items-center p-3 mb-2 border rounded cursor-pointer"
            :class="{ 'active-method': selectedMethod === 'EMAIL' }"
            @click="selectedMethod = 'EMAIL'"
          >
            <input
              type="radio"
              value="EMAIL"
              v-model="selectedMethod"
              class="me-3 custom-radio"
            />
            <div class="text-start">
              <div class="fw-bold small">Gửi mã qua Email</div>
              <div class="text-muted smaller">{{ foundAccount.email }}</div>
            </div>
          </label>

          <label
            v-if="hasPhone"
            class="method-card d-flex align-items-center p-3 mb-3 border rounded cursor-pointer"
            :class="{ 'active-method': selectedMethod === 'PHONE' }"
            @click="selectedMethod = 'PHONE'"
          >
            <input
              type="radio"
              value="PHONE"
              v-model="selectedMethod"
              class="me-3 custom-radio"
            />
            <div class="text-start">
              <div class="fw-bold small">Gửi mã qua Số điện thoại</div>
              <div class="text-muted smaller">{{ foundAccount.phone }}</div>
            </div>
          </label>
        </div>

        <button
          class="btn btn-dark-custom w-100 mb-2"
          @click="handleSendOtp"
          :disabled="loading || !selectedMethod"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          Xác nhận gửi mã
        </button>

        <button
          class="btn btn-link btn-sm text-decoration-none text-muted w-100"
          @click="step = 1"
        >
          Không phải tài khoản của bạn? Thử lại
        </button>
      </div>

      <div v-if="step === 3" class="animate__animated animate__fadeIn">
        <h4 class="fw-bold mb-3">Đặt lại mật khẩu mới</h4>
        <div class="mb-3">
          <label>Mật khẩu mới</label>
          <input
            v-model="forgotForm.newPassword"
            type="password"
            class="form-control"
          />
        </div>
        <div class="mb-3">
          <label>Xác nhận mật khẩu</label>
          <input
            v-model="forgotForm.confirmPassword"
            type="password"
            class="form-control"
          />
        </div>
        <button @click="handleResetPassword" class="btn btn-primary w-100">
          Cập nhật mật khẩu
        </button>
      </div>

      <div v-if="errorMessage" class="alert alert-danger mt-3 py-2 small">
        {{ errorMessage }}
      </div>

      <div class="text-center mt-4">
        <router-link to="/login" class="small text-muted text-decoration-none">
          <i class="bi bi-arrow-left me-1"></i> Quay lại đăng nhập
        </router-link>
      </div>
    </div>

    <OtpModal
      v-if="showOtpModal"
      :identifier="forgotForm.identifier"
      :mode="'FORGOT_PASSWORD'"
      @success="onOtpSuccess"
      @close="showOtpModal = false"
    />
  </div>
</template>
<style scoped>
@import "@/assets/styles/auth.css";
</style>
