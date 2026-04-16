<template>
  <div class="container-fluid py-4 px-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 class="fw-bold text-uppercase" style="letter-spacing: 1px">
          User Management
        </h3>
        <p class="text-muted small">
          Quản lý danh sách, cấp độ thân thiết và trạng thái người dùng
        </p>
      </div>
      <button class="btn btn-dark px-4 shadow-sm fw-bold" @click="openAddModal">
        <i class="bi bi-person-plus-fill me-2"></i>THÊM NGƯỜI DÙNG
      </button>
    </div>

    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body d-flex flex-wrap gap-3">
        <div class="input-group flex-grow-1" style="min-width: 300px">
          <span class="input-group-text bg-white border-end-0"
            ><i class="bi bi-search"></i
          ></span>
          <input
            type="text"
            class="form-control border-start-0"
            placeholder="Tìm theo tên, email, sđt..."
            v-model="searchQuery"
          />
        </div>

        <select class="form-select w-auto" v-model="filterRole">
          <option value="">Tất cả vai trò</option>
          <option value="ADMIN">Quản trị viên</option>
          <option value="CUSTOMER">Khách hàng</option>
        </select>

        <select class="form-select w-auto" v-model="filterStatus">
          <option value="">Tất cả trạng thái</option>
          <option value="true">Đang hoạt động</option>
          <option value="false">Đang bị khóa</option>
        </select>

        <select class="form-select w-auto" v-model="filterLevel">
          <option value="">Tất cả hạng</option>
          <option value="BRONZE">Bronze</option>
          <option value="SILVER">Silver</option>
          <option value="GOLD">Gold</option>
          <option value="DIAMOND">Diamond</option>
        </select>
      </div>
    </div>

    <div class="card border-0 shadow-sm overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-dark">
            <tr class="small text-uppercase">
              <th class="ps-4 py-3">Người dùng</th>
              <th>Liên hệ</th>
              <th>Vai trò</th>
              <th>Hạng thành viên</th>
              <th>Ngày tham gia</th>
              <th>Trạng thái</th>
              <th class="text-center pe-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="text-center py-5">
                <div
                  class="spinner-border spinner-border-sm text-dark me-2"
                ></div>
                Đang đồng bộ dữ liệu...
              </td>
            </tr>
            <tr v-for="user in users" :key="user.id">
              <td class="ps-4">
                <div class="d-flex align-items-center">
                  <div
                    class="avatar-sm me-3 bg-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                    style="width: 38px; height: 38px"
                  >
                    {{ getAvatarChar(user) }}
                  </div>
                  <div>
                    <div class="fw-bold text-dark">
                      {{ user.fullName || "Chưa cập nhật" }}
                    </div>
                    <div class="text-muted" style="font-size: 0.8rem">
                      {{ user.nickname || "N/A" }}
                    </div>
                  </div>
                </div>
              </td>

              <td>
                <div class="small fw-semibold text-primary">
                  <i class="bi bi-envelope-fill me-1"></i>{{ user.email }}
                </div>
                <div class="small text-muted">
                  <i class="bi bi-telephone-fill me-1"></i
                  >{{ user.phone || "Chưa có SĐT" }}
                </div>
              </td>

              <td>
                <span
                  v-for="role in user.roles"
                  :key="role"
                  :class="[
                    'badge me-1',
                    role === 'ADMIN' ? 'bg-danger' : 'bg-primary',
                  ]"
                >
                  {{ role }}
                </span>
              </td>

              <td>
                <div
                  :class="[
                    'fw-bold small',
                    getLevelColor(user.membershipLevel),
                  ]"
                >
                  <i class="bi bi-gem me-1"></i
                  >{{ user.membershipLevel || "BRONZE" }}
                </div>
              </td>

              <td class="small text-muted">
                {{ formatDate(user.createdAt) }}
              </td>

              <td>
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :checked="user.active"
                    @change="toggleStatus(user)"
                  />
                  <span
                    :class="user.active ? 'text-success' : 'text-danger'"
                    class="small ms-1 fw-bold"
                  >
                    {{ user.active ? "ACTIVE" : "BANNED" }}
                  </span>
                </div>
              </td>

              <td class="text-center pe-4">
                <div class="btn-group">
                  <button
                    class="btn btn-sm btn-outline-dark"
                    title="Sửa"
                    @click="editUser(user)"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    title="Xóa"
                    @click="confirmDelete(user.id)"
                  >
                    <i class="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card-footer bg-white py-3">
        <div class="d-flex justify-content-between align-items-center">
          <p class="mb-0 small text-muted">
            Hiển thị <b>{{ users.length }}</b> kết quả trên trang
            <b>{{ currentPage }}</b>
          </p>
          <nav>
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" :class="{ disabled: !hasPrevious }">
                <button
                  class="page-link shadow-none"
                  @click="changePage(currentPage - 1)"
                >
                  <i class="bi bi-chevron-left"></i>
                </button>
              </li>
              <li
                v-for="p in totalPages"
                :key="p"
                class="page-item"
                :class="{ active: p === currentPage }"
              >
                <button class="page-link shadow-none" @click="changePage(p)">
                  {{ p }}
                </button>
              </li>
              <li class="page-item" :class="{ disabled: !hasNext }">
                <button
                  class="page-link shadow-none"
                  @click="changePage(currentPage + 1)"
                >
                  <i class="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <AddUserModal ref="addUserModalRef" @success="fetchUsers(currentPage)" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from "vue";
import userApi from "@/api/userApi";
import AddUserModal from "@/views/admin/components/AddUserModal.vue";

// 1. Khai báo các biến Reactive (Rất quan trọng)
const notify = inject("$notify");
const users = ref([]);
const loading = ref(false);
const addUserModalRef = ref(null);

// Pagination States
const currentPage = ref(1);
const totalPages = ref(0);
const totalElements = ref(0);
const hasNext = ref(false);
const hasPrevious = ref(false);

// Filter States
const searchQuery = ref("");
const filterRole = ref("");
const filterStatus = ref("");
const filterLevel = ref("");

// 2. Hàm gọi API lấy danh sách User
const fetchUsers = async (page = 1) => {
  try {
    loading.value = true;
    const res = await userApi.getAllUsers(page, 10);

    if (res) {
      users.value = res.data || [];
      currentPage.value = res.currentPage || 1;
      totalPages.value = res.totalPages || 0;
      totalElements.value = res.totalElements || 0;
      hasNext.value = res.hasNext || false;
      hasPrevious.value = res.hasPrevious || false;
    }
  } catch (error) {
    console.error("Fetch users error:", error);
    notify.error("Không thể tải danh sách người dùng");
  } finally {
    loading.value = false;
  }
};

// 3. Các hàm điều khiển (Actions)
const changePage = (p) => {
  if (p >= 1 && p <= totalPages.value) {
    fetchUsers(p);
  }
};

const openAddModal = () => {
  if (addUserModalRef.value) {
    addUserModalRef.value.show();
  }
};

const toggleStatus = async (user) => {
  try {
    // Tùy vào BE của Hào, ở đây mình ví dụ gọi api ban/unban
    if (user.active) {
      await userApi.banUser(user.id);
      notify.success(`Đã khóa người dùng ${user.fullName}`);
    } else {
      await userApi.unbanUser(user.id);
      notify.success(`Đã mở khóa người dùng ${user.fullName}`);
    }
    await fetchUsers(currentPage.value);
  } catch (error) {
    notify.error("Thao tác thất bại");
  }
};

const confirmDelete = async (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
    try {
      await userApi.deleteUser(id);
      notify.success("Xóa thành công");
      await fetchUsers(currentPage.value);
    } catch (error) {
      notify.error("Xóa thất bại");
    }
  }
};

// 4. Các hàm Format hiển thị
const getLevelColor = (level) => {
  switch (level) {
    case "DIAMOND":
      return "text-info";
    case "GOLD":
      return "text-warning";
    case "SILVER":
      return "text-secondary";
    default:
      return "text-muted";
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const getAvatarChar = (user) => {
  if (!user) return "U";
  const name = user.fullName || user.nickname || "";
  return name ? name.charAt(0).toUpperCase() : "U";
};

// 5. Lifecycle Hooks
onMounted(() => {
  fetchUsers();
});

onUnmounted(() => {
  users.value = [];
});
</script>
