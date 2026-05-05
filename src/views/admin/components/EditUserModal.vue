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
                  <label class="form-label fw-bold small">Mật khẩu mới</label>
                  <input
                    v-model="editForm.newPassword"
                    type="password"
                    class="form-control"
                    placeholder=""
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold small">Trạng thái</label>
                  <select
                    v-model="editForm.status"
                    class="form-select"
                    :disabled="isSelf"
                  >
                    <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                    <option value="UNVERIFIED">Chưa xác minh</option>
                    <option value="BANNED">Bị khóa (BANNED)</option>
                    <option value="PENDING_DELETION">Chờ xóa</option>
                    <option value="DELETED">Đã xóa mềm</option>
                  </select>
                  <small v-if="isSelf" class="text-muted italic"
                    >Bạn không thể tự đổi trạng thái của mình</small
                  >
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
                        :disabled="isSelf"
                        id="roleAdmin"
                      />
                      <label class="form-check-label" for="roleAdmin"
                        >ADMIN
                        <span v-if="isSelf" class="badge bg-secondary"
                          >Bắt buộc</span
                        ></label
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
                  <label class="form-label small fw-bold"
                    >Điểm tích lũy (Rank Point)</label
                  >
                  <input
                    v-model.number="editForm.rankPoint"
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
                  <span class="text-muted">Ngày tạo tài khoản</span>
                  <span class="fw-bold">{{
                    formatDate(editForm.createdAt)
                  }}</span>
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
import { ref, inject, onMounted, computed } from "vue";
import userApi from "@/api/userApi";
import { useAuthStore } from "@/stores/authStore";
import * as bootstrap from "bootstrap";

const authStore = useAuthStore();

const isSelf = computed(() => {
  const currentId = editForm.value.id;
  const loggedInId = authStore.user?.id || authStore.user?.identityId;
  console.log(">>> [DEBUG] So sánh ID:", currentId, "với", loggedInId);
  return currentId === loggedInId;
});

const props = defineProps(["user"]);
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

const show = async (userFromList) => {
  loading.value = true;
  console.log(">>> [DEBUG] ID nhận từ list:", userFromList.id);
  try {
    const [userRes, profileRes] = await Promise.all([
      userApi.getUserAdminDetail(userFromList.id),
      userApi.getAdminProfileDetail(userFromList.id),
    ]);

    console.log(">>> [DEBUG] User Detail API:", userRes);
    console.log(">>> [DEBUG] Profile Detail API:", profileRes);

    const fullData = { ...userRes, ...profileRes };
    const u = userRes.data || userRes.result || userRes;
    const p = profileRes.data || profileRes.result || profileRes;

    editForm.value = {
      id: u.id,
      email: u.email,
      phone: u.phone,
      status: u.status,
      roles: u.roles || [],
      isMfaVerified: u.mfaVerified || u.isMfaVerified || false,
      twoFactorEnabled: u.twoFactorEnabled || false,
      banReason: u.banReason || "",
      failedAttemptCount: u.failedAttemptCount || 0,
      createdAt: u.createdAt,

      fullName: p.fullName || "",
      nickname: p.nickname || "",
      rankPoint: p.rankPoint !== undefined ? p.rankPoint : 0,
      membershipLevel: p.membershipLevel || "BRONZE",
      avatarUrl: p.avatarUrl || "",
      newPassword: "",
    };

    console.log(">>> [DEBUG] Form sau khi map:", editForm.value);

    if (bsModal.value) bsModal.value.show();
  } catch (error) {
    console.error(">>> [DEBUG] Lỗi lấy chi tiết:", error);
    notify.error("Không thể tải chi tiết người dùng!");
  } finally {
    loading.value = false;
  }
};

const hide = () => {
  bsModal.value?.hide();
};

const handleSave = async () => {
  loading.value = true;
  try {
    // 1. Data cho User API
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

    // 2. Data cho Profile API (Phải gửi đủ các field nhạy cảm)
    const profileData = {
      fullName: editForm.value.fullName,
      nickname: editForm.value.nickname,
      rankPoint: editForm.value.rankPoint,
      membershipLevel: editForm.value.membershipLevel || "BRONZE",
      // Nếu có dob thì gửi luôn, không thì để null
      dob: editForm.value.dob || null,
    };

    await Promise.all([
      userApi.updateAdminUser(editForm.value.id, userData),
      userApi.updateAdminProfile(editForm.value.id, profileData),
    ]);

    notify.success("Cập nhật thành công!");
    emit("success"); // Để trang cha load lại bảng
    hide();
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
    // Hiển thị lỗi chi tiết từ Backend (nếu có)
    const msg = error.response?.data?.message || "Cập nhật thất bại!";
    notify.error(msg);
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
