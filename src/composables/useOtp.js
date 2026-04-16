import { ref, computed, inject } from "vue";
import authApi from "@/api/authApi";

// Đưa các biến State ra ngoài để tất cả các component dùng chung 1 trạng thái (Singleton)
const showOtpModal = ref(false);
const otpCode = ref("");
const otpError = ref("");
const countdown = ref(0);
const remainingAttempts = ref(5);
const loading = ref(false);
const isAttempted = ref(false);
let interval = null;

export function useOtp() {
  // inject phải nằm ở đây để ăn theo context của component gọi nó
  const notify = inject("$notify");

  const resetOtpState = () => {
    otpCode.value = "";
    otpError.value = "";
    remainingAttempts.value = 5; // <--- Quan trọng nhất: Reset về 5 cho User mới
    isAttempted.value = false;
    loading.value = false;
    stopCountdown();
    countdown.value = 0;
  };

  const displayTime = computed(() => {
    const minutes = Math.floor(countdown.value / 60);
    const seconds = countdown.value % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  });

  const stopCountdown = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  const startCountdown = (seconds) => {
    stopCountdown();
    countdown.value = Math.floor(seconds);
    interval = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--;
      } else {
        stopCountdown();
      }
    }, 1000);
  };

  const syncOtpState = (metadata) => {
    if (!metadata) return;

    if (metadata.remainingAttempts !== undefined) {
      remainingAttempts.value = metadata.remainingAttempts;
      // Nếu đã từng thử (lần thử < 5) thì bật cờ isAttempted
      if (remainingAttempts.value < 5) isAttempted.value = true;
    }

    if (remainingAttempts.value === 0) {
      otpError.value = "Bạn đã hết lượt thử. Vui lòng gửi lại mã mới!";
    }

    if (metadata.remainingSeconds) {
      startCountdown(metadata.remainingSeconds);
    }
  };

  const closeModal = () => {
    showOtpModal.value = false;
    otpCode.value = "";
    otpError.value = "";
    isAttempted.value = false;
    stopCountdown();
  };

  const resendOtpLogic = async (identifier, type) => {
    if (countdown.value > 0 || loading.value) return;
    try {
      loading.value = true;
      // Lưu ý: BE của mày trả về kết quả bọc trong .result do Interceptor
      const res = await authApi.resend({ identifier, type });

      otpCode.value = "";
      remainingAttempts.value = 5;
      isAttempted.value = false;

      // Đồng bộ lại state từ metadata trả về (thường là countdown mới)
      syncOtpState(res.metadata || res);
      notify?.success("Đã gửi lại mã xác thực mới!");
    } catch (error) {
      syncOtpState(error.metadata);
      notify?.error(error.message || "Gửi lại mã thất bại");
    } finally {
      loading.value = false;
    }
  };

  return {
    resetOtpState,
    showOtpModal,
    otpCode,
    otpError,
    countdown,
    remainingAttempts,
    loading,
    displayTime,
    startCountdown,
    stopCountdown,
    resendOtpLogic,
    closeModal,
    syncOtpState,
    isAttempted,
  };
}
