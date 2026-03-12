<template>
  <div class="row">
    <!-- ================= FORM ================= -->
    <div class="col-md-3">
      <div class="p-3 rounded shadow-sm bg-form-green">
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label class="form-label small fw-bold">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="form-control form-control-sm"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold">Phone</label>
            <input
              v-model="form.phone"
              type="text"
              class="form-control form-control-sm"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label small fw-bold">Password</label>
            <input
              v-model="form.password"
              type="password"
              class="form-control form-control-sm"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label small fw-bold">Roles</label>

            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value="ROLE_ADMIN"
                v-model="form.roles"
                id="roleAdmin"
              />
              <label class="form-check-label" for="roleAdmin"> ADMIN </label>
            </div>

            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value="ROLE_CUSTOMER"
                v-model="form.roles"
                id="roleUser"
              />
              <label class="form-check-label" for="roleUser"> USER </label>
            </div>
          </div>

          <button type="submit" class="btn btn-dark w-100 btn-sm py-2">
            {{ isEditing ? "Cập nhật" : "Thêm" }}
          </button>

          <button
            v-if="isEditing"
            type="button"
            @click="resetForm"
            class="btn btn-secondary w-100 btn-sm mt-2"
          >
            Hủy
          </button>
        </form>
      </div>
    </div>

    <!-- ================= TABLE ================= -->
    <div class="col-md-9">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-dark"></div>
      </div>

      <div v-else class="table-responsive">
        <table
          class="table table-bordered align-middle text-center border-dark custom-table"
        >
          <thead class="table-secondary">
            <tr>
              <th>Email</th>
              <th>Phone</th>
              <th>Roles</th>
              <th>Failed</th>
              <th>2FA</th>
              <th>Created</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td class="text-start">{{ user.email }}</td>
              <td>{{ user.phone }}</td>

              <td>
                <span
                  :class="user.roles ? 'badge bg-success' : 'badge bg-danger'"
                >
                  {{ user.roles?.join(", ") }}
                </span>
              </td>

              <td>{{ user.failedAttempts }}</td>

              <td>
                {{ user.is2FA ? "✅" : "❌" }}
              </td>

              <td>
                {{ formatDate(user.createdAt) }}
              </td>

              <td>
                <button
                  @click="editUser(user)"
                  class="btn btn-sm btn-outline-primary me-1"
                >
                  ✏
                </button>

                <button
                  @click="removeUser(user.id)"
                  class="btn btn-sm btn-outline-danger"
                >
                  🗑
                </button>
              </td>
            </tr>

            <tr v-if="users.length === 0">
              <td colspan="7">Không có dữ liệu</td>
            </tr>
          </tbody>
        </table>
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

const form = ref({
  email: "",
  phone: "",
  password: "",
  roles: [],
});

// ================= FETCH =================
const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await getAllUsers();
    users.value = res.data.result;
  } catch (err) {
    console.error("Lỗi fetch user:", err);
  } finally {
    loading.value = false;
  }
};

// ================= SUBMIT =================
const submitForm = async () => {
  if (form.value.roles.length === 0) {
    alert("Phải chọn ít nhất 1 role");
    return;
  }

  try {
    if (isEditing.value) { 
      await updateUser(editingId.value, form.value);
    } else {
      await createUser(form.value);
    }

    await fetchUsers();
    resetForm();
  } catch (err) {
    console.error("Lỗi submit:", err);
  }
};

// ================= EDIT =================
const editUser = (user) => {
  isEditing.value = true;
  editingId.value = user.id;

  form.value = {
    email: user.email,
    phone: user.phone,
    password: "",
    roles: [...user.roles]   // clone array
  };
};

// ================= DELETE =================
const removeUser = async (id) => {
  if (!confirm("Bạn có chắc muốn xóa?")) return;

  try {
    await deleteUser(id);
    await fetchUsers();
  } catch (err) {
    console.error("Lỗi delete:", err);
  }
};

// ================= RESET =================
const resetForm = () => {
  isEditing.value = false;
  editingId.value = null;

  form.value = {
    email: "",
    phone: "",
    password: "",
    roles: []
  };
};

// ================= FORMAT DATE =================
const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString();
};

onMounted(fetchUsers);
</script>

<style scoped>
.bg-form-green {
  background-color: #dcfce7;
}

.custom-table thead th {
  background-color: #d1d5db;
}

.table td {
  padding: 12px 8px;
  background-color: #e5e7eb;
}
</style>