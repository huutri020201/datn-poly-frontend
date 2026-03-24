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
                <i class="bi bi-stadium me-2"></i>
                {{
                  isEditing
                    ? "Cập nhật thông tin sân bóng"
                    : "Thêm sân bóng mới vào hệ thống"
                }}
              </h5>
              <div v-if="isEditing" class="badge bg-warning text-dark px-3">
                Đang chỉnh sửa ID: {{ editingId }}
              </div>
            </div>

            <div class="row">
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label small fw-bold text-uppercase"
                    >Tên sân</label
                  >
                  <input
                    v-model="form.name"
                    type="text"
                    class="form-control"
                    required
                    placeholder="VD: Sân Cỏ Nhân Tạo số 1"
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold text-uppercase"
                    >Giá thuê mỗi giờ (VNĐ)</label
                  >
                  <div class="input-group">
                    <input
                      v-model="form.pricePerHour"
                      type="number"
                      class="form-control"
                      required
                      placeholder="150000"
                    />
                    <span class="input-group-text">₫/h</span>
                  </div>
                </div>
              </div>

              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label small fw-bold text-uppercase"
                    >Địa chỉ / Vị trí</label
                  >
                  <input
                    v-model="form.address"
                    type="text"
                    class="form-control"
                    placeholder="VD: Khu A, Góc phải..."
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold text-uppercase"
                    >Link Ảnh Bìa (URL)</label
                  >
                  <input
                    v-model="form.imageUrl"
                    type="text"
                    class="form-control"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label small fw-bold text-uppercase"
                    >Mô tả thêm</label
                  >
                  <textarea
                    v-model="form.description"
                    class="form-control"
                    rows="4"
                    placeholder="Tình trạng thảm, bóng đèn..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div
              class="mt-3 border-top pt-4 d-flex justify-content-center gap-3"
            >
              <button
                type="submit"
                class="btn btn-dark btn-lg px-5 shadow-sm fw-bold"
              >
                <i class="bi bi-save me-2"></i>
                {{ isEditing ? "LƯU CẬP NHẬT" : "TẠO SÂN MỚI" }}
              </button>
              <button
                v-if="isEditing"
                type="button"
                @click="resetForm"
                class="btn btn-outline-secondary btn-lg px-5 fw-bold"
              >
                HỦY
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="col-12">
        <div class="bg-white p-4 rounded shadow-sm border">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="mb-0 fw-bold">
              <i class="bi bi-list-check me-2"></i>Danh Sách Sân Bãi
            </h5>
            <button class="btn btn-sm btn-outline-dark" @click="fetchPitches">
              <i class="bi bi-arrow-clockwise me-1"></i> Làm mới
            </button>
          </div>

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-success" role="status"></div>
          </div>

          <div v-else class="table-responsive">
            <table
              class="table table-hover align-middle text-center border custom-table"
            >
              <thead class="table-secondary text-uppercase small">
                <tr>
                  <th width="100">Ảnh</th>
                  <th class="text-start">Tên sân</th>
                  <th>Địa chỉ</th>
                  <th>Giá / Giờ</th>
                  <th>Trạng thái</th>
                  <th width="150">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pitch in pitches" :key="pitch.id">
                  <td>
                    <img
                      :src="
                        pitch.imageUrl || 'https://via.placeholder.com/80x60'
                      "
                      class="rounded border shadow-sm"
                      style="width: 80px; height: 55px; object-fit: cover"
                    />
                  </td>
                  <td class="text-start fw-bold text-primary">
                    {{ pitch.name }}
                  </td>
                  <td class="text-start small text-muted">
                    {{ pitch.address || "Chưa cập nhật" }}
                  </td>
                  <td class="text-danger fw-bold">
                    {{ formatCurrency(pitch.pricePerHour) }}
                  </td>
                  <td>
                    <span class="badge bg-success">Hoạt động</span>
                  </td>
                  <td>
                    <div class="btn-group shadow-sm">
                      <button
                        @click="editPitch(pitch)"
                        class="btn btn-sm btn-outline-primary px-3"
                        title="Sửa"
                      >
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button
                        @click="removePitch(pitch.id)"
                        class="btn btn-sm btn-outline-danger px-3"
                        title="Xóa"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="pitches.length === 0">
                  <td colspan="6" class="py-5 text-muted">
                    Chưa có sân nào trên hệ thống
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
  getAllPitches,
  createPitch,
  updatePitch,
  deletePitch,
} from "@/api/pitchApi";

const pitches = ref([]);
const loading = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const form = ref({
  name: "",
  pricePerHour: "",
  address: "",
  description: "",
  imageUrl: "",
});

// FETCH DATA
const fetchPitches = async () => {
  loading.value = true;
  try {
    const res = await getAllPitches();
    pitches.value = res.data.result || res.data;
  } catch (err) {
    console.error("Lỗi lấy danh sách sân:", err);
  } finally {
    loading.value = false;
  }
};

// SUBMIT
const submitForm = async () => {
  try {
    if (isEditing.value) {
      await updatePitch(editingId.value, form.value);
      alert("Cập nhật thành công!");
    } else {
      await createPitch(form.value);
      alert("Tạo sân mới thành công!");
    }
    await fetchPitches();
    resetForm();
  } catch (err) {
    console.error("Lỗi lưu sân:", err);
    alert("Có lỗi xảy ra, vui lòng kiểm tra lại!");
  }
};

// EDIT
const editPitch = (pitch) => {
  isEditing.value = true;
  editingId.value = pitch.id;
  form.value = {
    name: pitch.name,
    pricePerHour: pitch.pricePerHour,
    address: pitch.address || "",
    description: pitch.description || "",
    imageUrl: pitch.imageUrl || "",
  };
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// DELETE
const removePitch = async (id) => {
  if (!confirm("Bạn có chắc chắn muốn xóa sân này?")) return;
  try {
    await deletePitch(id);
    await fetchPitches();
  } catch (err) {
    alert("Không thể xóa sân này!");
  }
};

const resetForm = () => {
  isEditing.value = false;
  editingId.value = null;
  form.value = {
    name: "",
    pricePerHour: "",
    address: "",
    description: "",
    imageUrl: "",
  };
};

const formatCurrency = (price) => {
  if (!price) return "0đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

onMounted(fetchPitches);
</script>

<style scoped>
.bg-form-green {
  background: #f0fdf4; /* Xanh mint nhạt */
  border: 1px solid #dcfce7;
}

.custom-table thead th {
  background-color: #f8f9fa;
  color: #4b5563;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
}

.table td {
  padding: 15px 10px;
}

.badge {
  font-weight: 500;
  padding: 0.5em 0.8em;
}
</style>