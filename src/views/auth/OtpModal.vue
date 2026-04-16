<script setup>
import { ref, defineProps, defineEmits, computed, inject } from "vue";
import { useOtp } from "@/composables/useOtp";
import authApi from "@/api/authApi";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

// 1. Khai báo Props (Chỉ khai báo kiểu, không gán biến cục bộ)
const props = defineProps({
  identifier: String,
  mode: { type: String, default: "REGISTER" },
});

const emit = defineEmits(["close", "success"]);
const authStore = useAuthStore();
const router = useRouter();
const notify = inject("$notify");
const isSuccess = ref(false);

// 2. Lấy logic từ composable (Singleton)
const {
  showOtpModal,
  otpCode,
  otpError,
  countdown,
  remainingAttempts,
  loading,
  displayTime,
  resendOtpLogic,
  closeModal,
  syncOtpState,
  isAttempted,
} = useOtp();

// 3. Logic hiển thị ID (ẩn bớt thông tin)
const displayIdentifier = computed(() => {
  if (!props.identifier) return "";
  const id = props.identifier;
  if (id.includes("@")) {
    const [user, domain] = id.split("@");
    return `${user.substring(0, 2)}***@${domain}`;
  }
  return id.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2");
});

// 4. Hàm verify gọi API
const handleVerify = async () => {
  if (!otpCode.value || otpCode.value.length < 6) {
    notify.warning("Vui lòng nhập đủ 6 số!");
    return;
  }

  try {
    loading.value = true;
    otpError.value = "";

    const res = await authApi.verify({
      identifier: props.identifier,
      code: otpCode.value.trim(),
      type: props.mode,
    });

    const dataInside = res.result || res;

    isSuccess.value = true;

    await new Promise((resolve) => setTimeout(resolve, 1500));
    notify.success("Xác thực thành công!");

    emit("success", dataInside);

    if (props.mode === "FORGOT_PASSWORD") {
      closeModal();
    } else {
      if (dataInside.auth) {
        // Nếu BE trả về token login luôn (auto login sau khi verify)
        await authStore.handleLoginSuccess(dataInside.auth, false);
        closeModal();
        router.push("/");
      } else {
        closeModal();
        router.push("/login");
      }
    }
    isSuccess.value = false;
  } catch (error) {
    console.log("❌ Full Error Object từ BE:", error);
    isAttempted.value = true;

    if (error.metadata) syncOtpState(error.metadata);
    notify.error(error.message || "Mã OTP không chính xác!");
    otpError.value = error.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    v-if="showOtpModal"
    class="otp-modal-overlay"
    style="
      z-index: 999999 !important;
      position: fixed !important;
      display: flex !important;
    "
    @click.self="closeModal"
  >
    <div class="otp-card shadow-lg">
      <div v-if="!isSuccess" class="animate__animated animate__fadeIn">
        <h4 class="fw-bold mb-3">Xác thực OTP</h4>
        <p class="text-muted small">
          Mã đã được gửi tới <b class="text-dark">{{ displayIdentifier }}</b>
        </p>

        <input
          v-model="otpCode"
          type="text"
          class="form-control text-center otp-input mb-3"
          placeholder="Nhập 6 số"
          maxlength="6"
          :disabled="loading || remainingAttempts === 0"
          @keyup.enter="handleVerify"
        />

        <div v-if="isAttempted" class="small mb-3">
          <span
            :class="
              remainingAttempts <= 2 ? 'text-danger fw-bold' : 'text-muted'
            "
          >
            Số lần thử còn lại: {{ remainingAttempts }}
          </span>
        </div>

        <button
          class="btn btn-dark w-100 mb-3"
          @click="handleVerify"
          :disabled="loading || otpCode.length < 6 || remainingAttempts === 0"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          Xác thực
        </button>

        <div class="resend-section border-top pt-3">
          <p class="small text-muted mb-2" v-if="countdown > 0">
            Gửi lại mã sau:
            <span class="text-primary fw-bold">{{ displayTime }}</span>
          </p>
          <button
            class="btn w-100"
            :class="countdown > 0 ? 'btn-outline-secondary' : 'btn-dark'"
            :disabled="countdown > 0 || loading"
            @click="resendOtpLogic(props.identifier, props.mode)"
          >
            Gửi lại mã
          </button>
        </div>
      </div>

      <div v-else class="text-center py-4 animate__animated animate__zoomIn">
        <div class="mb-3 success-icon">✅</div>
        <h4 class="fw-bold text-success">XÁC THỰC THÀNH CÔNG</h4>
        <p class="text-muted">
          {{
            props.mode === "FORGOT_PASSWORD"
              ? "Đang chuyển bạn đến trang đặt lại mật khẩu..."
              : "Đang đăng nhập vào hệ thống..."
          }}
        </p>
        <div class="spinner-border spinner-border-sm text-success"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Lớp nền mờ phủ toàn màn hình */
.otp-modal-overlay {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5); /* Làm tối nền vừa phải */
  backdrop-filter: blur(4px); /* Làm mờ hậu cảnh nhìn cho sang */
  display: flex !important;
  justify-content: center; /* Căn giữa ngang */
  align-items: center; /* Căn giữa dọc */
  z-index: 999999;
}

/* Thẻ Modal nhỏ gọn */
.otp-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 20px; /* Bo góc tròn trịa */
  width: 100%;
  max-width: 380px; /* Giới hạn độ rộng lại cho nhỏ gọn */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  position: relative;
  text-align: center;
  border: none;
  margin: 0 20px; /* Cách lề tí khi xem trên điện thoại */
}

/* Tinh chỉnh input cho đẹp */
.otp-input {
  font-size: 1.5rem;
  letter-spacing: 0.5rem;
  font-weight: bold;
  height: 55px;
  border-radius: 12px;
  border: 2px solid #eee;
  transition: all 0.3s;
}

.otp-input:focus {
  border-color: #000;
  box-shadow: none;
}

/* Hiệu ứng icon thành công */
.success-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}
</style>
