<template>
  <div class="modal fade" tabindex="-1" ref="modalRef">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">
            <i class="bi bi-person-gear me-2"></i>
            Chỉnh sửa chi tiết: {{ editForm.email }}
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="hide"
          ></button>
        </div>

        <ul
          class="nav nav-tabs nav-fill bg-light"
          id="editUserTabs"
          role="tablist"
        >
          <li class="nav-item">
            <button
              class="nav-link active"
              data-bs-toggle="tab"
              data-bs-target="#tab-account"
            >
              <i class="bi bi-shield-lock me-1"></i> Tài khoản
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#tab-profile"
            >
              <i class="bi bi-person-badge me-1"></i> Hồ sơ
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#tab-system"
            >
              <i class="bi bi-info-circle me-1"></i> Hệ thống
            </button>
          </li>
        </ul>

        <div class="modal-body p-4">
          <div class="tab-content">
            <div class="tab-pane fade show active" id="tab-account">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold small">Email</label>
                  <input
                    v-model="editForm.email"
                    type="email"
                    class="form-control"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold small">Số điện thoại</label>
                  <input
                    v-model="editForm.phone"
                    type="text"
                    class="form-control"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold small">Trạng thái</label>
                  <select
                    v-model="editForm.status"
                    class="form-select border-primary fw-bold"
                  >
                    <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                    <option value="UNVERIFIED">Chưa xác minh</option>
                    <option value="BANNED">Bị khóa (BANNED)</option>
                    <option value="PENDING_DELETION">Chờ xóa</option>
                    <option value="DELETED">Đã xóa mềm</option>
                  </select>
                </div>

                <div class="col-12">
                  <label class="form-label fw-bold small"
                    >Quyền hạn (Roles)</label
                  >
                  <div
                    class="d-flex gap-3 flex-wrap p-2 border rounded bg-light"
                  >
                    <div class="form-check">
                      <input
                        v-model="editForm.roles"
                        class="form-check-input"
                        type="checkbox"
                        value="ROLE_ADMIN"
                        id="roleAdmin"
                      />
                      <label class="form-check-label" for="roleAdmin"
                        >ADMIN</label
                      >
                    </div>
                    <div class="form-check">
                      <input
                        v-model="editForm.roles"
                        class="form-check-input"
                        type="checkbox"
                        value="ROLE_STAFF"
                        id="roleStaff"
                      />
                      <label class="form-check-label" for="roleStaff"
                        >STAFF</label
                      >
                    </div>

                    <div class="form-check">
                      <input
                        v-model="editForm.roles"
                        class="form-check-input"
                        type="checkbox"
                        value="ROLE_CUSTOMER"
                        id="roleCustomer"
                      />
                      <label class="form-check-label" for="roleCustomer"
                        >CUSTOMER</label
                      >
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-bold small">Bảo mật & MFA</label>
                  <div class="d-flex gap-3 mt-1">
                    <div class="form-check form-switch">
                      <input
                        v-model="editForm.twoFactorEnabled"
                        class="form-check-input"
                        type="checkbox"
                        id="2faSwitch"
                      />
                      <label class="form-check-label" for="2faSwitch"
                        >2FA</label
                      >
                    </div>
                    <div class="form-check form-switch text-danger">
                      <input
                        v-model="editForm.isMfaVerified"
                        class="form-check-input"
                        type="checkbox"
                        id="mfaVerifiedSwitch"
                      />
                      <label class="form-check-label" for="mfaVerifiedSwitch"
                        >MFA Verified</label
                      >
                    </div>
                  </div>
                </div>
                <div class="col-12" v-if="editForm.status === 'BANNED'">
                  <label class="form-label fw-bold small text-danger"
                    >Lý do khóa tài khoản</label
                  >
                  <textarea
                    v-model="editForm.banReason"
                    class="form-control"
                    rows="2"
                    placeholder="Nhập lý do..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="tab-pane fade" id="tab-profile">
              <div class="row g-3">
                <div class="col-md-8">
                  <label class="form-label fw-bold small">Họ và tên</label>
                  <input
                    v-model="editForm.fullName"
                    type="text"
                    class="form-control"
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-bold small">Điểm hạng</label>
                  <input
                    v-model="editForm.rankPoint"
                    type="number"
                    class="form-control"
                  />
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-bold small"
                    >Hạng thành viên</label
                  >
                  <select
                    v-model="editForm.membershipLevel"
                    class="form-select"
                  >
                    <option value="BRONZE">Bronze</option>
                    <option value="SILVER">Silver</option>
                    <option value="GOLD">Gold</option>
                    <option value="DIAMOND">Diamond</option>
                  </select>
                </div>
                <div class="col-md-12">
                  <label class="form-label fw-bold small">Nickname</label>
                  <div class="input-group">
                    <span class="input-group-text">@</span>
                    <input
                      v-model="editForm.nickname"
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>
                <div class="col-md-12">
                  <label class="form-label fw-bold small">Avatar URL</label>
                  <input
                    v-model="editForm.avatarUrl"
                    type="text"
                    class="form-control"
                  />
                </div>
              </div>
            </div>

            <div class="tab-pane fade" id="tab-system">
              <div class="list-group list-group-flush small">
                <div class="list-group-item d-flex justify-content-between">
                  <span class="text-muted">ID người dùng:</span>
                  <span class="fw-bold">{{ editForm.id }}</span>
                </div>
                <div class="list-group-item d-flex justify-content-between">
                  <span class="text-muted">Ngày tạo:</span>
                  <span>{{ formatDate(editForm.createdAt) }}</span>
                </div>
                <div class="list-group-item d-flex justify-content-between">
                  <span class="text-muted">Đăng nhập cuối:</span>
                  <span>{{ formatDate(editForm.lastLoginAt) }}</span>
                </div>
                <div class="list-group-item d-flex justify-content-between">
                  <span class="text-muted">Số lần đăng nhập sai:</span>
                  <span class="badge bg-secondary">{{
                    editForm.failedAttemptCount
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer bg-light border-top-0">
          <button type="button" class="btn btn-secondary" @click="hide">
            Hủy
          </button>
          <button
            type="button"
            class="btn btn-primary px-4"
            @click="handleSave"
            :disabled="loading"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import userApi from "@/api/userApi";
import * as bootstrap from "bootstrap";

const props = defineProps(["user"]); // Nhận user từ trang cha
const emit = defineEmits(["success"]);
const notify = inject("$notify");

const modalRef = ref(null);
const bsModal = ref(null);
const loading = ref(false);

const editForm = ref({
  id: "",
  email: "",
  phone: "",
  status: "",
  twoFactorEnabled: false,
  isMfaVerified: false,
  banReason: "",
  fullName: "",
  nickname: "",
  avatarUrl: "",
  rankPoint: 0,
  membershipLevel: "BRONZE",
  roles: [],
  createdAt: "",
  lastLoginAt: "",
  failedAttemptCount: 0,
});

onMounted(() => {
  if (modalRef.value) {
    bsModal.value = new bootstrap.Modal(modalRef.value);
  }
});

// Hàm hiển thị và map dữ liệu
// EditUserModal.vue
const show = (userData) => {
  editForm.value = { ...editForm.value };

  editForm.value.id = userData.id;
  editForm.value.email = userData.email;
  editForm.value.phone = userData.phone;
  editForm.value.status = userData.status;
  editForm.value.twoFactorEnabled = userData.twoFactorEnabled;

  editForm.value.roles = userData.roles || [];
  if (!bsModal.value && modalRef.value) {
    bsModal.value = new bootstrap.Modal(modalRef.value);
  }

  if (bsModal.value) {
    bsModal.value.show();
  }
};

const hide = () => {
  bsModal.value?.hide();
};

// EditUserModal.vue
const handleSave = async () => {
  loading.value = true;
  try {
    const userData = {
      email: editForm.value.email,
      phone: editForm.value.phone,
      password: editForm.value.newPassword || null,
      status: editForm.value.status,
      twoFactorEnabled: editForm.value.twoFactorEnabled,
      isMfaVerified: editForm.value.isMfaVerified,
      failedAttemptCount: editForm.value.failedAttemptCount,
      banReason: editForm.value.banReason,
      roles: editForm.value.roles,
    };

    const profileData = {
      rankPoint: editForm.value.rankPoint,
      membershipLevel: editForm.value.membershipLevel || "BRONZE",
    };

    await Promise.all([
      userApi.updateAdminUser(editForm.value.id, userData),
      userApi.updateAdminProfile(editForm.value.id, profileData),
    ]);

    notify.success("Hệ thống đã cập nhật dữ liệu đồng bộ!");
    emit("success");
    hide();
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
    notify.error(error.response?.data?.message || "Cập nhật thất bại!");
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "Chưa có dữ liệu";
  return new Date(dateStr).toLocaleString("vi-VN");
};

defineExpose({
  show,
});
</script>

<style scoped>
.nav-tabs .nav-link {
  border: none;
  color: #6c757d;
  font-weight: 500;
  padding: 1rem;
}
.nav-tabs .nav-link.active {
  color: #0d6efd;
  background: transparent;
  border-bottom: 3px solid #0d6efd;
}
.modal-content {
  border-radius: 15px;
  overflow: hidden;
}
</style>
