<template>
  <div class="container-fluid">
    <div class="row g-4">
      <div class="col-12">
        <div class="p-4 rounded shadow-sm bg-form-green border">
          <form @submit.prevent="submitForm">
            <div
              class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2"
            >
              <h5 class="mb-0 fw-bold text-success">
                <i class="bi bi-person-badge me-2"></i>
                {{ isEditing ? "Cập nhật tài khoản" : "Thêm tài khoản mới" }}
              </h5>
              <div v-if="isEditing" class="badge bg-warning text-dark px-3">
                Đang sửa: {{ editingId }}
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label small fw-bold text-uppercase"
                    >Email</label
                  >
                  <input
                    v-model="form.email"
                    type="email"
                    class="form-control"
                    required
                    placeholder="example@gmail.com"
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold text-uppercase"
                    >Số điện thoại</label
                  >
                  <input
                    v-model="form.phone"
                    type="text"
                    class="form-control"
                    required
                    placeholder="0987654321"
                  />
                </div>
              </div>

              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label small fw-bold text-uppercase"
                    >Mật khẩu</label
                  >
                  <input
                    v-model="form.password"
                    type="password"
                    class="form-control"
                    :required="!isEditing"
                    :placeholder="
                      isEditing
                        ? 'Bỏ trống nếu không muốn đổi'
                        : 'Nhập mật khẩu'
                    "
                  />
                </div>
                <div class="mb-3">
                  <label
                    class="form-label small fw-bold text-uppercase d-block mb-2"
                    >Vai trò (Roles)</label
                  >
                  <div class="d-flex gap-4">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="ROLE_ADMIN"
                        v-model="form.roles"
                        id="roleAdmin"
                      />
                      <label
                        class="form-check-label fw-bold text-danger"
                        for="roleAdmin"
                        >ADMIN</label
                      >
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="ROLE_CUSTOMER"
                        v-model="form.roles"
                        id="roleUser"
                      />
                      <label
                        class="form-check-label fw-bold text-success"
                        for="roleUser"
                        >USER</label
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="mt-4 border-top pt-4 d-flex justify-content-center gap-3"
            >
              <button type="submit" class="btn btn-dark btn-lg px-5 shadow-sm">
                <i class="bi bi-save me-2"></i>
                {{ isEditing ? "XÁC NHẬN CẬP NHẬT" : "LƯU NGƯỜI DÙNG" }}
              </button>
              <button
                v-if="isEditing"
                type="button"
                @click="resetForm"
                class="btn btn-outline-secondary btn-lg px-5"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="col-12">
        <div class="bg-white p-4 rounded shadow-sm border">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="mb-0 fw-bold">
              <i class="bi bi-people me-2"></i>Danh sách tài khoản
            </h5>
            <div class="badge bg-dark px-3 py-2">Tổng: {{ users.length }}</div>
          </div>

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>

          <div v-else class="table-responsive">
            <table class="table table-hover align-middle text-center border">
              <thead class="table-secondary text-uppercase small">
                <tr>
                  <th class="text-start">Email</th>
                  <th>Điện thoại</th>
                  <th>Quyền</th>
                  <th>Sai pass</th>
                  <th>2FA</th>
                  <th>Ngày tạo</th>
                  <th width="120">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td class="text-start fw-bold text-primary">
                    {{ user.email }}
                  </td>
                  <td>{{ user.phone }}</td>
                  <td>
                    <span
                      v-for="role in user.roles"
                      :key="role"
                      :class="
                        role === 'ROLE_ADMIN'
                          ? 'badge bg-danger me-1'
                          : 'badge bg-success me-1'
                      "
                    >
                      {{ role.replace("ROLE_", "") }}
                    </span>
                  </td>
                  <td>{{ user.failedAttempts }}</td>
                  <td>{{ user.is2FA ? "Bật" : "Tắt" }}</td>
                  <td class="small text-muted">
                    {{ formatDate(user.createdAt) }}
                  </td>
                  <td>
                    <div class="btn-group">
                      <button
                        @click="editUser(user)"
                        class="btn btn-sm btn-outline-primary"
                      >
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button
                        @click="removeUser(user.id)"
                        class="btn btn-sm btn-outline-danger"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/api/admin/userApi";

const users = ref([]);
const loading = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const form = ref({ email: "", phone: "", password: "", roles: [] });

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await getAllUsers();
    users.value = res.data.result;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  if (form.value.roles.length === 0) return alert("Chọn ít nhất 1 role");
  try {
    isEditing.value
      ? await updateUser(editingId.value, form.value)
      : await createUser(form.value);
    await fetchUsers();
    resetForm();
  } catch (err) {
    alert("Thao tác thất bại");
  }
};

const editUser = (user) => {
  isEditing.value = true;
  editingId.value = user.id;
  form.value = {
    email: user.email,
    phone: user.phone,
    password: "",
    roles: [...user.roles],
  };
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const removeUser = async (id) => {
  if (confirm("Xóa tài khoản này?")) {
    await deleteUser(id);
    fetchUsers();
  }
};

const resetForm = () => {
  isEditing.value = false;
  editingId.value = null;
  form.value = { email: "", phone: "", password: "", roles: [] };
};

const formatDate = (date) =>
  date ? new Date(date).toLocaleString("vi-VN") : "N/A";

onMounted(fetchUsers);
</script>

<style scoped>
.bg-form-green {
  background-color: #f0fdf4;
  border: 1px solid #dcfce7;
}
.badge {
  font-size: 0.75rem;
}
.table td {
  padding: 12px 8px;
}
</style>