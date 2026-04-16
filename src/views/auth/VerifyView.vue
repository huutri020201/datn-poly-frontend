<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import api from "@/api/axiosClient"; // Import cái api/axios của mày

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const status = ref("processing"); // processing, success, error

onMounted(async () => {
  const { token, identifier, type } = route.query;

  if (!token || !identifier) {
    status.value = "error";
    return;
  }

  try {
    const res = await api.post("/auth/verify", {
      code: token,
      identifier: identifier,
      type: type || "REGISTER",
    });

    console.log("Verify Data thực tế:", res);

    // VÌ INTERCEPTOR ĐÃ BÓC TÁCH, NÊN 'res' CHÍNH LÀ DỮ LIỆU CẦN TÌM
    // Không cần dùng res.result hay res.data gì nữa.
    const dataInside = res;

    if (dataInside && dataInside.verified === true) {
      status.value = "success";

      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (dataInside.auth) {
        console.log("Đang tiến hành Auto-login với data:", dataInside.auth);
        await authStore.handleLoginSuccess(dataInside.auth, true);

        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else if (dataInside.resetToken) {
        router.push({
          path: "/reset-password",
          query: { token: dataInside.resetToken, identifier: identifier },
        });
      }
    } else {
      console.warn("Dữ liệu verified không hợp lệ:", dataInside);
      status.value = "error";
    }
  } catch (error) {
    console.error("Lỗi thực tế tại VerifyView:", error);
    status.value = "error";
  }
});
</script>

<template>
  <div class="verify-overlay">
    <div class="verify-card shadow-lg animate__animated animate__zoomIn">
      <div v-if="status === 'processing'" class="text-center p-4">
        <div
          class="spinner-grow text-primary mb-3"
          style="width: 3rem; height: 3rem"
        ></div>
        <h5 class="fw-bold">ĐANG XÁC THỰC</h5>
        <p class="text-muted">Vui lòng chờ trong giây lát...</p>
      </div>

      <div v-if="status === 'success'" class="text-center p-4">
        <div class="success-icon mb-3">✅</div>
        <h4 class="text-success fw-bold">THÀNH CÔNG!</h4>
        <p>Tài khoản đã được xác thực.<br />Hệ thống đang chuyển hướng...</p>
      </div>

      <div v-if="status === 'error'" class="text-center p-4">
        <div class="error-icon mb-3">❌</div>
        <h4 class="text-danger fw-bold">THẤT BẠI</h4>
        <p class="text-muted">Link đã hết hạn hoặc không hợp lệ.</p>
        <router-link to="/login" class="btn btn-dark w-100 mt-3"
          >Quay lại Đăng nhập</router-link
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.verify-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.8); /* Nền trắng trong suốt */
  backdrop-filter: blur(10px); /* Hiệu ứng làm mờ phía sau */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.verify-card {
  background: white;
  padding: 2rem;
  border-radius: 24px;
  width: 100%;
  max-width: 400px;
  border: 1px solid #eee;
}

.success-icon {
  font-size: 4rem;
  animation: pulse 1s infinite;
}
.error-icon {
  font-size: 4rem;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
