<template>
  <div class="profile-page container py-5">
    <div class="row g-4">
      <div class="col-lg-4">
        <div
          class="card border-0 shadow-sm text-center p-4 sticky-top"
          style="top: 2rem; border-radius: 20px"
        >
          <div class="position-relative d-inline-block mx-auto mb-3">
            <div class="avatar-container shadow">
              <img
                :src="formData.avatarUrl || defaultAvatar"
                class="avatar-img"
                alt="Avatar"
              />
              <label class="upload-badge">
                <i class="bi bi-camera-fill"></i>
                <input
                  type="file"
                  hidden
                  @change="handleAvatarUpload"
                  accept="image/*"
                />
              </label>
            </div>
          </div>
          <h4 class="fw-bold mb-1">{{ displayInfo.nickname }}</h4>
          <p class="text-muted mb-4">{{ displayInfo.fullName }}</p>
          <div class="d-grid gap-2">
            <button
              class="btn btn-outline-dark rounded-pill py-2"
              @click="isSecurityOpen = true"
            >
              <i class="bi bi-shield-check me-2"></i>Bảo mật tài khoản
            </button>

            <SecurityDashboard
              v-if="isSecurityOpen"
              @close="isSecurityOpen = false"
              @data-updated="fetchUserProfile"
            />
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <div class="card border-0 shadow-custom p-4 mb-4 profile-main-card">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="d-flex align-items-center gap-3">
              <div class="icon-box-profile">
                <i class="bi bi-person-circle fs-4"></i>
              </div>
              <h4 class="fw-bold mb-0">Hồ sơ của tôi</h4>
            </div>
            <button
              @click="toggleEdit"
              class="btn-edit-toggle"
              :class="{ 'is-editing': isEditing }"
            >
              <i :class="isEditing ? 'bi bi-x-lg' : 'bi bi-pencil-fill'"></i>
            </button>
          </div>

          <form @submit.prevent="saveChanges" class="row g-4">
            <div class="col-md-6">
              <label class="form-label-custom">Biệt danh (Nickname)</label>
              <input
                ref="firstInput"
                v-model="formData.nickname"
                :disabled="!isEditing"
                type="text"
                class="form-control custom-input"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label-custom">Họ và tên</label>
              <input
                v-model="formData.fullName"
                :disabled="!isEditing"
                type="text"
                class="form-control custom-input"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label-custom">Giới tính</label>
              <div class="d-flex gap-2">
                <button
                  v-for="g in ['MALE', 'FEMALE', 'ORTHER']"
                  :key="g"
                  type="button"
                  :disabled="!isEditing"
                  @click="formData.gender = g"
                  class="btn btn-gender-select flex-fill"
                  :class="{ active: formData.gender === g }"
                >
                  {{ g }}
                </button>
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label-custom">Ngày sinh</label>
              <input
                v-model="formData.dob"
                :disabled="!isEditing"
                type="date"
                class="form-control custom-input"
              />
            </div>
            <div
              v-if="isEditing"
              class="col-12 d-flex justify-content-end mt-4"
            >
              <button
                type="submit"
                :disabled="isLoading"
                class="btn btn-dark rounded-pill px-5 py-2 fw-bold"
              >
                {{ isLoading ? "ĐANG LƯU..." : "LƯU THAY ĐỔI" }}
              </button>
            </div>
          </form>
        </div>

        <div class="card border-0 shadow-sm p-4" style="border-radius: 20px">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="d-flex align-items-center">
              <div class="icon-box-profile me-3">
                <i class="bi bi-geo-alt fs-4"></i>
              </div>
              <h5 class="fw-bold mb-0">Địa chỉ nhận hàng</h5>
            </div>
            <button
              class="btn btn-sm btn-dark px-3 rounded-pill"
              @click="openAddressModal()"
            >
              <i class="bi bi-plus-lg me-1"></i> Thêm mới
            </button>
          </div>

          <div v-if="addresses.length === 0" class="text-center py-5">
            <p class="text-muted">Bạn chưa lưu địa chỉ nào</p>
          </div>

          <div v-else class="address-list">
            <div
              v-for="addr in addresses"
              :key="addr.id"
              class="address-item p-3 mb-3 border rounded-4 position-relative shadow-sm"
              :class="{ 'address-default-card': addr.defaultAddress }"
            >
              <div
                v-if="addr.defaultAddress"
                class="star-mark"
                title="Địa chỉ mặc định"
              >
                <i class="bi bi-star-fill"></i>
              </div>

              <div class="d-flex justify-content-between">
                <div class="flex-grow-1">
                  <div class="d-flex align-items-center flex-wrap gap-2 mb-2">
                    <span class="fw-bold text-dark">{{
                      addr.receiverName
                    }}</span>
                    <div class="vr d-none d-md-block"></div>
                    <span class="text-secondary small">{{
                      addr.phoneNumber
                    }}</span>
                    <span
                      :class="[
                        'badge-type',
                        addr.addressType === 'OFFICE'
                          ? 'bg-info-subtle text-info'
                          : 'bg-success-subtle text-success',
                      ]"
                    >
                      {{
                        addr.addressType === "OFFICE"
                          ? "Văn phòng"
                          : "Nhà riêng"
                      }}
                    </span>
                    <span
                      v-if="addr.defaultAddress"
                      class="badge bg-warning text-dark small-badge"
                      >Mặc định</span
                    >
                  </div>
                  <p class="text-dark small mb-1">
                    <i class="bi bi-geo-alt-fill text-danger me-1"></i
                    >{{ addr.detailAddress }}
                  </p>
                  <p class="text-secondary small mb-0 ms-3">
                    {{ addr.wardName }}, {{ addr.districtName }},
                    {{ addr.provinceName }}
                  </p>
                </div>

                <div class="dropdown">
                  <button
                    class="btn btn-light btn-sm rounded-circle shadow-sm"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i class="bi bi-three-dots"></i>
                  </button>
                  <ul
                    class="dropdown-menu dropdown-menu-end border-0 shadow-lg custom-dropdown"
                  >
                    <li>
                      <a
                        class="dropdown-item py-2"
                        @click="openAddressModal(addr)"
                      >
                        <i class="bi bi-pencil me-2 text-primary"></i>Chỉnh sửa
                      </a>
                    </li>
                    <li v-if="!addr.defaultAddress">
                      <a
                        class="dropdown-item py-2"
                        @click="setAsDefault(addr.id)"
                      >
                        <i class="bi bi-check-circle me-2 text-success"></i>Đặt
                        mặc định
                      </a>
                    </li>
                    <li><hr class="dropdown-divider" /></li>
                    <li>
                      <a
                        class="dropdown-item py-2 text-danger"
                        @click="removeAddress(addr.id)"
                      >
                        <i class="bi bi-trash me-2"></i>Xóa địa chỉ
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div
        v-if="showAddressModal"
        class="modal-overlay"
        @click.self="showAddressModal = false"
      >
        <div class="modal-card p-4">
          <h5 class="fw-bold mb-4">
            {{ addressForm.id ? "Cập nhật địa chỉ" : "Địa chỉ mới" }}
          </h5>
          <div class="row g-3">
            <div class="col-md-6">
              <input
                v-model="addressForm.receiverName"
                class="form-control custom-input"
                placeholder="Tên người nhận"
              />
            </div>
            <div class="col-md-6">
              <input
                v-model="addressForm.phoneNumber"
                class="form-control custom-input"
                placeholder="Số điện thoại"
              />
            </div>
            <div class="col-12">
              <select
                v-model="addressForm.provinceCode"
                @change="onProvinceChange"
                class="form-select custom-input"
              >
                <option value="">Chọn tỉnh / thành</option>
                <option v-for="p in provinces" :key="p.code" :value="p.code">
                  {{ p.name }}
                </option>
              </select>
            </div>
            <div class="col-md-6">
              <select
                v-model="addressForm.districtCode"
                @change="onDistrictChange"
                :disabled="!addressForm.provinceCode"
                class="form-select custom-input"
              >
                <option value="">Chọn quận / huyện</option>
                <option v-for="d in districts" :key="d.code" :value="d.code">
                  {{ d.name }}
                </option>
              </select>
            </div>
            <div class="col-md-6">
              <select
                v-model="addressForm.wardCode"
                :disabled="!addressForm.districtCode"
                class="form-select custom-input"
              >
                <option value="">Chọn phường / xã</option>
                <option v-for="w in wards" :key="w.code" :value="w.code">
                  {{ w.name }}
                </option>
              </select>
            </div>
            <div class="col-12">
              <textarea
                v-model="addressForm.detailAddress"
                class="form-control custom-input"
                rows="2"
                placeholder="Số nhà, tên đường (Chi tiết)..."
              ></textarea>
            </div>
            <div class="col-12">
              <div class="d-flex gap-2">
                <button
                  type="button"
                  class="btn btn-gender-select flex-fill"
                  :class="{ active: addressForm.addressType === 'HOME' }"
                  @click="addressForm.addressType = 'HOME'"
                >
                  Nhà riêng
                </button>
                <button
                  type="button"
                  class="btn btn-gender-select flex-fill"
                  :class="{ active: addressForm.addressType === 'OFFICE' }"
                  @click="addressForm.addressType = 'OFFICE'"
                >
                  Văn phòng
                </button>
              </div>
            </div>
            <div
              class="col-12"
              v-if="!addressForm.id || !addressForm.defaultAddress"
            >
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="addressForm.defaultAddress"
                  id="swDefault"
                />
                <label class="form-check-label" for="swDefault"
                  >Đặt làm địa chỉ mặc định</label
                >
              </div>
            </div>
          </div>
          <div class="d-flex gap-2 mt-4">
            <button
              class="btn btn-light w-100 rounded-pill"
              @click="showAddressModal = false"
            >
              Hủy
            </button>
            <button
              class="btn btn-dark w-100 rounded-pill"
              :disabled="isSubmitting"
              @click="handleSaveAddress"
            >
              {{ isSubmitting ? "Đang lưu..." : "Lưu địa chỉ" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import profileApi from "@/api/profileApi";
import { ref, onMounted, reactive, nextTick, inject, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
import SecurityDashboard from "@/views/auth/SecurityDashboard.vue";

const authStore = useAuthStore();
const notify = inject("$notify");

const isEditing = ref(false);
const isLoading = ref(false);
const firstInput = ref(null);
const showAddressModal = ref(false);
const isSecurityOpen = ref(false);

const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);
const addresses = ref([]);
const isSubmitting = ref(false);

const defaultAvatar =
  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

const formData = reactive({
  nickname: "",
  fullName: "",
  gender: "ORTHER",
  dob: "",
  avatarUrl: "",
});

const addressForm = ref({
  id: null,
  receiverName: "",
  phoneNumber: "",
  detailAddress: "",
  defaultAddress: false,
  provinceCode: "",
  districtCode: "",
  wardCode: "",
  addressType: "HOME",
});

const syncFromStore = () => {
  const userData = authStore.user;
  if (userData) {
    const copyData = JSON.parse(JSON.stringify(userData));

    Object.assign(formData, {
      nickname: copyData.nickname || "",
      fullName: copyData.fullName || "",
      gender: copyData.gender || "ORTHER",
      dob: copyData.dob ? copyData.dob.substring(0, 10) : "",
      avatarUrl: copyData.avatarUrl || "",
    });
  }
};

onMounted(() => {
  syncFromStore();
});

const displayInfo = computed(() => {
  return {
    nickname: authStore.user?.nickname || "Thành viên mới",
    fullName: authStore.user?.fullName || "",
  };
});

const loadData = async () => {
  try {
    const [profileData, addrData] = await Promise.all([
      profileApi.getMyProfile(),
      profileApi.getMyAddresses(),
    ]);
    authStore.user = { ...authStore.user, ...profileData };
    syncFromStore();
    addresses.value = addrData;
    console.log("Danh sách địa chỉ từ API:", addrData);
  } catch (e) {
    notify.error("Không thể tải dữ liệu hồ sơ");
  }
};

onMounted(loadData);

const toggleEdit = async () => {
  if (isEditing.value) {
    syncFromStore();
    isEditing.value = false;
  } else {
    isEditing.value = true;
    await nextTick();
    firstInput.value?.focus();
  }
};

const saveChanges = async () => {
  try {
    isLoading.value = true;

    await profileApi.updateMyProfile({ ...formData });
    await authStore.fetchProfile();

    isEditing.value = false;
    notify.success("Cập nhật thành công!");
  } catch (error) {
    console.error(error);
    notify.error("Không thể lưu thay đổi!");
  } finally {
    isLoading.value = false;
  }
};

const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const uploadedUrl = await profileApi.uploadAvatar(file);
    formData.avatarUrl = uploadedUrl;
    await authStore.fetchProfile();
    notify.success("Đã cập nhật ảnh đại diện");
  } catch (e) {
    notify.error("Lỗi tải ảnh lên");
  }
};

const fetchProvinces = async () => {
  try {
    provinces.value = (await profileApi.getProvinces()) || [];
  } catch (e) {
    notify.error("Lỗi tải tỉnh thành");
  }
};

const fetchUserProfile = async () => {
  console.log("Dashboard báo đã cập nhật, đang load lại profile ở cha...");
  await profileApi.getMyProfile();
};

const onProvinceChange = async () => {
  districts.value = [];
  wards.value = [];
  addressForm.value.districtCode = "";
  addressForm.value.wardCode = "";
  if (addressForm.value.provinceCode) {
    districts.value = await profileApi.getDistricts(
      addressForm.value.provinceCode,
    );
  }
};

const onDistrictChange = async () => {
  wards.value = [];
  addressForm.value.wardCode = "";
  if (addressForm.value.districtCode) {
    wards.value = await profileApi.getWards(addressForm.value.districtCode);
  }
};

const openAddressModal = async (data = null) => {
  await fetchProvinces();
  if (data) {
    addressForm.value = { ...data, defaultAddress: !!data.defaultAddress };
    try {
      districts.value =
        (await profileApi.getDistricts(data.provinceCode)) || [];
      wards.value = (await profileApi.getWards(data.districtCode)) || [];
    } catch (e) {
      console.error(e);
    }
  } else {
    addressForm.value = {
      id: null,
      receiverName: formData.fullName,
      phoneNumber: "",
      detailAddress: "",
      defaultAddress: false,
      provinceCode: "",
      districtCode: "",
      wardCode: "",
      addressType: "HOME",
    };
    districts.value = [];
    wards.value = [];
  }
  showAddressModal.value = true;
};

const handleSaveAddress = async () => {
  if (isSubmitting.value) return;

  // --- VALIDATOR MỚI ---
  if (!addressForm.value.receiverName.trim())
    return notify.warning("Vui lòng nhập tên người nhận");
  if (!addressForm.value.phoneNumber.trim())
    return notify.warning("Vui lòng nhập số điện thoại");
  if (!addressForm.value.wardCode)
    return notify.warning("Vui lòng chọn đầy đủ Tỉnh/Huyện/Xã");
  if (
    !addressForm.value.detailAddress ||
    addressForm.value.detailAddress.trim().length < 5
  ) {
    notify.warning("Vui lòng nhập địa chỉ cụ thể (ít nhất 5 ký tự)");
    return;
  }

  try {
    isSubmitting.value = true;
    const payload = {
      ...addressForm.value,
      default: addressForm.value.defaultAddress, // Đồng bộ với Backend field name
    };

    if (addressForm.value.id) {
      await profileApi.updateAddress(addressForm.value.id, payload);
      notify.success("Cập nhật địa chỉ thành công");
    } else {
      await profileApi.createAddress(payload);
      notify.success("Thêm địa chỉ mới thành công");
    }
    showAddressModal.value = false;
    await loadData();
  } catch (e) {
    notify.error("Lỗi khi lưu địa chỉ. Vui lòng thử lại!");
  } finally {
    isSubmitting.value = false;
  }
};

const removeAddress = async (id) => {
  if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;
  try {
    await profileApi.deleteAddress(id);
    await loadData();
    notify.success("Đã xóa địa chỉ thành công");
  } catch (e) {
    notify.error("Không thể xóa địa chỉ này!");
  }
};

const setAsDefault = async (id) => {
  try {
    console.log("Đang gọi API đặt mặc định cho ID:", id);
    // Gọi API
    await profileApi.setDefaultAddress(id);
    notify.success("Đã thay đổi địa chỉ mặc định");
    await loadData();
  } catch (e) {
    console.error("Lỗi chi tiết từ Server:", e.response?.data);
    notify.error(e.response?.data?.message || "Không thể đặt địa chỉ mặc định");
  }
};
</script>

<style scoped>
.avatar-container {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  position: relative;
  padding: 4px;
  background: white;
}
.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
.upload-badge {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 32px;
  height: 32px;
  background: #000;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid #fff;
}
.shadow-custom {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05) !important;
}
.profile-main-card {
  border-radius: 20px !important;
}
.icon-box-profile {
  width: 42px;
  height: 42px;
  background: #f0f2f5;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}
.form-label-custom {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6c757d;
  margin-bottom: 5px;
}
.custom-input {
  border: 2px solid #f1f1f1;
  border-radius: 10px;
  padding: 8px 12px;
}
.custom-input:focus {
  border-color: #000;
  box-shadow: none;
}
.btn-edit-toggle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background: #f8f9fa;
  transition: 0.3s;
}
.btn-edit-toggle.is-editing {
  background: #fff5f5;
  color: #dc3545;
}
.btn-gender-select {
  border: 2px solid #f1f1f1;
  background: white;
  border-radius: 10px;
  padding: 8px;
  font-size: 0.85rem;
  transition: 0.2s;
}
.btn-gender-select.active {
  background: #1a1a1a;
  color: white;
  border-color: #1a1a1a;
}

/* FIX UI ĐỊA CHỈ */
.address-item {
  border: 1.5px solid #f0f0f0 !important;
  background: #fff;
  transition: all 0.2s;
}
.address-item:hover {
  border-color: #ddd !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05) !important;
}
.address-default-card {
  border-color: #ffc107 !important;
  background-color: #fffdf5 !important;
}

/* FIX DROPDOWN BỊ CHE */
.dropdown {
  z-index: 10;
}

.dropdown-menu {
  position: absolute;
  z-index: 9999 !important;
}

.custom-dropdown {
  z-index: 1060 !important;
  border: none !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}

/* NGÔI SAO MẶC ĐỊNH */
.star-mark {
  position: absolute;
  top: 10px;
  right: 50px; /* Đẩy xa nút 3 chấm */
  color: #ffc107 !important;
  font-size: 1.2rem;
  z-index: 5;
  pointer-events: none;
}

.badge-type {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 5px;
  text-transform: uppercase;
}
.small-badge {
  font-size: 9px;
  padding: 3px 6px;
}
.vr {
  width: 1px;
  background: #dee2e6;
  height: 14px;
  margin: 0 5px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-card {
  background: white;
  width: 95%;
  max-width: 450px;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
