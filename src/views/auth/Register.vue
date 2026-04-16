<script setup>
import { reactive, ref, inject } from "vue";
import { useRouter } from "vue-router";
import authApi from "@/api/authApi";
import { useOtp } from "@/composables/useOtp";
import OtpModal from "@/views/auth/OtpModal.vue";

const router = useRouter();
const notify = inject("$notify");

const { showOtpModal, syncOtpState, resetOtpState } = useOtp();

const activeTab = ref("email"); // 'email' hoặc 'phone'
const loading = ref(false);

const registerForm = reactive({
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

// Getter để lấy identifier dựa trên tab đang hoạt động
const currentIdentifier = () => {
  return activeTab.value === "email" ? registerForm.email : registerForm.phone;
};

const resetForm = () => {
  registerForm.email = "";
  registerForm.phone = "";
  registerForm.password = "";
  registerForm.confirmPassword = "";
};

const switchTab = (tab) => {
  if (activeTab.value !== tab) {
    activeTab.value = tab;
    // Không reset Pass, chỉ reset identifier để user đỡ gõ lại pass nếu đổi ý
    registerForm.email = "";
    registerForm.phone = "";
  }
};

const handleRegister = async () => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^(0|84)(3|5|7|8|9)[0-9]{8}$/;

  const identifier = currentIdentifier();

  // Validate nhanh
  if (activeTab.value === "email" && !emailRegex.test(identifier)) {
    notify.warning("Định dạng Email không hợp lệ!");
    return;
  }
  if (activeTab.value === "phone" && !phoneRegex.test(identifier)) {
    notify.warning("Số điện thoại không hợp lệ!");
    return;
  }
  if (registerForm.password.length < 8) {
    notify.error("Mật khẩu phải ít nhất 8 ký tự!");
    return;
  }
  if (registerForm.password !== registerForm.confirmPassword) {
    notify.error("Mật khẩu xác nhận không khớp!");
    return;
  }

  try {
    loading.value = true;
    const res = await authApi.register({
      identifier: identifier,
      password: registerForm.password,
      confirmPassword: registerForm.confirmPassword,
    });

    const message = res.message || "Mã xác thực đã được gửi!";
    notify.success(message);
    resetOtpState();

    if (activeTab.value === "phone") {
      // Nếu là Phone thì mới hiện Modal nhập mã
      resetOtpState();
      showOtpModal.value = true;
      if (res.metadata) syncOtpState(res.metadata);
    } else {
      // Nếu là Email thì hiện thông báo và KHÔNG mở Modal
      notify.success(
        "Một liên kết xác nhận đã được gửi đến Email của bạn. Vui lòng kiểm tra hộp thư!",
      );
    }
  } catch (error) {
    // Xử lý lỗi từ BE (dựa trên ErrorCode mà mình đã làm ở Service)
    if (error.code === 1004) {
      notify.info("Tài khoản đang chờ xác thực.");
      if (error.metadata) syncOtpState(error.metadata);
      showOtpModal.value = true;
    } else {
      notify.error(error.message || "Đăng ký thất bại!");
    }
  } finally {
    loading.value = false;
  }
};

const onOtpSuccess = (data) => {
  // Vì trong OtpModal mình đã xử lý handleLoginSuccess rồi,
  // nên ở đây chỉ cần đóng modal và thông báo thôi.
  showOtpModal.value = false;
  router.push("/");
};
</script>

<template>
  <div>
    <div class="auth-page">
      <div class="auth-card">
        <div class="text-center mb-4">
          <h2 class="fw-bold">Đăng ký</h2>
          <p class="text-muted small">Khám phá kiến thức mới cùng chúng tôi</p>
        </div>

        <div class="nav-tabs-custom mb-4">
          <button
            :class="['tab-btn', { active: activeTab === 'email' }]"
            @click="switchTab('email')"
          >
            <i class="bi bi-envelope me-2"></i>Email
          </button>
          <button
            :class="['tab-btn', { active: activeTab === 'phone' }]"
            @click="switchTab('phone')"
          >
            <i class="bi bi-phone me-2"></i>SĐT
          </button>
        </div>

        <div class="form-body">
          <div class="mb-3">
            <label class="form-label small fw-bold">{{
              activeTab === "email" ? "Email" : "Số điện thoại"
            }}</label>
            <div class="input-group-custom">
              <i
                :class="[
                  activeTab === 'email' ? 'bi-envelope-at' : 'bi-telephone',
                  'input-icon',
                ]"
              ></i>
              <input
                v-if="activeTab === 'email'"
                v-model="registerForm.email"
                type="email"
                class="custom-input"
                placeholder="example@gmail.com"
                @keyup.enter="handleRegister"
              />
              <input
                v-else
                v-model="registerForm.phone"
                type="tel"
                class="custom-input"
                placeholder="09xxxxxxxx"
                @keyup.enter="handleRegister"
              />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold">Mật khẩu</label>
            <div class="input-group-custom">
              <i class="bi bi-lock input-icon"></i>
              <input
                v-model="registerForm.password"
                type="password"
                class="custom-input"
                placeholder="********"
              />
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label small fw-bold">Nhập lại mật khẩu</label>
            <div class="input-group-custom">
              <i class="bi bi-shield-check input-icon"></i>
              <input
                v-model="registerForm.confirmPassword"
                type="password"
                class="custom-input"
                placeholder="********"
                @keyup.enter="handleRegister"
              />
            </div>
          </div>

          <button
            class="btn btn-dark-custom w-100"
            @click="handleRegister"
            :disabled="loading"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            Gửi mã xác nhận
          </button>

          <div class="text-center mt-4">
            <p class="text-muted small">
              Đã có tài khoản?
              <router-link
                to="/login"
                class="text-dark fw-bold text-decoration-underline"
                >Đăng nhập</router-link
              >
            </p>
          </div>
        </div>
      </div>
    </div>

    <OtpModal
      :identifier="currentIdentifier()"
      mode="REGISTER"
      @success="onOtpSuccess"
    />
  </div>
</template>

<style scoped>
@import "@/assets/styles/auth.css";
</style>
