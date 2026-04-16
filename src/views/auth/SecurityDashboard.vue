<template>
  <Teleport to="body">
    <div class="security-overlay" @click.self="$emit('close')">
      <div class="security-card shadow-lg">
        <div class="dashboard-container">
          <aside class="sidebar">
            <h5 class="p-3 fw-bold border-bottom">Bảo mật</h5>
            <div class="list-group list-group-flush">
              <button
                @click="activeTab = 'account'"
                :class="[
                  'list-group-item list-group-item-action',
                  { active: activeTab === 'account' },
                ]"
              >
                <i class="bi bi-person-badge me-2"></i> Tài khoản
              </button>
              <button
                @click="activeTab = 'password'"
                :class="[
                  'list-group-item list-group-item-action',
                  { active: activeTab === 'password' },
                ]"
              >
                <i class="bi bi-key me-2"></i> Đổi mật khẩu
              </button>
              <button
                @click="activeTab = 'mfa'"
                :class="[
                  'list-group-item list-group-item-action',
                  { active: activeTab === 'mfa' },
                ]"
              >
                <i class="bi bi-shield-lock me-2"></i> Xác thực 2 lớp (MFA)
              </button>
              <button
                @click="activeTab = 'selfDelete'"
                :class="[
                  'list-group-item list-group-item-action',
                  { active: activeTab === 'selfDelete' },
                ]"
              >
                <i class="bi bi-trash-fill me-2"></i> Xóa tài khoản
              </button>
            </div>
          </aside>

          <main class="content-area">
            <div class="d-flex justify-content-between mb-4">
              <h4 class="fw-bold">{{ tabTitle }}</h4>
              <button class="btn-close" @click="$emit('close')"></button>
            </div>

            <div v-if="activeTab === 'account'">
              <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-dark"></div>
              </div>

              <div v-else>
                <div v-if="!isEditingId">
                  <div class="info-item mb-3">
                    <label class="text-muted small d-block"
                      >Địa chỉ Email</label
                    >
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <span class="fw-medium">{{
                        fullUser.email || "Chưa cập nhật"
                      }}</span>
                      <button
                        class="btn btn-sm"
                        :class="
                          fullUser.email ? 'btn-outline-dark' : 'btn-dark'
                        "
                        @click="openEditId('email', fullUser.email)"
                      >
                        {{ fullUser.email ? "Thay đổi" : "Cập nhật" }}
                      </button>
                    </div>
                  </div>

                  <div class="info-item mb-3">
                    <label class="text-muted small d-block"
                      >Số điện thoại</label
                    >
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <span class="fw-medium">{{
                        fullUser.phone || "Chưa cập nhật"
                      }}</span>
                      <button
                        class="btn btn-sm"
                        :class="
                          fullUser.phone ? 'btn-outline-dark' : 'btn-dark'
                        "
                        @click="openEditId('phone', fullUser.phone)"
                      >
                        {{ fullUser.phone ? "Thay đổi" : "Cập nhật" }}
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  v-else
                  class="edit-form-container p-4 border rounded-4 bg-light shadow-sm"
                >
                  <div class="d-flex align-items-center mb-3 text-dark">
                    <i class="bi bi-shield-lock-fill me-2 fs-5"></i>
                    <h6 class="mb-0 fw-bold">
                      Xác nhận thay đổi
                      {{ idType === "email" ? "Email" : "Số điện thoại" }}
                    </h6>
                  </div>

                  <p class="small text-muted mb-4">
                    Để đảm bảo an toàn, vui lòng nhập thông tin mới và mật khẩu
                    xác nhận.
                  </p>

                  <div class="mb-3">
                    <label class="form-label small fw-bold">Mới</label>
                    <input
                      v-model="idForm.newValue"
                      :type="idType === 'email' ? 'email' : 'text'"
                      class="form-control form-control-lg border-2"
                      :placeholder="
                        'Nhập ' +
                        (idType === 'email' ? 'email' : 'số điện thoại') +
                        ' mới'
                      "
                    />
                  </div>

                  <div class="mb-4">
                    <label class="form-label small fw-bold"
                      >Mật khẩu xác nhận</label
                    >
                    <input
                      v-model="idForm.password"
                      type="password"
                      class="form-control form-control-lg border-2"
                      placeholder="Nhập mật khẩu hiện tại của bạn"
                    />
                  </div>

                  <div class="d-flex gap-2">
                    <button
                      class="btn btn-dark px-4 flex-grow-1"
                      @click="handleUpdateId"
                    >
                      <span
                        v-if="submitting"
                        class="spinner-border spinner-border-sm me-2"
                      ></span>
                      Lưu thay đổi
                    </button>
                    <button
                      class="btn btn-outline-secondary px-4"
                      @click="isEditingId = false"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'password'">
              <p class="text-muted">
                Nên sử dụng mật khẩu mạnh bao gồm chữ hoa, chữ thường và ký số.
              </p>
              <form @submit.prevent="handleChangePassword" class="row g-3">
                <div class="col-8">
                  <label class="form-label-custom">Mật khẩu hiện tại</label>
                  <input
                    v-model="pwForm.oldPassword"
                    type="password"
                    class="form-control custom-input"
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                  />
                </div>

                <div class="col-8">
                  <label class="form-label-custom">Mật khẩu mới</label>
                  <input
                    v-model="pwForm.newPassword"
                    type="password"
                    class="form-control custom-input"
                    placeholder="Tối thiểu 8 ký tự"
                    required
                  />
                </div>

                <div class="col-8">
                  <label class="form-label-custom">Xác nhận mật khẩu mới</label>
                  <input
                    v-model="pwForm.confirmPassword"
                    type="password"
                    class="form-control custom-input"
                    placeholder="Nhập lại mật khẩu mới"
                    required
                  />
                </div>

                <div class="col-12 mt-4 d-flex justify-content-start">
                  <button
                    type="submit"
                    :disabled="isSubmitting"
                    class="btn btn-dark rounded-pill px-4 py-2"
                  >
                    <span
                      v-if="isSubmitting"
                      class="spinner-border spinner-border-sm me-2"
                    ></span>
                    CẬP NHẬT MẬT KHẨU
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, onMounted, computed, inject } from "vue";
import userApi from "@/api/userApi";

const emit = defineEmits(["close", "data-updated"]);
const notify = inject("$notify");

const props = defineProps({
  user: Object,
});

const submitting = ref(false);
const isSubmitting = ref(false);

const activeTab = ref("account");
const fullUser = ref({});
const loading = ref(true);

const pwForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const tabTitle = computed(() => {
  if (activeTab.value === "account") return "Thông tin định danh";
  if (activeTab.value === "password") return "Đổi mật khẩu";
  return "Xác thực 2 lớp";
});

const fetchFullUserInfo = async () => {
  try {
    loading.value = true;
    const res = await userApi.getMyInfo();
    if (res && res.result) {
      fullUser.value = res.result;
    } else {
      fullUser.value = res;
    }

    console.log("Đã khớp dữ liệu định danh:", fullUser.value);
  } catch (error) {
    console.error("Lỗi Fetch Info:", error);
  } finally {
    loading.value = false;
  }
};

const isEditingId = ref(false);
const idType = ref("");
const idForm = reactive({
  newValue: "",
  password: "",
});

const openEditId = (type, currentVal) => {
  idType.value = type;
  idForm.newValue = currentVal || "";
  idForm.password = "";
  isEditingId.value = true;
};

onMounted(fetchFullUserInfo);

const handleUpdateId = async () => {
  if (!idForm.newValue || !idForm.password) {
    notify.warning("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  try {
    submitting.value = true;

    const payload = {
      currentPassword: idForm.password,
      email:
        idType.value === "email" ? idForm.newValue : fullUser.value.email || "",
      phone:
        idType.value === "phone" ? idForm.newValue : fullUser.value.phone || "",
    };

    console.log("Payload gửi đi chuẩn chỉ:", payload);

    await userApi.updateIdentity(payload);

    notify.success("Cập nhật thành công!");
    isEditingId.value = false;

    // Cập nhật lại dữ liệu tại chỗ
    await fetchFullUserInfo();

    // Bắn tin cho Profile.vue biết để cập nhật giao diện ngoài
    emit("data-updated");
  } catch (e) {
    console.error("Lỗi chi tiết từ BE:", e);

    const errorMsg =
      e.message || "Mật khẩu không chính xác hoặc thông tin không hợp lệ";
    notify.error(errorMsg);
  } finally {
    submitting.value = false;
  }
};

const handleChangePassword = async () => {
  // 1. Validate nhanh tại FE
  if (pwForm.newPassword.length < 8) {
    notify.error("Mật khẩu mới phải có ít nhất 8 ký tự");
    return;
  }

  if (pwForm.newPassword !== pwForm.confirmPassword) {
    notify.error("Mật khẩu xác nhận không khớp!");
    return;
  }

  if (pwForm.newPassword === pwForm.oldPassword) {
    notify.warning("Mật khẩu mới không được trùng với mật khẩu cũ");
    return;
  }

  try {
    isSubmitting.value = true;

    // 2. Gọi API
    const response = await userApi.changePassword({
      oldPassword: pwForm.oldPassword,
      newPassword: pwForm.newPassword,
      confirmPassword: pwForm.confirmPassword,
    });

    notify.success("Đổi mật khẩu thành công!");

    // 3. Reset form sau khi thành công
    Object.assign(pwForm, {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  } catch (error) {
    const msg = error.message || "Đổi mật khẩu thất bại";
    notify.error(msg);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
@import "@/assets/styles/profile.css";
</style>
