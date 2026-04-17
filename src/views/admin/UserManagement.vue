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
            v-model="searchQuery"
            placeholder="Tìm tên, email, sđt..."
            class="form-control"
          />
        </div>

        <div class="col-md-2">
          <select v-model="filterRole" class="form-select">
            <option value="">Tất cả vai trò</option>
            <option value="ROLE_ADMIN">Quản trị viên</option>
            <option value="ROLE_STAFF">Nhân viên</option>
            <option value="ROLE_CUSTOMER">Khách hàng</option>
          </select>
        </div>
        <div class="col-md-2">
          <select v-model="filterStatus" class="form-select">
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="UNVERIFIED">Chưa xác minh</option>
            <option value="BANNED">Bị khóa</option>
            <option value="PENDING_DELETION">Chờ xóa</option>
            <option value="DELETED">Đã xóa</option>
          </select>
        </div>
        <div class="col-md-2">
          <select v-model="filterLevel" class="form-select">
            <option value="">Tất cả hạng</option>
            <option value="BRONZE">Bronze</option>
            <option value="SILVER">Silver</option>
            <option value="GOLD">Gold</option>
            <option value="DIAMOND">Diamond</option>
          </select>
        </div>

        <button
          class="btn btn-outline-secondary d-flex align-items-center gap-2 shadow-none"
          @click="clearFilters"
          title="Xóa tất cả bộ lọc"
        >
          <i class="bi bi-arrow-counterclockwise"></i>
          Làm mới
        </button>
      </div>
    </div>

    <div
      v-if="selectedUserIds.length > 0"
      class="bulk-toolbar bg-dark text-white p-3 mb-3 rounded shadow-lg d-flex justify-content-between align-items-center"
      style="position: relative; z-index: 1020"
    >
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-check2-all text-success fs-5 ms-2"></i>
        <span class="fw-bold">Đã chọn {{ selectedUserIds.length }} mục</span>
      </div>

      <div class="d-flex gap-2">
        <div class="dropdown">
          <button
            class="btn btn-sm btn-outline-warning dropdown-toggle"
            type="button"
            @click.stop="
              showStatusDropdown = !showStatusDropdown;
              showNotifyDropdown = false;
            "
          >
            <i class="bi bi-arrow-repeat me-1"></i> Trạng thái
          </button>
          <ul
            class="dropdown-menu dropdown-menu-dark shadow"
            :class="{ show: showStatusDropdown }"
            style="position: absolute; right: 0; top: 100%; margin-top: 5px"
          >
            <li>
              <button class="dropdown-item" @click="handleBulkStatus('ACTIVE')">
                Hoạt động (ACTIVE)
              </button>
            </li>
            <li>
              <button
                class="dropdown-item"
                @click="handleBulkStatus('UNVERIFIED')"
              >
                Chưa xác minh (UNVERIFIED)
              </button>
            </li>
            <li>
              <button class="dropdown-item" @click="handleBulkStatus('BANNED')">
                Bị khóa (BANNED)
              </button>
            </li>
            <li>
              <button
                class="dropdown-item"
                @click="handleBulkStatus('PENDING_DELETION')"
              >
                Chờ xóa (PENDING_DELETION)
              </button>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <button
                class="dropdown-item text-danger"
                @click="handleBulkStatus('DELETED')"
              >
                Xóa vĩnh viễn (DELETED)
              </button>
            </li>
          </ul>
        </div>

        <div class="dropdown">
          <button
            class="btn btn-sm btn-outline-info dropdown-toggle"
            type="button"
            @click.stop="
              showNotifyDropdown = !showNotifyDropdown;
              showStatusDropdown = false;
            "
          >
            <i class="bi bi-send-fill me-1"></i> Gửi thông báo
          </button>
          <ul
            class="dropdown-menu dropdown-menu-dark shadow"
            :class="{ show: showNotifyDropdown }"
            style="position: absolute; right: 0; top: 100%; margin-top: 5px"
          >
            <li>
              <button
                class="dropdown-item"
                @click="openNotifyModal('SYSTEM_NOTIFICATION')"
              >
                📢 Thông báo chung / Promotion
              </button>
            </li>
            <li>
              <button
                class="dropdown-item"
                @click="openNotifyModal('SECURITY_UPDATE')"
              >
                ⚠️ Cảnh báo bảo mật
              </button>
            </li>
          </ul>
        </div>

        <div>
          <button class="btn btn-sm btn-outline-success" type="button">
            <i class="bi bi-send-fill me-1"></i> Xuất Excel
          </button>
        </div>

        <div class="vr mx-2"></div>

        <button class="btn btn-sm btn-light" @click="clearSelection">
          Hủy chọn
        </button>
      </div>
    </div>

    <div class="card border-0 shadow-sm overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-dark">
            <tr class="small text-uppercase">
              <th class="ps-4">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                />
              </th>
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

            <tr v-for="u in mergedUsers" :key="u.id">
              <td class="ps-4">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :value="u.id"
                  v-model="selectedUserIds"
                />
              </td>
              <td class="ps-4">
                <div class="d-flex align-items-center">
                  <div class="avatar-wrapper">
                    <img
                      v-if="u.avatarUrl"
                      :src="u.avatarUrl"
                      class="avatar"
                      alt="avatar"
                    />
                    <div v-else class="avatar-fallback">
                      {{ getAvatarChar(u) }}
                    </div>
                  </div>

                  <div>
                    <div class="fw-bold text-dark">
                      {{ u.fullName || "Người dùng" }}
                    </div>
                    <div class="text-muted small">
                      {{ getUsername(u) }}
                    </div>
                  </div>
                </div>
              </td>

              <td>
                <div class="small fw-semibold">
                  <i class="bi bi-envelope me-1"></i>{{ u.email }}
                </div>
                <div class="small text-muted">
                  <i class="bi bi-phone me-1"></i>
                  {{ u.phone || "N/A" }}
                </div>
              </td>

              <td>
                <span
                  v-for="role in u.roles"
                  :key="role"
                  class="badge bg-light text-dark border me-1"
                >
                  {{ role }}
                </span>
              </td>

              <td>
                <div class="fw-bold small text-primary">
                  <i class="bi bi-star-fill me-1"></i>
                  {{ u.rankPoint || 0 }} pts
                </div>
              </td>

              <td>{{ formatDate(u.createdAt) }}</td>

              <td>
                <span class="badge" :class="getStatusClass(u.status)">
                  {{ u.status }}
                </span>
              </td>

              <td class="text-center pe-4">
                <div class="d-flex justify-content-center gap-2">
                  <button
                    class="btn btn-sm btn-outline-primary"
                    @click="openEditModal(u)"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger shadow-sm"
                    @click="handleSoftDelete(u)"
                  >
                    <i class="bi bi-trash3"></i>
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
            Tổng số: <b>{{ totalElements }}</b> người dùng | Trang
            <b>{{ currentPage }}</b
            >/<b>{{ totalPages }}</b>
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
      <div
        v-if="showNotifyModal"
        class="modal fade show d-block"
        tabindex="-1"
        style="background: rgba(0, 0, 0, 0.5); z-index: 1060"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">
                <i class="bi bi-megaphone me-2"></i>
                Gửi thông báo ({{ selectedUserIds.length }} người nhận)
              </h5>
              <button
                type="button"
                class="btn-close btn-close-white"
                @click="showNotifyModal = false"
              ></button>
            </div>
            <div class="modal-body p-4">
              <div class="mb-3">
                <label class="form-label fw-bold text-dark"
                  >Tiêu đề thông báo</label
                >
                <input
                  v-model="notifyData.subject"
                  type="text"
                  class="form-control"
                  placeholder="Nhập tiêu đề..."
                />
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold text-dark"
                  >Nội dung chi tiết</label
                >
                <textarea
                  v-model="notifyData.message"
                  class="form-control"
                  rows="5"
                  placeholder="Nhập nội dung muốn gửi..."
                ></textarea>
                <div class="form-text mt-2 text-muted">
                  Nội dung này sẽ được gửi qua Email/Telegram tùy theo thông tin
                  của người dùng.
                </div>
              </div>
            </div>
            <div class="modal-footer bg-light">
              <button
                type="button"
                class="btn btn-secondary"
                @click="showNotifyModal = false"
              >
                Đóng
              </button>
              <button
                type="button"
                class="btn btn-primary px-4"
                @click="handleBulkNotify"
                :disabled="loading"
              >
                <span
                  v-if="loading"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                Xác nhận gửi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AddUserModal
      ref="addUserModalRef"
      @success="() => fetchAllUserInfo(currentPage)"
    />
    <EditUserModal
      ref="editUserModalRef"
      @success="fetchAllUserInfo(currentPage)"
    />
  </div>
</template>

<script setup>
import { inject, ref, onMounted, watch, computed, nextTick } from "vue";
import debounce from "lodash/debounce";
import userApi from "@/api/userApi";
import AddUserModal from "@/views/admin/components/AddUserModal.vue";
import EditUserModal from "@/views/admin/components/EditUserModal.vue";

const notify = inject("$notify", null);
const loading = ref(false);

const users = ref([]);
const mergedUsers = ref([]);
const totalElements = ref(0);
const addUserModalRef = ref(null);

const currentPage = ref(1);
const totalPages = ref(0);
const hasNext = ref(false);
const hasPrevious = ref(false);

// FILTER
const searchQuery = ref("");
const filterRole = ref("");
const filterStatus = ref("ACTIVE");
const filterLevel = ref("");

// EDIT
const editUserModalRef = ref(null);
const selectedUser = ref(null);

// BULK ACTIONS STATE
const selectedUserIds = ref([]);
const showNotifyModal = ref(false);
const showStatusDropdown = ref(false);
const showNotifyDropdown = ref(false);

const notifyData = ref({
  subject: "",
  message: "",
  type: "SYSTEM_NOTIFICATION",
});

const closeAllDropdowns = () => {
  showStatusDropdown.value = false;
  showNotifyDropdown.value = false;
};

const fetchAllUserInfo = async (page = 1) => {
  loading.value = true;
  try {
    const params = {
      page: page,
      size: 10,
      keyword: searchQuery.value,
      status: filterStatus.value,
      role: filterRole.value,
    };

    const res = await userApi.getAdminUserList(params);
    if (res) {
      mergedUsers.value = res.data || [];
      totalElements.value = res.totalElements;
      totalPages.value = res.totalPages || 0;
      currentPage.value = res.currentPage || 1;
      hasNext.value = res.hasNext || false;
      hasPrevious.value = res.hasPrevious || false;
    }
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    loading.value = false;
  }
};

// WATCHERS
watch([filterRole, filterStatus, filterLevel], () => {
  currentPage.value = 1;
  fetchAllUserInfo(1);
});

const debouncedSearch = debounce(() => {
  currentPage.value = 1;
  fetchAllUserInfo(1);
}, 500);

watch(searchQuery, () => {
  debouncedSearch();
});

onMounted(() => fetchAllUserInfo());

// --- XỬ LÝ THAY ĐỔI TRẠNG THÁI HÀNG LOẠT ---
const handleBulkStatus = async (status) => {
  if (selectedUserIds.value.length === 0) return;

  if (
    !confirm(
      `Xác nhận đổi trạng thái ${selectedUserIds.value.length} mục sang ${status}?`,
    )
  ) {
    closeAllDropdowns();
    return;
  }

  try {
    loading.value = true;
    // 1. Update Status
    await userApi.bulkUpdateStatus({
      ids: selectedUserIds.value,
      actionValue: status,
    });

    const statusToNotifyType = {
      BANNED: "ACCOUNT_LOCK",
      ACTIVE: "ACCOUNT_UNLOCK",
      DELETED: "SECURITY_UPDATE",
      UNVERIFIED: "SECURITY_UPDATE",
    };

    const notifyType = statusToNotifyType[status] || "SYSTEM_NOTIFICATION";

    await userApi.bulkSendNotification({
      ids: selectedUserIds.value,
      customSubject: `Cập nhật trạng thái: ${status}`,
      customMessage: `Tài khoản của bạn đã được chuyển sang trạng thái ${status}.`,
      type: notifyType,
    });

    notify.success("Cập nhật thành công và đã gửi mail thông báo!");
    clearSelection();
    fetchAllUserInfo(currentPage.value);
  } catch (error) {
    notify.error("Lỗi hệ thống khi cập nhật hàng loạt");
  } finally {
    loading.value = false;
    closeAllDropdowns();
  }
};

// --- XỬ LÝ GỬI THÔNG BÁO TÙY CHỈNH (PROMOTION/SECURITY) ---
const openNotifyModal = (type) => {
  notifyData.value = {
    subject:
      type === "SYSTEM_NOTIFICATION"
        ? "Thông báo từ hệ thống"
        : "Cảnh báo bảo mật",
    message: "",
    type: type,
  };
  showNotifyModal.value = true;
  closeAllDropdowns();
};

const handleBulkNotify = async () => {
  if (selectedUserIds.value.length === 0) return;

  if (!notifyData.value.message.trim()) {
    notify.error("Vui lòng nhập nội dung thông báo");
    return;
  }

  try {
    loading.value = true;
    await userApi.bulkSendNotification({
      ids: selectedUserIds.value,
      customSubject: notifyData.value.subject,
      customMessage: notifyData.value.message,
      type: notifyData.value.type,
    });

    notify.success(
      `Đã gửi thông báo cho ${selectedUserIds.value.length} người dùng`,
    );
    showNotifyModal.value = false;
    clearSelection();
  } catch (error) {
    notify.error("Lỗi khi gửi thông báo hàng loạt");
  } finally {
    loading.value = false;
  }
};

const handleSoftDelete = async (user) => {
  if (
    !confirm(`Bạn có chắc chắn muốn xóa (DELETED) người dùng: ${user.email}?`)
  )
    return;

  try {
    loading.value = true;
    await userApi.softDeleteUser(user.id);

    notify.success("Đã xóa mềm thành công!");
    fetchAllUserInfo(currentPage.value);
  } catch (error) {
    notify.error("Lỗi khi thực hiện xóa");
  } finally {
    loading.value = false;
  }
};

// SELECTION LOGIC
const isAllSelected = computed(() => {
  return (
    mergedUsers.value.length > 0 &&
    selectedUserIds.value.length === mergedUsers.value.length
  );
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedUserIds.value = [];
  } else {
    selectedUserIds.value = mergedUsers.value.map((u) => u.id);
  }
};

const clearSelection = () => {
  selectedUserIds.value = [];
  closeAllDropdowns();
};

const clearFilters = () => {
  searchQuery.value = "";
  filterRole.value = "";
  filterStatus.value = "ACTIVE";
  filterLevel.value = "";
  currentPage.value = 1;
  fetchAllUserInfo(1);
  if (notify) notify.info("Đã xóa tất cả bộ lọc");
};

const changePage = (page) => {
  if (page < 1 || (totalPages.value > 0 && page > totalPages.value)) return;
  fetchAllUserInfo(page);
};

const openAddModal = () => {
  addUserModalRef.value?.show();
};

const openEditModal = async (user) => {
  console.log("Component Ref:", editUserModalRef.value);
  selectedUser.value = user;
  await nextTick();
  if (
    editUserModalRef.value &&
    typeof editUserModalRef.value.show === "function"
  ) {
    editUserModalRef.value.show(user);
  } else {
    notify.error("Không thể mở cửa sổ chỉnh sửa. Vui lòng thử lại!");
  }
};

// HELPERS
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("vi-VN");
};

const getAvatarChar = (user) => {
  if (!user || !user.fullName) return "?";
  return user.fullName.charAt(0).toUpperCase();
};

const getShortId = (id) => (id ? id.substring(0, 8) : "");

const getUsername = (u) => {
  const name = u?.nickname || getShortId(u?.id);
  return name ? "@" + name : "";
};

const getStatusClass = (status) => {
  switch (status) {
    case "ACTIVE":
      return "bg-success";
    case "UNVERIFIED":
      return "bg-warning text-dark";
    case "BANNED":
      return "bg-danger";
    case "PENDING_DELETION":
      return "bg-info text-dark";
    case "DELETED":
      return "bg-secondary";
    default:
      return "bg-light text-dark";
  }
};
</script>

<style scoped>
.avatar-wrapper {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e9ecef;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  font-weight: 600;
  font-size: 14px;
  color: #495057;
}

.bulk-action-bar {
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.bulk-toolbar {
  position: sticky;
  top: 1rem;
  z-index: 1020;
  background-color: #212529 !important;

  /* Thêm khoảng cách phía dưới */
  margin-bottom: 1.5rem !important;

  /* Thêm bo góc và viền cho sắc nét */
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
}

/* Thêm hiệu ứng đổ bóng nhẹ cho bảng phía dưới để tạo chiều sâu */
.table-container {
  margin-top: 0.5rem;
}
</style>
